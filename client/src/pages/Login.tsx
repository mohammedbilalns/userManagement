import { Link } from "react-router-dom";
export default function Login() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <form className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full"
                  required
                />
              </div>
  
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                  required
                />
              </div>
  
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  Login
                </button>
              </div>
            </form>
  
            <div className="text-center mt-4">
              <p className="text-sm">
                Don’t have an account?{" "}
                <button
                  className="text-primary hover:underline cursor-pointer"
                 
                >
                    <Link to="/register">Sign Up</Link>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  