// BottomBar.js
import { useState } from "react";
import "./BottomBar.scss";
import {
	FaHome,
	FaInfoCircle,
	FaBus,
	FaQuestionCircle,
	FaUser,
	FaWallet,
	FaTicketAlt,
	// FaTicketAltSlash,
	// FaTicket,
	// FaUser,
} from "react-icons/fa";
// import { TbTicketOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
	const navigate = useNavigate();

	// const [active, setActive] = useState(false);

	// const bottomNav = (
	// 	// `${openNav ? "nav-menu nav-active" : "nav-menu"}`
	// 	<div className={active ? "nav-popup nav-popup-active" : "nav-popup"}>
	// 		<div className="bottom-bar-item">
	// 			<FaUser />
	// 			<span>Login</span>
	// 		</div>
	// 		<div className="bottom-bar-item">
	// 			<TbTicketOff />
	// 			<span>Cancel Ticket</span>
	// 		</div>
	// 		<div className="bottom-bar-item">
	// 			<FaWallet />
	// 			<span>My Wallet</span>
	// 		</div>
	// 	</div>
	// );

	return (
		<>
			{/* {bottomNav} */}
			<div className="bottom-bar">
				<div className="bottom-bar-item" onClick={() => navigate("/")}>
					<FaHome />
					<span>Home</span>
				</div>
				<div className="bottom-bar-item" onClick={() => navigate("/")}>
					<FaInfoCircle />
					<span>Justdial</span>
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
