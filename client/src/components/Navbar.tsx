import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";
import { User } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          Dashboard
        </Link>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 p-2 h-10 rounded-full bg-neutral text-white grid place-items-center">
              <User className="w-6 h-6" strokeWidth={2} />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
