import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import api from "../api/client";
import StatCard from "../components/StatCard";
import { formatCurrency, formatDate, statusColors } from "../utils/format";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/dashboard/summary");
        setSummary(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (!summary) return <p className="text-slate-500">No data available.</p>;

  const chartData = summary.dailyStats.map((d) => ({
    date: d._id.slice(5),
    orders: d.orders,
    revenue: d.revenue,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Orders Today" value={summary.ordersToday} />
        <StatCard label="Revenue" value={formatCurrency(summary.revenue)} accent="text-green-600" />
        <StatCard label="Products" value={summary.productsCount} />
        <StatCard label="Pending Orders" value={summary.pendingOrders} accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-medium text-slate-600 mb-4">Revenue (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-medium text-slate-600 mb-4">Orders (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-medium text-slate-600 mb-4">Top Selling Products</h2>
          <ul className="divide-y divide-slate-100">
            {summary.topProducts.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-700">{p.name}</span>
                <span className="text-slate-500">{p.sold} sold</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-medium text-slate-600 mb-4">Recent Orders</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td className="py-2 text-slate-700">{o.customer?.name}</td>
                  <td className="py-2 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
