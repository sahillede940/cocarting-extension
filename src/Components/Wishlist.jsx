/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Wishlist({
  wishlists,
  selectedWishlistId,
  handleWishlistChange,
  showMoreWishlists,
  setShowMoreWishlists,
  isNewProduct,
  fetchWishlists,
  userId,
}) {
  const visibleWishlists = showMoreWishlists
    ? wishlists
    : wishlists.slice(0, 3);

  const handleDeleteWishlist = async (wishlistId) => {
    toast.info("Deleting wishlist...");
    try {
      await axios.delete(`${API_URL}/cocarts/${wishlistId}`); // Fixed template literal
      await fetchWishlists(userId);
      toast.success("Wishlist deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete wishlist");
    }
  };

  const handleWishlistClick = (wishlistId, wishlistName) => {
    if (!wishlistName) {
      toast.error("Wishlist name cannot be empty");
      return;
    }
    if (selectedWishlistId === wishlistId) {
      handleWishlistChange(null);
    } else {
      handleWishlistChange(wishlistId);
    }
  };

  const handleAddWishlist = (wishlistId, wishlistName) => {
    if (!wishlistName) {
      toast.error("Wishlist name cannot be empty");
      return;
    }
    handleWishlistChange(wishlistId);
  };

  return (
    <div className="py-2 w-full max-w-md mx-auto">
      <ul className="space-y-1">
        {visibleWishlists.map((wishlist) => {
          const isSelected = selectedWishlistId === wishlist.id;
          const buttonClasses = `py-1 px-4 rounded-md flex-grow text-left text-base text-gray-700 ${
            isSelected
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-white hover:bg-gray-50"
          } transition-colors duration-200 focus:outline-none`;

          return (
            <li
              key={wishlist.id}
              className="flex justify-between items-center text-base"
            >
              <button
                className={buttonClasses}
                onClick={() => handleWishlistClick(wishlist.id, wishlist.name)}
              >
                {wishlist.name}
              </button>
              <div className="flex space-x-2">
                <button
                  className="ml-3 py-1 px-6 bg-indigo-600 text-white text-base rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none"
                  onClick={() => handleAddWishlist(wishlist.id, wishlist.name)}
                >
                  Add
                </button>
                <button
                  className="ml-3 py-1 px-2 bg-red-500 text-white text-base rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none"
                  onClick={() => handleDeleteWishlist(wishlist.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {wishlists.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowMoreWishlists(!showMoreWishlists)}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {showMoreWishlists ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
