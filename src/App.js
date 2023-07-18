import './styles/global-styles.module.css';
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import {useContext, useState} from "react";
import {AuthContext} from "./context/AuthContext";
import Profile from "./pages/profile/Profile";
import {returnHighestAuthority} from "./helper/returnHighestAuthority";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Register from "./pages/register/Register";
import WorkshopPage from "./pages/workshopPage/WorkshopPage";
import CreateWorkshop from "./pages/createWorkshop/CreateWorkshop";
import VerifyWorkshops from "./pages/verifyWorkshops/./VerifyWorkshops";
import UpdateWorkshopPage from "./pages/updateWorkshopPage/UpdateWorkshopPage";

function App() {

    const {isAuth, user} = useContext(AuthContext);

    return (
        <>
            {/*TODO add private routes*/}
            <div className="app-container">
                <NavBar></NavBar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/workshop/:workshopId" element={<WorkshopPage/>}/>
                    <Route path="/profiel" element={isAuth? <Profile/> : <Home />}/>
                    <Route path="/wachtwoordvergeten" element={<ResetPassword/>}/>
                    <Route path="/registreren" element={<Register/>}/>
                    <Route path="/nieuweworkshop" element={user != null && returnHighestAuthority(user.authorities) !== 'customer'?  <CreateWorkshop/> : <Home />}/>
                    <Route path="/goedkeurenworkshops" element={user != null && returnHighestAuthority(user.authorities) === 'admin'?  <VerifyWorkshops/> : <Home />}/>

                    <Route path="/aanpassenworkshop/:workshopId" element={user != null && returnHighestAuthority(user.authorities) !== 'customer'?  <UpdateWorkshopPage/> : <Home />}/>
                    {/*/!*<Route path="/mijnworkshops" element={user != null && returnHighestAuthority(user.authorities) === 'workshopowner'?  <MyWorkshops/> : <Home />}/>*!/ --> publiceren via een link, zoals favourite*/}
                    {/*<Route path="*" element={ <PageNotFound/> }/>*/}
                </Routes>
                <Footer></Footer>
            </div>

        </>
    );
}

export default App;
