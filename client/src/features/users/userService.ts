import axios from "axios"
import { UserType } from "../../types/userType"
const API_URL = '/api/users'


const getProfile = async (token: string) =>{

}

const updateProfile = async (userData: UserType , token:string)=>{

}

const updateProfileImage = async (formData : any, token: string)=>{

}


export default {getProfile, updateProfile, updateProfileImage}