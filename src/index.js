import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import ModalSignInProvider from "./context/ModalSigninContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <AuthContextProvider>
                <ModalSignInProvider>
                    <App/>
                </ModalSignInProvider>
            </AuthContextProvider>
        </Router>
    </React.StrictMode>
);
