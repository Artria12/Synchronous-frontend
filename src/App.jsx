import React,{lazy, Suspense} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from './component/auth/protectedRoutes.jsx';
import { LayoutLoader } from './component/layout/loaders.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import { useEffect } from 'react';
import axios from "axios";
import { server } from './constants/config.js';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth.js';
import { Toaster } from 'react-hot-toast';
import { useRef } from 'react';
import { SocketProvider } from './sockets.jsx';


const Home=lazy(
  ()=> import('./pages/Home.jsx')
)
const Login=lazy(
  ()=> import('./pages/Login.jsx')
)
const Chat=lazy(
  ()=> import('./pages/Chat.jsx')
)
const Groups=lazy(
  ()=> import('./pages/Groups.jsx')
)
const NotFound=lazy(
  ()=> import('./pages/NotFoud.jsx')
)
const AdminLogin=lazy(
  ()=> import('./pages/admin/AdminLogin.jsx')
)
const UserManagement = lazy(() => import("./pages/admin/UserManagement.jsx"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement.jsx"));
const MessagesManagement = lazy(() =>
  import("./pages/admin/MesageManagement.jsx")
);

const App = () => {
  const dispatch=useDispatch()

  const { user, loader } = useSelector((state) => state.auth);
    console.log("user",user)

   useEffect(() => {
 
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => {
    
        dispatch(userExists(data))})
      .catch((err) =>{
        dispatch(userNotExists())});
  }, [dispatch]);
  return loader?<LayoutLoader/>:(
    <BrowserRouter>
     <Suspense fallback={<LayoutLoader/>}>
       <Routes>
        <Route element={
          <SocketProvider>
               <ProtectRoute user={user}/>
          </SocketProvider>
       
          
          }>
          <Route path="/" element={
          <Home/> 
          }/>
          <Route path="/chat/:chatId" element={<Chat/>}/>
          <Route path="/groups" element={<Groups/>}/>
        </Route>
            <Route path="/admin" element={<AdminLogin />} />
           <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
           <Route path="/login" element={<ProtectRoute user={!user} redirect="/">
        <Login/>
      </ProtectRoute>}/>
      <Route path='*' element={<NotFound/>}/>
      </Routes>
     </Suspense>
        <Toaster position="bottom-center" />
    </BrowserRouter>
  )
}

export default App