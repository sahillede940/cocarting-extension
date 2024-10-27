import Header from "./Components/Header";
import Popup from "./Popup";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import TipPopup from "./TipPopup";
import ToolbarTipPopup from "./ToolbarTipPopup";
import ErrorToast from "./Components/ErrorToast";

export default function App() {
  const [message, setMessage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("userId")) || "1"
  );
  const [showTips, setShowTips] = useState({
    firstTip: false,
    secondTip: false,
    completed: false,
  });
  const [showErrorToast, setShowErrorToast] = useState(true);

  useEffect(() => {
    chrome.storage?.local.get(["wishlists", "currentProduct"], (result) => {
      if (result.currentProduct) {
        setCurrentProduct(result.currentProduct);
      }
    });
  }, []);

  useEffect(() => {
    // Check if user has seen tips before
    const tipsStatus = localStorage.getItem(`tips_${userId}`);
    if (!tipsStatus && userId) {
      // New user, show first tip
      setShowTips({ firstTip: true, secondTip: false, completed: false });
    } else if (tipsStatus === "completed") {
      setShowTips({ firstTip: false, secondTip: false, completed: true });
    }
  }, [userId]);

  const onSuccess = (credentialResponse) => {
    const user = jwtDecode(credentialResponse.credential);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", JSON.stringify(user.sub));
    setUser(user);
    setUserId(user.sub);
    setShowTips({ firstTip: true, secondTip: false, completed: false });
    console.log("Login Success");
  };

  const handleFirstTipComplete = () => {
    setShowTips({ firstTip: false, secondTip: true, completed: false });
  };

  const handleSecondTipComplete = () => {
    setShowTips({ firstTip: false, secondTip: false, completed: true });
    localStorage.setItem(`tips_${userId}`, "completed");
  };

  const LogOutButton = () => {
    return (
      <button
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          setUser(null);
          setUserId(null);
        }}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
      >
        Log Out
      </button>
    );
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (popupRef.current && !popupRef.current.contains(event.target)) {
  //       setCurrentProduct(null);
  //       chrome.storage?.local.remove("currentProduct"); 
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleDummyError = () => {
    setShowErrorToast(true);
  };

  return (
    <>
      <div
        className="border-none rounded-2xl text-jakarta p-1"
        style={{ height: "100%", overflow: "hidden" }}
      >
        {/* {showErrorToast && Boolean(currentProduct) ? (
          <ErrorToast
            message="Product not Saved to WishList!"
            onClose={() => setShowErrorToast(false)}
          />
        ) : (
          <div
            className="border-none rounded-2xl text-jakarta p-2"
            style={{ height: "100%", overflow: "hidden" }}
          >
            <Header setMessage={setMessage} />

            {userId ? (
              <main className="container">
                <div className="flex justify-center items-center">
                  <div className="w-full max-w-4xl lg:max-w-6xl rounded-lg">
                    {showTips.firstTip && (
                      <TipPopup onComplete={handleFirstTipComplete} />
                    )}
                    {showTips.secondTip && (
                      <ToolbarTipPopup onComplete={handleSecondTipComplete} />
                    )}
                    {showTips.completed && (
                      <Popup setMessage={setMessage} userId={userId} currentProduct={currentProduct} setCurrentProduct={setCurrentProduct}  />
                    )}
                  </div>
                </div>
              </main>
            ) : (
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
                onClick={handleDummyError}
              >
                Login
              </button>
            )}
          </div>
        )} */}

        <div
            className="border-none rounded-2xl text-jakarta p-2"
            style={{ height: "100%", overflow: "hidden" }}
          >
            <Header setMessage={setMessage} />

            {userId ? (
              <main className="container">
                <div className="flex justify-center items-center">
                  <div className="w-full max-w-4xl lg:max-w-6xl rounded-lg">
                    {showTips.firstTip && (
                      <TipPopup onComplete={handleFirstTipComplete} />
                    )}
                    {showTips.secondTip && (
                      <ToolbarTipPopup onComplete={handleSecondTipComplete} />
                    )}
                    {showTips.completed && (
                      <Popup setMessage={setMessage} userId={userId} currentProduct={currentProduct} setCurrentProduct={setCurrentProduct}  />
                    )}
                  </div>
                </div>
              </main>
            ) : (
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
                onClick={handleDummyError}
              >
                Login
              </button>
            )}
          </div>
      </div>
    </>
  );
}
