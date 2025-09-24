import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-accent py-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-primary font-bold tracking-tight">
          <Link to="/">LXBNB</Link>
        </span>
        <span className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <Link
                className="text-primary px-3 font-bold hover:text-secondary transition-colors duration-300"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="text-primary px-3 font-bold hover:text-secondary transition-colors duration-300"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-secondary text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-90 transition-colors duration-300"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
