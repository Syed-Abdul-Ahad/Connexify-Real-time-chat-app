import NavBar from "./components/NavBar";
import {Routes, Route, Navigate} from "react-router-dom";
import {Loader} from "lucide-react"

import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/useAuthStore";
import {Toaster} from "react-hot-toast"
import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";

function App() {

  const {authUser,checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    )
  }

  return(
    <div className="body" data-theme={theme}>
      
    <NavBar/>
    <Routes>
      <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
      <Route path="/signUp" element={!authUser? <SignUpPage/>: <Navigate to="/"/>}/>
      <Route path="/login" element={!authUser? <LoginPage/>: <Navigate to="/"/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/profile" element={authUser ? <ProfilePage/>: <Navigate to="/login"/>}/>
    </Routes>

    <Toaster/>
    </div>
  )
}

export default App;
