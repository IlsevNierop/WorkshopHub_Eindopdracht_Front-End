import './styles/global-styles.module.css';
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import SignIn from "./pages/signin/SignIn";
import {useContext, useState} from "react";
import {AuthContext} from "./context/AuthContext";
import Profile from "./pages/profile/Profile";
import NewWorkshop from "./pages/newWorkshop/NewWorkshop";
import {returnHighestAuthority} from "./helper/returnHighestAuthority";


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
                    <Route path="/login" element={<SignIn/>}/>
                    <Route path="/profiel" element={isAuth? <Profile/> : <SignIn />}/>
                    {/*TODO isAuth ook toevoegen?*/}
                    <Route path="/nieuweworkshop" element={user != null && returnHighestAuthority(user.authorities) !== 'customer'?  <NewWorkshop/> : <Home />}/>

                    {/*<Route path="/aanmelden" element={<Register />} />*/}
                    {/*<Route path="/workshop" element={<WorkshopPage />} />*/}
                </Routes>
                <Footer></Footer>
            </div>

        </>
    );
}

export default App;
