import React from 'react';
import { Link } from "react-router-dom";
import GoogleTranslate from '../TranslateHelmet/GoogleTranslate';

const token = localStorage.getItem("token");

const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fd5901',
    borderRadius: '20px',
    marginRight: '10px',
    border: '1px solid #ddd',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
  };


const iconStyle = {
    marginRight: '8px',
  };

const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#fd5901',
    color: 'white',
  };

const Banner = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h4 style={{ color: "black", marginBottom: '5px' }}>
                PROVIDING QUALITY SERVICES AT
            </h4>
            <h4 className="orange-text" style={{ color: "#FF5722", marginBottom: '20px' }}>
                AFFORDABLE PRICES
            </h4>
            <div className="burger-menu" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <Link to="/busbooking" style={activeButtonStyle}>
                <span style={iconStyle}>⭐</span>
                <span>Bus</span>
            </Link>

            <Link to={
                token
                    ? `/travel-app/?token=${token}&userName=${
                        JSON.parse(loggedInUser).fullName
                    }&email=${JSON.parse(loggedInUser).email}&userId=${
                        JSON.parse(loggedInUser)._id
                    }&phoneNumber=${JSON.parse(loggedInUser).phoneNumber}`
                    : "/login"
                }>
                <span>Tours & Travels</span>
            </Link>

            </div>
        </div>
    );
}

export default Banner;
