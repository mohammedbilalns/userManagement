import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";

const Navbar = () => {

    const dispatch = useDispatch<AppDispatch>()
    const handleLogout = ()=>{
        dispatch(logout())
    }

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          Dashboard
        </Link>
      </div>

      <div className="flex-none gap-4">
        <ul className="menu menu-horizontal px-1 hidden md:flex">
          <li>
            <Link to="/profile" className="hover:text-primary">Profile</Link>
          </li>
       
        </ul>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-neutral text-white flex items-center justify-center">
              <span className="text-lg font-bold">U</span>
            </div>
          </label>

          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge badge-primary">New</span>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} >Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
