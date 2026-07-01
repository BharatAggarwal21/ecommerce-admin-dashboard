import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import { formatCurrency, formatDate, statusColors } from "../utils/format";

const statuses = ["Pending", "Processing", "Delivered", "Cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders", {
        params: { page, limit: 8, status: statusFilter || undefined },
      });
      setOrders(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, { status });
      toast.success("Order status updated");
      setSelected(data.data);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-4 py-3 text-slate-800">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3 text-slate-700">{o.customer?.name}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(o)}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={fetchOrders} />

      {selected && (
        <Modal title={`Order #${selected._id.slice(-6).toUpperCase()}`} onClose={() => setSelected(null)}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500">Customer</p>
              <p className="text-slate-800 font-medium">{selected.customer?.name}</p>
              <p className="text-slate-500 text-xs">{selected.customer?.email}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Products</p>
              <ul className="divide-y divide-slate-100 border border-slate-100 rounded-md">
                {selected.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between px-3 py-2">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(selected.total)}</span>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Status</p>
              <select
                value={selected.status}
                onChange={(e) => handleStatusUpdate(selected._id, e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
