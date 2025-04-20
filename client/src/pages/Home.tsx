import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-base-100 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Welcome,{user.name}
            </h1>
          </div>

          <div className="flex justify-center mt-10">
            <button
              className="btn btn-error text-white px-6 py-3 text-base font-semibold rounded-lg hover:brightness-110 transition duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
