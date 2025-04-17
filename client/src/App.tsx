
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Register"
import Home from "./pages/Home"
import UserProfile from "./pages/UserProfile"
import AdminLogin from "./pages/AdminLogin" 
import DashBoard from "./pages/DashBoard"


function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>

					<Route path="/" element = {<Home></Home>}> </Route>
					<Route path="/login" element = {<Login/>}></Route>
					<Route path="/register" element = {<Signup/>}></Route>
					<Route path="/profile" element= {<UserProfile></UserProfile>}></Route>
					<Route path="/admin/login" element = {<AdminLogin/>}></Route>	
					<Route path="/admin/dashboard" element = {<DashBoard/>}></Route>

				</Routes>
			</BrowserRouter>

		</>
	)
}

export default App
