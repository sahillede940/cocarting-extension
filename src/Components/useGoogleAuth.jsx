// useGoogleAuth.js
import { useState } from 'react';

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState(null);

  const login = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        // Handle the error as needed
      } else {
        // Use the token to fetch user info
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUserInfo(data);
          })
          .catch((error) => {
            console.error('Error fetching user info:', error);
          });
      }
    });
  };

  const logout = () => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          setUserInfo(null);
        });
      }
    });
  };

  return { userInfo, login, logout };
};
