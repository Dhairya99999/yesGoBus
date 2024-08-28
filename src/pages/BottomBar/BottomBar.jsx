// BottomBar.js
import React from "react";
import "./BottomBar.scss";
import { FaHome, FaInfoCircle, FaBus, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-item" onClick={() => navigate("/")}>
        <FaHome />
        <span>Home</span>
      </div>
      <div className="bottom-bar-item" onClick={() => navigate("/")}>
        <FaInfoCircle />
        <span>Justdial</span>
      </div>
      <div className="bottom-bar-item" onClick={() => navigate("/busbooking")}>
        <FaBus />
        <span>Bookings</span>
      </div>
      <div className="bottom-bar-item" onClick={() => navigate("/contactus")}>
        <FaQuestionCircle />
        <span>Help</span>
      </div>
    </div>
  );
};

export default BottomBar;
