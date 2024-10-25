import Header from "./Components/Header";
import Popup from "./Popup";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function App() {
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem("userId")) || "234c234c2");

  const onSuccess = (credentialResponse) => {
    const user = jwtDecode(credentialResponse.credential);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", JSON.stringify(user.sub));
    setUser(user);
    setUserId(user.sub);
    console.log("Login Success");
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

  return (
    <div className="p-2 border-none rounded-2xl" style={{ height: "100%", overflow: "hidden" }}>
      <Header setMessage={setMessage} />

      {userId ? (
        <main className="container">
          <div className="flex justify-center items-center">
            <div className="w-full max-w-4xl lg:max-w-6xl">
              <Popup setMessage={setMessage} userId={userId}  />
            </div>
          </div>
        </main>
      ) : (
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md">Login</button>
      )}
    </div>
  );
}
