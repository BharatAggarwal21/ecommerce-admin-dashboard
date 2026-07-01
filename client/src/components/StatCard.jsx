const StatCard = ({ label, value, accent = "text-slate-900" }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-2xl font-semibold mt-1 ${accent}`}>{value}</p>
  </div>
);

export default StatCard;
