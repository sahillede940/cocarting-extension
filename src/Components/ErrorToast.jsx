
const ErrorToast = ({ message, onClose }) => {
  return (
    <div className="h-full bottom-4 right-4 bg-[#4338CA] text-white p-4 rounded-lg shadow-lg flex items-center">
      <span className="mr-4">⚠️ {message}</span>
      <button
        onClick={onClose}
        className="bg-white text-purple-600 font-bold py-1 px-3 rounded-md"
      >
        Let&apos;s Save it
      </button>
    </div>
  );
};

export default ErrorToast;
