import { useState, useEffect } from "react";
import ProductPreview from "./Components/ProductPreview";
import Wishlist from "./Components/Wishlist";
import ProductList from "./Components/ProductList";
import axios from "axios";
import { API_URL } from "./constant";

export default function Popup({ setMessage, userId }) {
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [userNote, setUserNote] = useState("");
  const [showMoreWishlists, setShowMoreWishlists] = useState(false);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [refreshUrl, setRefreshUrl] = useState("");

  // Fetch wishlists for the user
  const fetchWishlists = async (user_id = userId) => {
    try {
      const response = await axios.get(`${API_URL}/get_wishlists/${user_id}`);
      setWishlists(response.data);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    }
  };

  useEffect(() => {
    fetchWishlists(userId);

    chrome.storage?.local.get(["wishlists", "currentProduct"], (result) => {
      if (result.currentProduct) {
        setCurrentProduct(result.currentProduct);
      }
    });
  }, [userId]);

  const handleWishlistChange = async (wishlistId) => {
    setSelectedWishlistId(wishlistId);
    if (!currentProduct) {
      try {
        const response = await axios.get(`${API_URL}/get_wishlist_products/${wishlistId}`);
        const formattedItems = response.data.map((item) => ({
          title: item.title,
          currentPrice: item.current_price,
          mrpPrice: item.mrp_price,
          rating: item.rating,
          imageUrl: item.image_url,
          url: item.url,
          websiteName: item.website_name,
          id: item.id,
          note: item.note,
        }));
        setWishlistItems(formattedItems);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    }
  };

  const createWishlist = async (wishlistName) => {
    try {
      await axios.post(`${API_URL}/create_wishlist`, { name: wishlistName, user_id: userId });
      await fetchWishlists(userId);
      setNewWishlistName("");
      setIsCreatingWishlist(false);
    } catch (error) {
      console.error("Error creating wishlist:", error);
    }
  };

  const removeWishlist = (wishlistName) => {
    const updatedWishlists = wishlists.filter((wishlist) => wishlist.name !== wishlistName);
    chrome.storage?.local.set({ wishlists: updatedWishlists }, () => {
      setWishlists(updatedWishlists);
      if (selectedWishlistId === wishlistName && updatedWishlists.length > 0) {
        setSelectedWishlistId(updatedWishlists[0].name);
        setWishlistItems(updatedWishlists[0].items);
      } else if (updatedWishlists.length === 0) {
        setSelectedWishlistId(null);
        setWishlistItems([]);
      }
    });
  };

  const removeProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/delete_product?product_id=${productId}`);
      await handleWishlistChange(selectedWishlistId);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const addProductToWishlist = () => {
    if (currentProduct) {
      axios
        .post(`${API_URL}/add_to_wishlist`, {
          product: {
            title: currentProduct.title,
            current_price: currentProduct.currentPrice,
            mrp_price: currentProduct.mrpPrice,
            rating: currentProduct.rating,
            image_url: currentProduct.imageUrl,
            url: currentProduct.url,
            website_name: currentProduct.websiteName,
            note: userNote,
          },
          wishlist_id: selectedWishlistId,
        })
        .then(() => {
          setCurrentProduct(null);
          setSelectedWishlistId(null);
          chrome.storage?.local.set({ currentProduct: null }, () => {
            chrome.runtime.sendMessage({ action: "closeWindow" });
          });
        })
        .catch((err) => console.error("Error adding product to wishlist:", err));
    }
  };

  const discardProduct = () => {
    chrome.storage?.local.remove("currentProduct", () => {
      setCurrentProduct(null);
    });
  };

  const fetchProductInfo = async () => {
    setLoading(true);
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const currentUrl = tabs[0].url;
        const response = await fetch("http://localhost:5050/product-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputUrl: currentUrl }),
        });
        const data = await response.json();
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching product info:", error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      const currentUrl = tabs[0].url;
      setRefreshUrl(currentUrl);
      setIsPopupVisible(true);
    });
  };

  const confirmRefresh = async () => {
    setIsPopupVisible(false);
    setLoading(true);
    try {
      const response = await fetch("https://cron-job-9njv.onrender.com/product-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputUrl: refreshUrl }),
      });
      const data = await response.json();
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing product info:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2  max-w-full sm:max-w-md mx-auto overflow-hidden">
      {loading && (
        <div className="text-center py-4">
          <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
          <p>Loading...</p>
        </div>
      )}

      {!currentProduct && !loading && (
        <div className="text-center">
          <button
            onClick={handleRefresh}
            className="bg-green-500 text-white px-4 py-1 text-base rounded hover:bg-green-600 transition duration-300"
          >
            Refresh Product Info
          </button>
        </div>
      )}

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg mb-4">Refresh Data</h2>
            <p>Are you sure you want to refresh data from the following URL?</p>
            <p className="font-semibold text-blue-600 mb-4">{refreshUrl}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsPopupVisible(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button onClick={confirmRefresh} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {currentProduct && <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Save to Wishlist</h2>}

      {currentProduct && <ProductPreview currentProduct={currentProduct} />}
      {currentProduct && (
        <div className="flex items-center">
          <label className="text-base mr-4">Note:</label>
          <textarea
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Enter note"
            className="flex-grow py-1 px-3 border rounded-md text-base focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      )}
      {currentProduct && (
        <div className="flex justify-center">
          <button
            onClick={discardProduct}
            className="mt-2 m-2 bg-red-600 text-white text-base px-4 py-2 rounded w-1/2 hover:bg-red-700 transition duration-300"
          >
            Discard
          </button>
        </div>
      )}
      {currentProduct && <hr className="border-gray-300" />}

      {isCreatingWishlist ? (
        <div className="py-2 flex items-center">
          <input
            type="text"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            placeholder="Enter wishlist name"
            className="flex-grow text-base py-1 px-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={() => createWishlist(newWishlistName)}
            className="py-1 px-4 ml-1 bg-indigo-600 text-base text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none"
          >x  
            Add
          </button>
          <button
            onClick={() => {
              setIsCreatingWishlist(false);
              setNewWishlistName("");
            }}
            className="py-1 px-3 text-base text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      ) : (
        <h3
          className="p-2 text-xl font-semibold text-center text-blue-700 cursor-pointer"
          onClick={() => setIsCreatingWishlist(true)}
        >
          <span className="text-2xl">+</span>
          New Wishlist
        </h3>
      )}

      <Wishlist
        wishlists={wishlists}
        selectedWishlistId={selectedWishlistId}
        handleWishlistChange={handleWishlistChange}
        removeWishlist={removeWishlist}
        showMoreWishlists={showMoreWishlists}
        setShowMoreWishlists={setShowMoreWishlists}
        isNewProduct={Boolean(currentProduct)}
        fetchWishlists={fetchWishlists}
        userId={userId}
      />

      {currentProduct && (
        <div className="flex justify-center">
          <button
            onClick={addProductToWishlist}
            className="mt-4  bg-indigo-600 text-white px-4 py-2 text-base rounded-lg w-1/2 hover:bg-indigo-700 transition duration-300"
          >
            Done
          </button>
        </div>
      )}

      {!currentProduct && selectedWishlistId && (
        <ProductList
          wishlistItems={wishlistItems}
          removeProduct={removeProduct}
          showMoreItems={showMoreItems}
          setShowMoreItems={setShowMoreItems}
        />
      )}
    </div>
  );
}
