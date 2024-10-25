import Modal from './Modal';

export default function Tip({ type, onClose, isOpen }) {
  const content = {
    wishlist: {
      title: 'Tip!',
      text: 'The WishList Save Button is located on the right edge of your screen.',
      image: '/placeholder.svg?height=100&width=100'
    },
    toolbar: {
      title: 'Toolbar Tip',
      text: 'For best results, save items from their product detail pages. This ensures CoCarting captures all the right details for your WishList.',
      image: null
    }
  };

  const { title, text, image } = content[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        <div className="bg-[#4338CA] text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="CoCarting Logo" className="w-6 h-6" />
            <span className="font-bold">CoCarting</span>
          </div>
          <button onClick={onClose} className="text-white text-xl">&times;</button>
        </div>
        <button onClick={onClose} className="absolute left-4 top-4 text-white text-2xl">
          &larr;
        </button>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          {image && (
            <div className="my-4 flex justify-center">
              <img src={image} alt="Tip illustration" className="w-[200px] h-[100px] object-contain" />
            </div>
          )}
          <p className="text-sm mb-4">{text}</p>
          <button
            onClick={onClose}
            className="w-full bg-[#4338CA] text-white py-2 rounded-md hover:bg-[#3730A3] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}