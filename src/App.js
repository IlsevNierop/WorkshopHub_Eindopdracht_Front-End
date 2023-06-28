import './styles/global-styles.module.css';
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import SingIn from "./pages/signin/SignIn";
import {useState} from "react";


function App() {

    return (
        <>
            <div className="app-container">
                <NavBar></NavBar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<SingIn/>}/>
                    {/*<Route path="/aanmelden" element={<Register />} />*/}
                    {/*<Route path="/workshop" element={<WorkshopPage />} />*/}
                </Routes>
                <Footer></Footer>
            </div>

        </>
    );
}

export default App;
