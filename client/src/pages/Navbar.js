import React from "react";
import Logo from "../assets/keylogo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="p-10 flex items-center w-[90vw] justify-between">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img className="w-16" src={Logo} alt="logo" />
          <h1 className=" font-semibold text-3xl">
            veloci<span className="text-[#F5B1CC]">key</span>
          </h1>
        </div>
      </Link>
      <Link className="text-2xl" to="/leaderboard">
        Leaderboard
      </Link>
    </nav>
  );
};

export default Navbar;
