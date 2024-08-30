import { useState, useEffect } from "react";
import { logo } from "../../assets";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiContactsFill } from "react-icons/ri";
import { BiSolidBus } from "react-icons/bi";
import { MdHome } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlinePolicy } from "react-icons/md";
import "./Navbar.scss";
import { blacklogo } from "../../assets/homepage";
import UserIcon from "../SvgIcons/UserIcon";
import { useSelector } from "react-redux";
import { selectIsMobileApp } from "../../stores/slices/designSlice";

const Navbar = ({ page }) => {
	const isMobileApp = useSelector(selectIsMobileApp);

	let translateElement;

	const googleTranslateElementInit = () => {
		translateElement = new window.google.translate.TranslateElement(
			{
				pageLanguage: "en",
				includedLanguages: "en,kn,te,ta,ml,hi",
				layout: window.google.translate.TranslateElement.InlineLayout.TOP_RIGHT,
			},
			"google_translate_element"
		);
	};

	useEffect(() => {
		const translateElement = document.getElementById(
			"google_translate_element"
		);
		if (translateElement) {
			translateElement.innerHTML = "";
		}

		const buttonElement = document.getElementById("your_button_id");
		if (buttonElement) {
			return;
		}

		window.googleTranslateElementInit = googleTranslateElementInit;

		const yourButton = document.createElement("button");
		yourButton.id = "your_button_id";
		yourButton.style.display = "none";
		document.querySelector(".right").appendChild(yourButton);

		return () => {
			const buttonToRemove = document.getElementById("your_button_id");
			if (buttonToRemove) {
				buttonToRemove.remove();
			}
		};
	});

	const [showMenu, setShowMenu] = useState(false);
	const [openNav, setOpenNav] = useState(false);
	const navigate = useNavigate();

	const loggedInUser = localStorage.getItem("loggedInUser");
	const token = localStorage.getItem("token");

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

	const menu = (
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
	);

	return (
		<nav className="navbar burger">
			{page === "home" && menu}

			<div
				id="google_translate_element"
				style={{ marginTop: "120px", position: "absolute", left: "20px" }}
			></div>

			<div
				className="hamburger"
				onClick={() => {
					setOpenNav(!openNav);
				}}
			>
				{openNav ? <RxCross2 size={36} /> : <IoMenu size={36} />}
			</div>

			<div className={`${openNav ? "nav-menu nav-active" : "nav-menu"}`}>
				<div className="left">
					<a href={"/"}>
						<img
							className="logo"
							src={page === "home" ? logo : blacklogo}
							width={50}
							height={50}
							alt=""
						/>
					</a>
					<a href="/busbooking">
						<span>Bus</span>
					</a>
					{isMobileApp && (
						<a href="/cabs">
							<span>Cabs</span>
						</a>
					)}
					<a href="/contactus">
						<span>Contact Us</span>
					</a>
				</div>

				<div className="right">
					<Link to={`/profile`} className="user">
						<span className="user-icon">
							<UserIcon />
						</span>
						<div>
							{loggedInUser && (
								<div className="user-name">
									{JSON.parse(loggedInUser)?.fullName}
								</div>
							)}
							{loggedInUser && (
								<div className="user-name" style={{ paddingTop: "5px" }}>
									{JSON.parse(loggedInUser)?.phoneNumber ||
										JSON.parse(loggedInUser)?.mobileNumber}
								</div>
							)}
						</div>
					</Link>
				</div>

				<div className={`select_vehicle`}>
					{!isMobileApp && (
						<button className="btn">
							<Link to={"/"} className="link">
								<MdHome size={22} />
								Home
							</Link>
						</button>
					)}
					<button className="btn">
						<Link to={"/busbooking"} className="link">
							<BiSolidBus size={22} />
							Bus
						</Link>
					</button>
					<button className="btn">
						<Link to="/terms-of-service" className="link">
							<RiCustomerService2Fill size={22} />
							Terms Of Service
						</Link>
					</button>
					<button className="btn">
						<Link to="/privacy" className="link">
							<MdOutlinePolicy size={22} />
							Privacy Policy
						</Link>
					</button>
					{isMobileApp && (
						<button className="btn">
							<Link to={"/cabs"} className="link">
								Cab
							</Link>
						</button>
					)}
					<button className="btn">
						<Link to={"/contactus"} className="link">
							<RiContactsFill size={22} />
							Contact Us
						</Link>
					</button>
				</div>
				{loggedInUser ? (
					<a href="#" className="nav-bottom">
						<button
							style={{ padding: "5px 0" }}
							onClick={() => {
								localStorage.removeItem("token");
								localStorage.removeItem("loggedInUser");
								navigate("/login");
							}}
						>
							Logout
						</button>
					</a>
				) : (
					<Link to="/login" className="nav-bottom">
						<button style={{ padding: "5px 0" }}>Login</button>
					</Link>
				)}
			</div>

			<div
				className={`${
					openNav ? "white-screen white-screen-active" : "white-screen"
				}`}
				onClick={() => {
					setOpenNav(false);
				}}
			></div>
		</nav>
	);
};

export default Navbar;
