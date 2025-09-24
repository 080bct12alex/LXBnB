import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Header = () => {
  const { isLoggedIn, currentUser } = useAppContext(); // Get currentUser
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="bg-accent py-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-primary font-bold tracking-tight">
          <Link to="/">LXBNB</Link>
        </span>
        <ul className="hidden md:flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <li className="text-primary font-bold hover:text-secondary transition-colors duration-300">
                <Link to="/">Home</Link>
              </li>
              {currentUser?.role === "guest" && ( // Only show My Bookings for guests
                <li className="text-primary font-bold hover:text-secondary transition-colors duration-300">
                  <Link to="/my-bookings">My Bookings</Link>
                </li>
              )}
              {currentUser?.role === "hotel-owner" && ( // Only show My Hotel Bookings for hotel owners
                <>
                  <li className="text-primary font-bold hover:text-secondary transition-colors duration-300">
                    <Link to="/my-hotels">My Hotels</Link>
                  </li>
                 
                  <li className="text-primary font-bold hover:text-secondary transition-colors duration-300">
                    <Link to="/my-hotel-bookings">My Hotel Bookings</Link>
                  </li>
                </>
              )}
              <li>
                <SignOutButton />
              </li>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-secondary text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-90 transition-colors duration-300"
            >
              Sign In
            </Link>
          )}
        </ul>
        <div onClick={handleNav} className="md:hidden z-10">
          {nav ? (
            <AiOutlineClose className="text-primary" size={25} />
          ) : (
            <AiOutlineMenu className="text-primary" size={25} />
          )}
        </div>
        <div
          className={
            nav
              ? "overflow-y-hidden md:hidden ease-in duration-300 absolute text-primary left-0 top-0 w-full h-screen bg-background/90 px-4 py-7 flex flex-col"
              : "absolute top-0 h-screen left-[-100%] ease-in duration-500"
          }
        >
          <ul className="h-full w-full text-center pt-12">
            {isLoggedIn ? (
              <>
                <li className="text-2xl py-8">
                  <Link to="/">Home</Link>
                </li>
                {currentUser?.role === "guest" && (
                  <li className="text-2xl py-8">
                    <Link to="/my-bookings">My Bookings</Link>
                  </li>
                )}
                {currentUser?.role === "hotel-owner" && (
                  <> 
                    <li className="text-2xl py-8">
                      <Link to="/my-hotels">My Hotels</Link>
                    </li>
                    <li className="text-2xl py-8">
                      <Link to="/add-hotel">Add Hotel</Link>
                    </li>
                    <li className="text-2xl py-8">
                      <Link to="/my-hotel-bookings">My Hotel Bookings</Link>
                    </li>
                  </>
                )}
                <li className="text-2xl py-8">
                  <SignOutButton />
                </li>
              </>
            ) : (
              <li className="text-2xl py-8">
                <Link
                  to="/sign-in"
                  className="bg-secondary text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-90 transition-colors duration-300"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
