import React, {createContext, useState} from 'react';

export const ModalSignInContext = createContext(null);

function ModalSignInProvider({children}) {
    const [modalIsOpenSignIn, setModalIsOpenSignIn] = useState(false);
    const [signInSubHeader, setSignInSubHeader] = useState('');

    return (
        <ModalSignInContext.Provider
            value={{modalIsOpenSignIn, setModalIsOpenSignIn, signInSubHeader, setSignInSubHeader}}>
            {children}
        </ModalSignInContext.Provider>
    );
}

export default ModalSignInProvider;