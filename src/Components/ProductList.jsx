export default function ProductList({
  wishlistItems,
  removeProduct,
  showMoreItems,
  setShowMoreItems,
}) {
  const visibleItems = showMoreItems
    ? wishlistItems
    : wishlistItems.slice(0, 3);

  const getShortTitle = (title) => {
    const words = title.split(" ");
    return words.length > 4 ? `${words.slice(0, 4).join(" ")}...` : title;
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Items in Wishlist</h3>
      {visibleItems.length > 0 ? (
        <div className="space-y-4">
          {visibleItems.map((currentProduct, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-row space-x-4 border rounded-lg shadow-sm items-center justify-center"
            >
              <img
                src={currentProduct.imageUrl}
                alt={getShortTitle(currentProduct.title)}
                className="h-32 w-32 object-contain rounded-md"
              />
              <div className="flex-1">
                <h4 className="text-base font-medium text-black">
                  {getShortTitle(currentProduct.title)}
                </h4>
                {currentProduct.rating && (
                  <div className="flex items-center text-yellow-500">
                    {"★".repeat(Math.floor(currentProduct.rating))}
                    {"☆".repeat(5 - Math.floor(currentProduct.rating))}
                    <span className="ml-1 text-gray-500">
                      ({currentProduct.rating})
                    </span>
                  </div>
                )}
                <p className="mt-5 text-base font-bold text-black">
                  ${currentProduct.currentPrice}
                </p>
                {currentProduct.mrpPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ${currentProduct.mrpPrice}
                  </p>
                )}
                <a
                  href={currentProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-3 block"
                >
                  View Product
                </a>
                <p>
                  Note
                  <textarea
                    className="text-xs text-gray-500 p-2 resize-none rounded-md"
                    value={currentProduct.note}
                    disabled
                  ></textarea>
                </p>
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-3"
                  onClick={() => removeProduct(currentProduct.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No items in this wishlist</p>
      )}
      {wishlistItems.length > 3 && (
        <button
          onClick={() => setShowMoreItems(!showMoreItems)}
          className="text-blue-600 hover:underline mt-4"
        >
          {showMoreItems ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
