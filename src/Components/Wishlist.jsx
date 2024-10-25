import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../constant";

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
      await axios.delete(`${API_URL}/delete_wishlist/${wishlistId}`);
      await fetchWishlists(userId);
      toast.success("Wishlist deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete wishlist");
    }
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
              className="flex justify-between  text-baseitems-center"
            >
              <button
                className={buttonClasses}
                onClick={() => handleWishlistChange(wishlist.id)}
              >
                {wishlist.name}
              </button>
              {isNewProduct ? (
                <button
                  className="ml-3 py-1 px-6 bg-indigo-600 text-white text-base rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none"
                  onClick={() => handleWishlistChange(wishlist.id)}
                >
                  Add
                </button>
              ) : (
                <button
                  className="ml-3 py-1 px-6 bg-red-500 text-white text-base rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none"
                  onClick={() => handleDeleteWishlist(wishlist.id)}
                >
                  Delete
                </button>
              )}
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
