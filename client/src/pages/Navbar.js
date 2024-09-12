import React from "react";
import Logo from "../assets/keylogo.png";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav className="p-10 flex items-center w-[90vw] justify-between">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img className="w-16" src={Logo} alt="logo" />
          <h1 className=" font-semibold text-3xl">
            veloci<span className="text-[#F5B1CC]">keys</span>
          </h1>
        </div>
      </Link>

      <div className="text-2xl items-center flex gap-10">
        <Link to="/leaderboard">Leaderboard</Link>
        {!isAuthenticated ? (
          <button
            className="bg-[#F5B1CC] text-white py-1 px-4"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
        ) : (
          <div className="flex flex-col items-center">
            {/* <p>{user.name}</p> */}
            <button
              className="bg-[#F5B1CC] text-white py-1 px-4"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
