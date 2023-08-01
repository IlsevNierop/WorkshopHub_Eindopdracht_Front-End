import React, {useState} from 'react';
import styles from "./PageNotFound.module.css";
import {useNavigate} from "react-router-dom";

function PageNotFound() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate('/');
    }, 3000);

    const [counter, setCounter] = useState(3);

    setInterval(() => {
        setCounter(counter - 1);
    }, 1000);

    return (
        <main className={`outer-container ${styles["page-not-found__outer-container"]}`}>
            <div className={`inner-container ${styles["page-not-found__inner-container"]}`}>
                <h1>Deze pagina bestaat niet</h1>
                <h3 className={styles["h3__page-not-found"]}>Je wordt over <span className={styles["counter__h3"]}>{counter} seconden</span> automatisch doorgestuurd naar de hompagina.</h3>

            </div>
        </main>
    );
}

export default PageNotFound;