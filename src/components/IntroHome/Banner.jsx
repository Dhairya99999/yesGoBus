import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Banner = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const loggedInUser = localStorage.getItem("loggedInUser");

	const handleToursAndTravelsClick = () => {
		const url =
			token && loggedInUser
				? `/travel-app/?token=${encodeURIComponent(
						token
				  )}&userName=${encodeURIComponent(
						JSON.parse(loggedInUser).fullName
				  )}&email=${encodeURIComponent(
						JSON.parse(loggedInUser).email
				  )}&userId=${encodeURIComponent(
						JSON.parse(loggedInUser)._id
				  )}&phoneNumber=${encodeURIComponent(
						JSON.parse(loggedInUser).phoneNumber
				  )}`
				: "/login";
		navigate(url);
	};

	const buttonStyle = {
		display: "inline-flex",
		alignItems: "center",
		padding: "10px 20px",
		backgroundColor: "#fd5901",
		borderRadius: "20px",
		marginRight: "10px",
		border: "1px solid #ddd",
		textDecoration: "none",
		color: "white",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		fontSize: "16px",
	};

	const activeButtonStyle = {
		...buttonStyle,
		backgroundColor: "#fd5901",
		color: "white",
	};

	const iconStyle = {
		marginRight: "8px",
	};

	return (
		<div style={{ textAlign: "center", marginTop: "20px" }}>
			{/* <h4 style={{ color: "black", marginBottom: '5px' }}>
                PROVIDING QUALITY SERVICES AT
            </h4>
            <h4 className="orange-text" style={{ color: "#FF5722", marginBottom: '20px' }}>
                AFFORDABLE PRICES
            </h4> */}
			<div
				className="burger-menu"
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "10px",
					marginTop: "20px",
				}}
			>
				<Link to="/busbooking" style={activeButtonStyle}>
					{/* <span style={iconStyle}>⭐</span> */}
					<span>Bus</span>
				</Link>
				<button onClick={handleToursAndTravelsClick} style={buttonStyle}>
					<span style={{ padding: "2px", marginRight: "8px" }}></span>
					<span>Tours & Travels</span>
				</button>
			</div>
		</div>
	);
};

export default Banner;
