import { RootState } from "../app/store";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({children}:{children:ReactElement} ){
    const {user} = useSelector((state:RootState)=>state.auth)

    if(user){
        return <Navigate to="/"></Navigate>
    }
    return children
}