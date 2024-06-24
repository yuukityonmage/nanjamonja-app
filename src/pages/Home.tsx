import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/Player');
    };
    console.log("Home")
    return (
        <div className="App">
            <header className="App-header">
                <img src="../images/logo.jpg" className="App-logo" alt="logo" />
                <p>
                MuccyaMonja
                </p>
                <button onClick={handleButtonClick}>
                    Let's Play
                </button>
            </header>
        </div>
    );
}

export default Home