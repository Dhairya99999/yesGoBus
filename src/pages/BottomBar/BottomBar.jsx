// BottomBar.js
import { useState } from "react";
import "./BottomBar.scss";
import { IoMdCall } from "react-icons/io";
import {
	FaHome,
	FaInfoCircle,
	FaBus,
	FaQuestionCircle,
	FaUser,
	FaWallet,
	FaTicketAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
	const navigate = useNavigate();

	// Function to handle phone call initiation
	const handleCallJustdial = () => {
			// const phoneNumber = "+919888417555";
			// console.log(`Dialing: ${phoneNumber}`); // Log the number
			// window.location.href = `tel:${phoneNumber}`;
		
			// Redirect back to home page
			navigate("/");

	};

	return (
		<>
			<div className="bottom-bar">
				<div className="bottom-bar-item" onClick={() => navigate("/")}>
					<FaHome />
					<span>Home</span>
				</div>
				<div className="bottom-bar-item" onClick={handleCallJustdial}>
					<IoMdCall />
					<span>Call Now</span>
				</div>
				<div
					className="bottom-bar-item"
					onClick={() => navigate("/busbooking")}
				>
					<FaBus />
					<span>Bookings</span>
				</div>
				<div className="bottom-bar-item" onClick={() => navigate("/profile")}>
					<FaUser />
					<span>My Account</span>
				</div>
				<div className="bottom-bar-item" onClick={() => navigate("/contactus")}>
					<FaQuestionCircle />
					<span>Help</span>
				</div>
			</div>
		</>
	);
};

export default BottomBar;
