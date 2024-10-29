export default function DisablePopup({ user }) {
  console.log("disable popup user", user);
  return (
    <div
      className="bg-white max-w-full sm:max-w-md mx-auto overflow-hidden h-full text-jakarta"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <div className="flex flex-col justify-start items-start w-full">
        <h3 className="text-xl text-[#44403c] font-medium text-jakarta">
          Pranit Patil
        </h3>
        <hr className="border-gray-100 w-full my-2" />
        <div className="flex flex-col justify-start items-start w-full gap-2 font-jakarta">
          <button
            className="text-base text-[#44403C] font-normal font-jakarta"
            onClick={() => {}}
          >
            View my WishLists
          </button>
          <button className="text-base text-[#44403C] font-normal">
            Report an issue with amazon.com
          </button>
          <button className="text-base text-[#44403C] font-normal">
            Disable CoCarting on amazon.com
          </button>
          <button className="text-base text-[#44403C] font-normal">
            Sign Out
          </button>
        </div>
        <div className="flex justify-center items-center mt-5 bg-[#4338CA1A] p-2 rounded-bl-lg rounded-br-lg">
          <p className="text-[#44403C] font-extralight font-jakarta">
            <span className="underline">Click here</span> to learn of the 3 ways
            you can add products to your WishLists.
          </p>
        </div>
      </div>
    </div>
  );
}
