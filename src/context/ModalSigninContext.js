import React, { createContext, useState } from 'react';

export const ModalSignInContext = createContext(null);

function ModalSignInProvider ({ children }) {
    const [modalIsOpenSignIn, setModalIsOpenSignIn] = useState(false);

    return (
        <ModalSignInContext.Provider value={{ modalIsOpenSignIn, setModalIsOpenSignIn }}>
            {children}
        </ModalSignInContext.Provider>
    );
}

export default ModalSignInProvider;