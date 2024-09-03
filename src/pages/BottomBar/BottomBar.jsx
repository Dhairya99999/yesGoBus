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

	return (
		<>
			<div className="bottom-bar">
				<div className="bottom-bar-item" onClick={() => navigate("/")}>
					<FaHome />
					<span>Home</span>
				</div>
				{/* Update this div to include an anchor tag for calling Justdial */}
				<div className="bottom-bar-item">
					<a href="tel:+91" className="call-link">
						<IoMdCall />
						<span>Call Now</span>
					</a>
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
