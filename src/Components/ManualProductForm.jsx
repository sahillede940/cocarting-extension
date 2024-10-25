export default function ManualProductForm({ manualProduct, handleManualProductChange, addManualProduct }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Manually Add a Product</h3>
      <div className="space-y-2">
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={manualProduct.title}
          onChange={handleManualProductChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="url"
          placeholder="Product URL"
          value={manualProduct.url}
          onChange={handleManualProductChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="price"
          placeholder="Product Price (Optional)"
          value={manualProduct.price}
          onChange={handleManualProductChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (Optional)"
          value={manualProduct.imageUrl}
          onChange={handleManualProductChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        onClick={addManualProduct}
        className="mt-4 bg-blue-700 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Add Product Manually
      </button>
    </div>
  )
}