import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import Modal from "../components/Modal";
import { PencilIcon, TrashIcon } from "../components/icons";

const emptyForm = { name: "", description: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/categories/${editing._id}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/categories", form);
        toast.success("Category created");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
        <button
          onClick={openCreate}
          className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          categories.map((c) => (
            <div key={c._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-800">{c.name}</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEdit(c)}
                    title="Edit"
                    aria-label="Edit category"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    title="Delete"
                    aria-label="Delete category"
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1">{c.description}</p>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Category" : "Add Category"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800"
            >
              {editing ? "Save Changes" : "Create Category"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Categories;
