import React, { useEffect, useState } from "react";
import "../styles/login.css";
import logo from "../assets/logo.png";

function Admin() {
    const [data, setData] = useState({});

    useEffect(() => {
        const allData = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                allData[key] = JSON.parse(localStorage.getItem(key));
            } catch {
                allData[key] = localStorage.getItem(key);
            }
        }

        setData(allData);
    }, []);

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: "800px" }}>

                <div className="logo-wrapper">
                    <img className="logo-img" src={logo} alt="Rumba" />
                </div>

                <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>

                <div style={{ textAlign: "left", maxHeight: "400px", overflow: "auto" }}>
                    <pre style={{ fontSize: "12px" }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>

                <button
                    className="btn-login"
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    Limpiar localStorage
                </button>

            </div>
        </div>
    );
}

export default Admin;