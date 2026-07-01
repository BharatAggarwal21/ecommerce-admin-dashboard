import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Spinner, BoxIcon, CartIcon, UsersIcon, ChartIcon } from "../components/icons";

const features = [
  { icon: BoxIcon, label: "Product Management", desc: "Add, edit, and track inventory with ease" },
  { icon: CartIcon, label: "Order Tracking", desc: "Monitor orders from pending to delivered" },
  { icon: UsersIcon, label: "Customer Insights", desc: "See who's buying and how much they spend" },
  { icon: ChartIcon, label: "Sales Analytics", desc: "Revenue trends and top-selling products" },
];

const Login = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@ecommdash.com");
    setPassword("Admin@123");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <p className="text-sm font-medium text-slate-400 mb-2">E-Commerce</p>
          <h1 className="text-4xl font-semibold mb-4">Admin Dashboard</h1>
          <p className="text-slate-400 mb-10 max-w-sm">
            Everything you need to run your store — products, orders,
            customers, and sales, all in one place.
          </p>
          <div className="space-y-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg bg-slate-800 p-2.5">
                  <Icon className="text-slate-300" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1 lg:hidden">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mb-4">Sign in to manage your store</p>

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-left hover:bg-blue-100 transition-colors"
          >
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
              Demo Credentials
            </p>
            <p className="text-sm text-blue-900 font-medium">
              admin@ecommdash.com <span className="text-blue-400">/</span> Admin@123
            </p>
            <p className="text-xs text-blue-500 mt-1">Click to autofill</p>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {loading && <Spinner />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          {loading && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              First login can take up to a minute while the server wakes up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
