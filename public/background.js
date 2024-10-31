/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_POPUP") {
    chrome.storage.local.set({ currentProduct: message.product }, () => {
      chrome.action
        .openPopup()
        .then(() => {
          console.log("Extension popup opened");
        })
        .catch((error) => {
          console.error("Error opening popup:", error);
        });
    });
  } else if (message.type === "ADD_PRODUCT_TO_WISHLIST") {
    chrome.storage.local.get(["wishlists", "currentProduct"], (result) => {
      let wishlists = result.wishlists || [];
      let currentProduct = result.currentProduct;

      if (!currentProduct) {
        console.error("No product data found to add to wishlist.");
        return;
      }

      let selectedWishlist = wishlists.find(
        (w) => w.name === message.selectedWishlist
      );
      if (selectedWishlist) {
        selectedWishlist.items.push(currentProduct);

        chrome.storage.local.set({ wishlists }, () => {
          console.log("Product added to wishlist:", currentProduct);

          const notificationIcon =
            currentProduct.imageUrl ||
            chrome.runtime.getURL("icons/icon128.png");

          chrome.notifications.create(
            {
              type: "basic",
              iconUrl: notificationIcon,
              title: currentProduct.websiteName,
              message: `Product has been successfully added to ${selectedWishlist.name}!`,
              priority: 999,
            },
            (notificationId) => {
              if (chrome.runtime.lastError) {
                console.error("Notification error:", chrome.runtime.lastError);
              } else {
                console.log(
                  "Notification created successfully with ID:",
                  notificationId
                );
              }
            }
          );

          chrome.runtime.sendMessage({
            type: "PRODUCT_ADDED",
            selectedWishlist: selectedWishlist.name,
            product: currentProduct,
          });

          closePopup();
        });
      } else {
        console.error("Selected wishlist not found.");
      }
    });
  } else if (
    message.action === "closeWindow" ||
    message.action === "closePopup"
  ) {
    closePopup();
  }
});

function closePopup() {
  //To close extension
  chrome.windows.getCurrent((window) => {
    if (window.type === "popup") {
      chrome.windows.remove(window.id);
    }
  });
  //To close tab
  chrome.tabs.query( { windowType: "popup" },(tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   if (tabs.length > 0) {
  //     // Close the active tab, which is the popup
  //     chrome.tabs.remove(tabs[0].id);
  //   }
  // });
  

  // try {
  //   chrome.action.closePopup();
  // } catch (error) {
  //   console.error("Error closing popup:", error);
  // }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "USER_IDS") {
    // Store the received data in localStorage
    chrome.storage.local.set({ "email": message.data.email, "userId": message.data.userId }, () => {
      //console.log("Data stored in local storage:", {userId: message.data.userId, email: message.data.email})
      sendResponse({status: "success", data: {userId: message.data.userId, email: message.data.email}})
    });

    return true;
  }
});