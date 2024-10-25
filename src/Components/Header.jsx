import cocartingLogo from "../assets/cocarting_logo.png";

export default function Header() {
  const handleClose = () => {
    window.close();
  };

  return (
    <header className="shadow-sm rounded-tl-[10px] rounded-tr-[10px] relative" style={{ background: "#4338CA" }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="pt-1 pb-2">
          <img src={cocartingLogo} alt="Logo" className="h-8 w-auto" />
        </div>
      </div>
      <button
        onClick={handleClose}
        className="text-white focus:outline-none absolute top-0 right-0 m-1"
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
    </header>
  );
}
