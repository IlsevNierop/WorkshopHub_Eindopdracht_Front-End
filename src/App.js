import './styles/global-styles.module.css';
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import {useContext, useState} from "react";
import {AuthContext} from "./context/AuthContext";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import WorkshopPage from "./pages/workshopPage/WorkshopPage";
import CreateWorkshop from "./pages/createWorkshop/CreateWorkshop";
import VerifyWorkshops from "./pages/verifyWorkshops/./VerifyWorkshops";
import UpdateWorkshopPage from "./pages/updateWorkshopPage/UpdateWorkshopPage";
import FavouriteWorkshops from "./pages/favouriteWorkshops/FavouriteWorkshops";
import Workshops from "./pages/workshops/Workshops";
import AllWorkshopsFromOwner from "./pages/allWorkshopsFromOwner/AllWorkshopsFromOwner";

function App() {

    const {isAuth, user} = useContext(AuthContext);

    const [modalIsOpenSignIn, setModalIsOpenSignIn] = useState(false);
    const [signInSubHeader, setSignInSubHeader] = useState('');

    return (
        <>
            {/*TODO add private routes*/}
            <div className="app-container">
                <NavBar></NavBar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/workshop/:workshopId" element={<WorkshopPage/>}/>
                    <Route path="/allwworkshopseigenaar/:workshopOwnerId" element={<AllWorkshopsFromOwner/>}/>
                    <Route path="/profiel" element={isAuth? <Profile/> : <Home />}/>
                    <Route path="/registreren" element={<Register/>}/>
                    <Route path="/favorieten" element={isAuth? <FavouriteWorkshops/> : <Home />}/>

                    <Route path="/nieuweworkshop" element={user != null && user.highestAuthority !== 'customer'?  <CreateWorkshop/> : <Home />}/>
                    <Route path="/goedkeurenworkshops" element={user != null && user.highestAuthority !== 'customer'?  <VerifyWorkshops/> : <Home />}/>
                    <Route path="/aanpassenworkshop/:workshopId" element={user != null && user.highestAuthority !== 'customer'?  <UpdateWorkshopPage/> : <Home />}/>
                    <Route path="/workshops" element={user != null && user.highestAuthority !== 'customer'?  <Workshops/> : <Home />}/>
                    {/*<Route path="*" element={ <PageNotFound/> }/>*/}
                </Routes>
                <Footer></Footer>
            </div>

        </>
    );
}

export default App;
