async function fetchSelectors(websiteName) {
  try {
    const response = await fetch(
      "https://cron-job-9njv.onrender.com/selector",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ website_name: websiteName }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching selectors:", error);
    return null;
  }
}

function isValidURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function fixImageUrl(url) {
  if (url && url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

function getValidData(selectorsArray, attribute = "innerText") {
  for (let selector of selectorsArray) {
    try {
      let element = document.querySelector(selector);
      if (element) {
        let value;
        if (attribute === "src") {
          value =
            element.getAttribute("src") ||
            element.getAttribute("data-src") ||
            element.getAttribute("data-lazy-src") ||
            element.getAttribute("data-original") ||
            element.getAttribute("srcset") ||
            element.getAttribute("data-image") ||
            element.getAttribute("href") ||
            element.getAttribute("content");

          value = fixImageUrl(value);
          if (value) {
            return value;
          }
        } else {
          value =
            element[attribute]?.trim() ||
            element.textContent?.trim() ||
            (element.getAttribute("content") &&
              element.getAttribute("content").trim()) ||
            (element.getAttribute("value") &&
              element.getAttribute("value").trim()) ||
            (element.getAttribute("data-text") &&
              element.getAttribute("data-text").trim()) ||
            (element.getAttribute("placeholder") &&
              element.getAttribute("placeholder").trim());

          if (value && value !== "") {
            return value;
          }
        }
      }
    } catch (error) {
      console.error("error while processing valid data", error);
    }
  }
}

async function scrapeProductData() {
  let isAmazon = window.location.hostname.includes("amazon");
  let isFlipkart = window.location.hostname.includes("flipkart");

  let productTitle = "";
  let productPrice = "";
  let mrpPrice = "";
  let rating = "";
  let imageUrl = "";

  if (isAmazon) {
    productTitle =
      document.querySelector("#productTitle")?.innerText.trim() ||
      "Title not available";

    let priceWhole =
      document.querySelector(".a-price .a-price-whole")?.innerText.trim() || "";
    let priceFraction =
      document.querySelector(".a-price .a-price-fraction")?.innerText.trim() ||
      "00";
    if (priceWhole) {
      productPrice = `₹${priceWhole}`;
    } else {
      productPrice = "Price not available";
    }

    mrpPrice =
      document
        .querySelector(".a-price.a-text-price .a-offscreen")
        ?.innerText.trim() ||
      document
        .querySelector(".basisPrice .a-price .a-offscreen")
        ?.innerText.trim() ||
      "MRP not available";

    let ratingText =
      document.querySelector("#acrPopover")?.getAttribute("title")?.trim() ||
      "Rating not available";
    if (ratingText.includes("out of")) {
      rating = ratingText.split(" ")[0];
    } else {
      rating = "Rating not available";
    }

    imageUrl =
      document
        .querySelector(".a-dynamic-image.a-stretch-vertical")
        ?.getAttribute("data-old-hires") ||
      document
        .querySelector(".a-dynamic-image.a-stretch-vertical")
        ?.getAttribute("src") ||
      document
        .querySelector('span.a-declarative[data-action="main-image-click"] img')
        ?.getAttribute("data-old-hires") ||
      document
        .querySelector('span.a-declarative[data-action="main-image-click"] img')
        ?.getAttribute("src") ||
      "Image not available";
  } else if (isFlipkart) {
    productTitle =
      document.querySelector(".VU-ZEz")?.innerText.trim() ||
      "Title not available";

    productPrice =
      document.querySelector(".Nx9bqj")?.innerText.trim() ||
      "Price not available";

    mrpPrice =
      document.querySelector(".yRaY8j")?.innerText.trim() ||
      "MRP not available";

    rating =
      document.querySelector(".XQDdHH")?.innerText.trim() ||
      "Rating not available";

    imageUrl =
      document.querySelector(".DByuf4")?.getAttribute("src") ||
      "Image not available";
  } else {
    const hostName = new URL(window.location.href).hostname;
    const selectors = await fetchSelectors(hostName);
    console.log("selectors", selectors);

    if (!selectors) {
      console.log("No selectors found for this website");
      return;
    }

    productTitle = getValidData(selectors.title) || "Title N/A";
    productPrice = getValidData(selectors.current) || " Price N/A";
    mrpPrice = getValidData(selectors.mrp) || "Mrp N/A";
    rating = getValidData(selectors.rating) || "Rating N/A";
    imageUrl = getValidData(selectors.image, "src") || "Image N/A";
  }

  let productUrl = window.location.href;
  let websiteName = isAmazon
    ? "Amazon"
    : isFlipkart
    ? "Flipkart"
    : "Unknown Website";

  chrome.runtime.sendMessage({
    product: {
      title: productTitle,
      currentPrice: productPrice,
      mrpPrice: mrpPrice,
      rating: rating,
      imageUrl: imageUrl,
      url: productUrl,
      websiteName: websiteName,
    },
    type: "SHOW_POPUP",
  });
}

if (true) {
  let addButton = document.createElement("button");

  addButton.innerHTML = `
        <img src="https://media.licdn.com/dms/image/v2/D4E0BAQElP5BHUn-yBQ/company-logo_200_200/company-logo_200_200/0/1697168624774/cocarting_logo?e=2147483647&v=beta&t=Vsldfy9KuXacF0kfZ6JStOOMc6UIud9gWw7ZICQHS6E" alt="Wishlist Icon" style="width: 40px; height: 40px;">
    `;

  addButton.style.position = "fixed";
  addButton.style.top = "200px";
  addButton.style.right = "0px";
  addButton.style.zIndex = 9999;
  addButton.style.background = "purple";
  addButton.style.borderTop = "1.5px solid blue";
  addButton.style.borderLeft = "1.5px solid blue";
  addButton.style.borderBottom = "1.5px solid blue";
  addButton.style.borderRight = "none";
  addButton.style.padding = "0";
  addButton.style.margin = "0";
  addButton.style.cursor = "pointer";
  addButton.style.borderRadius = "30px";

  addButton.onclick = async () => {
    await scrapeProductData();
  };

  document.body.appendChild(addButton);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "SCRAPE_PRODUCT_DATA") {
      scrapeProductData();
      sendResponse({ status: "Product data scraping started." });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "GET_USERID_FROM_LOCAL_STORAGE") {
      const userId = localStorage.getItem("userId") ?? "1";
      const email = localStorage.getItem("email") ?? "gestuser@cocarting";
      sendResponse({userId: userId, email: email})
      try {
        chrome.runtime.sendMessage({
          action: "USER_IDS", data: {
            userId,
            email
          }
        }, (response) => {
          //console.log("Response from bg.js", { response });
        })
        
      } catch (err) {
        console.log("Error sending message on Content.js to background", {err})
      }
      
    }
  });