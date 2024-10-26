import { ChevronLeftIcon } from "@heroicons/react/16/solid";

export default function ToolbarTipPopup({ onComplete }) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg p-2 max-w-full sm:max-w-md mx-auto overflow-hidden h-full"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <ChevronLeftIcon className="h-10 w-10 text-[#4338CA]" />

      <div className="flex flex-col justify-between items-center">
        <h2 className="text-xl mb-2 text-[#44403C] font-semibold">
          Toolbar Tip
        </h2>
        <p className="text-[#44403C] w-5/6 text-center font-extralight">
          For best results, save items from their product detail pages. This
          ensures CoCarting captures all the right details for your WishList.
        </p>
        <div className="flex justify-center items-center">
          <button
            onClick={onComplete}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 text-base rounded-lg hover:bg-indigo-700 transition duration-300 drop-shadow-[0px_20px_50px_0px_#4338CA26]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
