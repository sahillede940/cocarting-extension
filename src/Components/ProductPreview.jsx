function convertPriceToNumber(priceStr) {
  const match = priceStr.replace(",", "").match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

export default function ProductPreview({ currentProduct }) {
  const { title, currentPrice, imageUrl, mrpPrice, rating } = currentProduct;

  const getShortTitle = (title) => {
    const words = title.split(" ");
    return words.length > 4 ? `${words.slice(0, 4).join(" ")}...` : title;
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center space-x-4 my-5">
        <img
          src={imageUrl}
          alt={getShortTitle(title)}
          className="h-32 w-32 rounded-md object-contain"
        />
        <div className="flex-1">
          <h3 className="text-base font-medium text-black">
            {getShortTitle(title)}
          </h3>
          {rating && (
            <div className="flex items-center text-yellow-500">
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
              <span className="ml-1 text-gray-500">({rating})</span>
            </div>
          )}
          <p className="mt-2 text-base font-bold text-black">
            Now ${convertPriceToNumber(currentPrice)}
          </p>
          {mrpPrice && (
            <p className="text-sm text-gray-500 line-through">${convertPriceToNumber(mrpPrice)}</p>
          )}
          <p className="mt-5 text-xs text-gray-500">Doesn&apos;t look right?</p>
          <p className="underline text-xs text-gray-500">TRY AGAIN.</p>
        </div>
      </div>
    </>
  );
}
