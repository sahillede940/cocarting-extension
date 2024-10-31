/* eslint-disable no-undef */
import Header from "./Components/Header";
import Popup from "./Popup";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import TipPopup from "./TipPopup";
import ToolbarTipPopup from "./ToolbarTipPopup";
import { useRef } from "react";

const isProductPage = (url) => {
  const productPatterns = [
    /\/p\//,
    /\/product\//,
    /\/dp\//,
    /item\.html/,
    /[-a-zA-Z0-9]+\/dp\/[-a-zA-Z0-9]+/,
  ];

  return productPatterns.some((pattern) => pattern.test(url));
};

export default function App() {
  console.log("User Info", JSON.parse(localStorage.getItem("user")));

  const [message, setMessage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const popupRef = useRef(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("userId")) || "1"
  );
  const [email,  setEmail] = useState('');
  const [showTips, setShowTips] = useState({
    firstTip: false,
    secondTip: false,
    completed: false,
  });
  const [showErrorToast, setShowErrorToast] = useState(true);
  const [isOnProductPage, setIsOnProductPage] = useState(false);

  useEffect(() => {
    // Check current page type
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        const currentUrl = tabs[0].url;
        const productPage = isProductPage(currentUrl);
        setIsOnProductPage(productPage);

        // If not on product page and tips not completed, show toolbar tip
        if (!productPage && userId && !showTips.completed) {
          setShowTips({ firstTip: false, secondTip: true, completed: false });
        }
      }
    });

    chrome.storage?.local.get(["wishlists", "currentProduct"], (result) => {
      if (result.currentProduct) {
        setCurrentProduct(result.currentProduct);
      }
    });
    

  }, [userId]);
  useEffect(()=>{
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        try {
          
          chrome.tabs.sendMessage(tabs[0].id, { action: "GET_USERID_FROM_LOCAL_STORAGE" }, (response) => {
            // chrome.storage.local.get({userId})
            const {userId, email } = response;
            setUserId(userId);
            setEmail(email);
          })
        } catch (err) {
          console.log("Error sending message from App.jsx", { err })
        }
      }
    });
  },[]);

  const onSuccess = (credentialResponse) => {
    const user = jwtDecode(credentialResponse.credential);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", JSON.stringify(user.sub));
    setUser(user);
    setUserId(user.sub);
    setShowTips({ firstTip: true, secondTip: false, completed: false });
    console.log("Login Success");
  };

  const handleToolbarTipClose = () => {
    window.close();
    chrome.runtime.sendMessage({ action: "closePopup" });
  };

  const handleFirstTipComplete = () => {
    setShowTips({ firstTip: false, secondTip: true, completed: false });
  };

  const handleSecondTipComplete = () => {
    setShowTips({ firstTip: false, secondTip: false, completed: true });
    localStorage.setItem(`tips_${userId}`, "completed");
    handleToolbarTipClose();
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
  //       chrome.storage?.local.remove("currentProduct", () => {
  //         setCurrentProduct(null);
  //       });
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
                  {showTips.secondTip && !isOnProductPage && (
                    <ToolbarTipPopup onComplete={handleSecondTipComplete} />
                  )}
                  {(showTips.completed || isOnProductPage) && (
                    <Popup
                      setMessage={setMessage}
                      user={user}
                      userId={userId}
                      currentProduct={currentProduct}
                      setCurrentProduct={setCurrentProduct}
                      isOnProductPage={isOnProductPage}
                    />
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
