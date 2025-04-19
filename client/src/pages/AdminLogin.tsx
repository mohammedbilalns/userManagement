import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { adminLogin } from "../features/admin/adminSlice";
export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (isSuccess || admin) {
      navigate("/admin/dashboard");
    }
  }, [admin, isError, isSuccess, message, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch(adminLogin({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Admin Email</span>
              </label>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="admin@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                value={email}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                value={password}
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login as Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
