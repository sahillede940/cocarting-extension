import logo from "../assets/logo.png";

export default function Header() {
  const handleClose = () => {
    window.close();
  };

  return (
    <header className="shadow-sm" style={{ background: "#4338CA1A" }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
