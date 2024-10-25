export default function ProductPreview({ currentProduct }) {
  const { title, currentPrice, imageUrl, mrpPrice, rating } = currentProduct;

  const getShortTitle = (title) => {
    const words = title.split(' ');
    return words.length > 4 ? `${words.slice(0, 4).join(' ')}...` : title;
  };

  return (
    <>
      <div className="flex flex-row items-start space-x-4">
        <img
          src={imageUrl}
          alt={getShortTitle(title)}
          className="h-32 w-32 object-cover rounded-md"
        />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-black">{getShortTitle(title)}</h3>
          {rating && (
            <div className="flex items-center text-yellow-500">
              {'★'.repeat(Math.floor(rating))}
              {'☆'.repeat(5 - Math.floor(rating))}
              <span className="ml-1 text-gray-500">({rating})</span>
            </div>
          )}
          <p className="text-lg font-bold text-black">{currentPrice}</p>
          {mrpPrice && <p className="text-sm text-gray-500 line-through">{mrpPrice}</p>}
          <p className="text-xs mt-2 text-gray-500">Having issues? Try saving from the toolbar icon</p>
        </div>
      </div>
    </>
  );
}
