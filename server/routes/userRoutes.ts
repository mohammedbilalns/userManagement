import { Router } from "express";
import { registerUser, loginUser, logoutUser} from "../controllers/userController"
const router = Router()

router.post('/register', registerUser)


router.post('/login', loginUser )

router.get('/logout', logoutUser)


router.put('/update-profile', (req,res)=>{
    res.json({
        endpoint:"/update-profile"
    })
})


export default router