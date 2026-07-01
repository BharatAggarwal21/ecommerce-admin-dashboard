const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">
          &times;
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

export default Modal;
