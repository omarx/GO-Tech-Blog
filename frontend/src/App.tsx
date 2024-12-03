import Navbar from "./components/navbar/navbar.component.tsx";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./pages/home/home.page.tsx";
import NotFoundPage from "./pages/404Page/notfound.404page.tsx";
import LoginPage from "./pages/login/login.page.tsx";
import SignupPage from "./pages/login/signup.page.tsx";
import DashboardPage from "./pages/dashboard/dashboard.page.tsx";
import SinglePostPage from "./pages/posts/singlePost.page.tsx";

 const App=()=>{
     return (
         <>
             <Router>
                 <Navbar/>
                 <Routes>
                     <Route path="/" element={<Home/>}/>
                     <Route path="*" element={<NotFoundPage/>}/>
                     <Route path="/login" element={<LoginPage/>}/>
                     <Route path="/signup" element={<SignupPage/>}/>
                     <Route path="/dashboard" element={<DashboardPage/>}/>
                     <Route path="/post/:postId" element={<SinglePostPage/>}/>
                 </Routes>
             </Router>
         </>
    )
 }

export default App
