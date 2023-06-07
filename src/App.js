import './styles/global-styles.module.css';
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import {useState} from "react";


function App() {
    const [isAuth, toggleAuthentication] = useState(true);

    return (
        <>
            <div className="app-container">
                <NavBar isAuth={isAuth}></NavBar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    {/*<Route path="/aanmelden" element={<Register />} />*/}
                    {/*<Route path="/workshop" element={<WorkshopPage />} />*/}
                </Routes>
                <Footer></Footer>
            </div>

        </>
    );
}

export default App;
