/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import ProductPreview from "./Components/ProductPreview";
import Wishlist from "./Components/Wishlist";
import ProductList from "./Components/ProductList";
import axios from "axios";
import { API_URL } from "./constant";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import DisablePopup from "./DisablePopup";
import ErrorToastComponent from './Components/ErrorToast'; // Adjust the path as necessary

function convertPriceToNumber(priceStr) {
  const match = priceStr.replace(",", "").match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}
function convertToSlug(url) {
  const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/");
  const slug = cleanUrl.filter((part) => part).pop() || "";
  return slug.slice(0, 200);
}

export default function Popup({
  setMessage,
  userId,
  user,
  currentProduct,
  setCurrentProduct,
  isOnProductPage,
}) {
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userNote, setUserNote] = useState("");
  const [showMoreWishlists, setShowMoreWishlists] = useState(false);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [refreshUrl, setRefreshUrl] = useState("");
  const [activeTab, setActiveTab] = useState("save");
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    // Close the popup when the error toast is shown
    if (showErrorToast) {
      window.close();
    }
  }, [showErrorToast]);

  // Fetch wishlists for the user
  const fetchWishlists = async (user_id = userId) => {
    try {
      const response = await axios.get(`${API_URL}/cocarts/${user_id}`);
      setWishlists(response.data);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    }
  };

  useEffect(() => {
    // If not on product page, show empty state or different content
    if (!isOnProductPage) {
      setCurrentProduct(null);
    }

    fetchWishlists(userId);

    chrome.storage?.local.get(["wishlists", "currentProduct"], (result) => {
      if (result.currentProduct && isOnProductPage) {
        setCurrentProduct(result.currentProduct);
      }
    });
  }, [userId, isOnProductPage]);

  const handleWishlistChange = async (wishlistId) => {
    setSelectedWishlistId(wishlistId);
    if (!currentProduct) {
      try {
        const response = await axios.get(
          `${API_URL}/cocarts/${wishlistId}/products`
        );

        console.log("response", response.data);
        const formattedItems = response.data.map((item) => ({
          title: item.name,
          currentPrice: item.price,
          mrpPrice: item.original_price,
          rating: item.customer_rating,
          imageUrl: item.images[0].image,
          url: item.product_tracking_url,
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
      await axios.post(`${API_URL}/cocarts`, {
        name: wishlistName,
        user_id: userId,
        slug: `${wishlistName}-${userId}`,
      });
      await fetchWishlists(userId);
      setNewWishlistName("");
      setIsCreatingWishlist(false);
    } catch (error) {
      console.error("Error creating wishlist:", error);
    }
  };

  const removeWishlist = (wishlistName) => {
    const updatedWishlists = wishlists.filter(
      (wishlist) => wishlist.name !== wishlistName
    );
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
      console.log("Deleting product with id:", productId);
      await axios.delete(`${API_URL}/products/${productId}`);
      await handleWishlistChange(selectedWishlistId);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  function addProductToWishlist() {
    if (currentProduct && selectedWishlistId) {
      console.log("Adding product to wishlist...");
      console.log("currentProduct",  {
        product: {
          name: currentProduct.title,
          price: convertPriceToNumber(currentProduct.currentPrice),
          original_price: convertPriceToNumber(currentProduct.mrpPrice),
          customer_rating: currentProduct.rating,
          image: currentProduct.imageUrl,
          product_tracking_url: currentProduct.url,
          slug: convertToSlug(currentProduct.url),
          added_by: Number(userId),
        },
        note: userNote,
        cocart_id: selectedWishlistId,
      });
      axios
        .post(`${API_URL}/cocart-products`, {
          product: {
            name: currentProduct.title,
            price: convertPriceToNumber(currentProduct.currentPrice),
            original_price: convertPriceToNumber(currentProduct.mrpPrice),
            customer_rating: currentProduct.rating,
            image: currentProduct.imageUrl,
            product_tracking_url: currentProduct.url,
            slug: convertToSlug(currentProduct.url),
            added_by: Number(userId),
          },
          note: userNote,
          cocart_id: selectedWishlistId,
        })
        .then(() => {
          setCurrentProduct(null);
          setSelectedWishlistId(null);

          // Clear storage and send close message
          // chrome.storage?.local.set({ currentProduct: null }, () => {
          //   // Send message to close popup
          //   chrome.runtime.sendMessage({ action: "closePopup" });

          //   // Also try direct window.close() as backup
          //   window.close();
          // });
        })
        .catch((err) => {
          console.error("Error adding product to wishlist:", err);
          setShowErrorToast(true); // Show the error toast
        });

      setShowErrorToast(true); // Show the error toast
    } else {
      console.error("No product or wishlist selected.");
    }
  }

  // const discardProduct = () => {
  //   chrome.storage?.local.remove("currentProduct", () => {
  //     setCurrentProduct(null);
  //   });
  // };

  // const fetchProductInfo = async () => {
  //   setLoading(true);
  //   try {
  //     chrome.tabs.query(
  //       { active: true, currentWindow: true },
  //       async function (tabs) {
  //         const currentUrl = tabs[0].url;
  //         const response = await fetch("http://localhost:5050/product-info", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ inputUrl: currentUrl }),
  //         });
  //         const data = await response.json();
  //         setLoading(false);
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error fetching product info:", error);
  //     setLoading(false);
  //   }
  // };

  // const handleRefresh = async () => {
  //   chrome.tabs.query(
  //     { active: true, currentWindow: true },
  //     async function (tabs) {
  //       const currentUrl = tabs[0].url;
  //       setRefreshUrl(currentUrl);
  //       setIsPopupVisible(true);
  //     }
  //   );
  // };

  const confirmRefresh = async () => {
    setIsPopupVisible(false);
    setLoading(true);
    try {
      const response = await fetch(
        "https://cron-job-9njv.onrender.com/product-info",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputUrl: refreshUrl }),
        }
      );
      const data = await response.json();
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing product info:", error);
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "save") {
      // discardProduct();
      setActiveTab("save");
    } else {
      setActiveTab("more");
    }
  };

  const renderContent = () => {
    if (activeTab === "more") {
      return <DisablePopup user={user} />;
    }

    if (!isOnProductPage) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-gray-600 text-center mb-4">
            Please navigate to a product page to save items to your wishlist.
          </p>
          <button
            onClick={() => window.close()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {currentProduct && (
          <div className="flex-none">
            <ProductPreview currentProduct={currentProduct} />
            <hr className="border-gray-100" />
          </div>
        )}

        <div className="flex-1">
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
                className="py-1 px-2 ml-1 bg-indigo-600 text-base text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsCreatingWishlist(false);
                  setNewWishlistName("");
                }}
                className="py-1 px-2 text-base text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h3
              className="p-2 text-xl font-medium text-center text-blue-700 cursor-pointer"
              onClick={() => setIsCreatingWishlist(true)}
            >
              <span className="text-2xl mr-2">+</span>
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
            <div className="mt-auto">
              <hr className="border-gray-100 my-4" />
              <div className="flex flex-col gap-2 w-full">
                <label className="text-base mr-4">Notes</label>
                <textarea
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Here you can add some details about the product"
                  className="flex-grow py-1 px-3 border rounded-md text-base focus:outline-none focus:ring-1 focus:ring-indigo-600 placeholder:text-[#44403C40] resize-none placeholder:text-base h-20"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={addProductToWishlist}
                  disabled={!selectedWishlistId}
                  className={`px-4 py-2 text-base rounded-lg w-1/2 transition duration-300 drop-shadow-[0px_20px_50px_0px_#4338CA26] ${
                    selectedWishlistId
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Done
                </button>
              </div>

              {/* <p className="mt-4 mb-2 text-xs text-gray-500 text-center">
                Having issues? Try saving from the toolbar icon.
              </p> */}
            </div>
          )}
        </div>

        {!currentProduct && selectedWishlistId && (
          <div className="flex-1">
            <ProductList
              wishlistItems={wishlistItems}
              removeProduct={removeProduct}
              showMoreItems={showMoreItems}
              setShowMoreItems={setShowMoreItems}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Fixed Header */}
      <div className="flex-none bg-white border-b border-gray-100 px-2 pt-2">
        {currentProduct && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center gap-2">
              <ChevronLeftIcon className="h-10 w-10 text-[#4338CA]" />
              <button
                className={`font-medium text-base ${
                  activeTab === "save" ? "text-black" : "text-gray-400"
                }`}
                onClick={() => handleTabClick("save")}
              >
                Save
              </button>
              <hr className="h-4 bg-black w-[2px]" />
              <button
                className={`font-medium text-base ${
                  activeTab === "more" ? "text-black" : "text-gray-400"
                }`}
                onClick={() => handleTabClick("more")}
              >
                More
              </button>
            </div>
          </div>
        )}

        {/* {!loading && !currentProduct && (
          <div className="text-center py-2">
            <button
              onClick={handleRefresh}
              className="bg-green-500 text-white px-4 py-1 text-base rounded hover:bg-green-600 transition duration-300"
            >
              Refresh Product Info
            </button>
          </div>
        )} */}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-2 py-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
              <p>Loading...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

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
              <button
                onClick={confirmRefresh}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorToast && (
        <ErrorToastComponent onClose={() => setShowErrorToast(false)} />
      )}
    </div>
  );
}
