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

function App() {

    const {isAuth, user} = useContext(AuthContext);
    console.log(isAuth);

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
                    {/*TODO isAuth ook toevoegen?*/}
                    <Route path="/nieuweworkshop" element={user != null && returnHighestAuthority(user.authorities) !== 'customer'?  <CreateWorkshop/> : <Home />}/>
                    {/*<Route path="*" element={ <PageNotFound/> }/>*/}
                </Routes>
                <Footer></Footer>
            </div>

        </>
    );
}

export default App;
