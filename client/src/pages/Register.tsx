import { useState } from "react";
// import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
export default function Register() {

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })

  const {name, email , password , confirmPassword} = formData
  console.log(name, email , password , confirmPassword)
  const navigate = useNavigate()
  // const dispatch = useDispatch()

  const handleChange = (e:React.ChangeEvent<HTMLInputElement> ) =>{
    setFormData((prevState)=>({...prevState, [e.target.name]:e.target.value}))
  }

    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <form className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  name="name"
                  className="input input-bordered w-full"
                  required
                  onChange={handleChange}

                />
              </div>
  
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full"
                  required
                  onChange={handleChange}
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
                  name="password"
                  className="input input-bordered w-full"
                  required
                  onChange={handleChange}
                />
              </div>
  
              <div className="form-control">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="input input-bordered w-full"
                  required
                  onChange={handleChange}
                />
              </div>
  
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  Sign Up
                </button>
              </div>
            </form>
  
            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{" "}
                <button
                  className="text-primary hover:underline cursor-pointer"
                  
                >
                    <Link to="/login"> Login</Link>
                  
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  