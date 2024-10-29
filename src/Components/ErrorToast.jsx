const ErrorToast = ({ message, onClose }) => {
  const handleSave = async () => {
    // Send a message to the background script to save the product
    chrome.runtime.sendMessage(
      { type: "ADD_PRODUCT_TO_WISHLIST", selectedWishlist: "Default" },
      (response) => {
        console.log("Background response:", response);
      }
    );

    // Send a message to the content script to scrape product data if needed
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "SCRAPE_PRODUCT_DATA" });
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    onClose();
  };
  
  return (
    <div className="h-full bottom-4 right-4 bg-[#4338CA] text-white p-4 rounded-lg shadow-lg flex items-center">
      <span className="mr-4">⚠️ {message}</span>
      <button
        onClick={() => {
          handleSave();
        }}
        className="bg-white text-purple-600 font-bold py-1 px-3 rounded-md"
      >
        Let&apos;s Save it
      </button>
    </div>
  );
};

export const ErrorToastComponent = ({ onClose }) => {
  return (
    <ErrorToast message="Product not Saved to WishList!" onClose={onClose} />
  );
};

export default ErrorToast;
