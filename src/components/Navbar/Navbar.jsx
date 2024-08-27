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
    const translateElement = document.getElementById("google_translate_element");
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
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem("token");

  const activeStyle = {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    backgroundColor: '#FF5722',
    color: '#FFFFFF',
    borderRadius: '8px',
    textDecoration: 'none',
  };

  const inactiveStyle = {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    backgroundColor: '#BDBDBD',
    color: '#FFFFFF',
    borderRadius: '8px',
    textDecoration: 'none',
  };

  const menu = (
    <div className="nav-menubar mt-20 ml-3">
      <div className="logo-new">
        <a href={"/"}>
          <img className="blacklogo" src={blacklogo} width={150} alt="" />
        </a>
      </div>
      <h4 style={{ color: "black" }}>
        PROVIDING QUALITY SERVICES AT
      </h4>
      <h4 className="orange-text" style={{ color: "#FF5722" }}>
        AFFORDABLE PRICES
      </h4>
      <div className="burger-menu">
        {/* <Link to="/busbooking" style={activeStyle}>
          <span>Bus</span>
        </Link> */}
        {/* <Link
          to={
            token
              ? `/travel-app/?token=${token}&userName=${
                  JSON.parse(loggedInUser).fullName
                }&email=${JSON.parse(loggedInUser).email}&userId=${
                  JSON.parse(loggedInUser)._id
                }&phoneNumber=${JSON.parse(loggedInUser).phoneNumber}`
              : "/login"
          }
          style={inactiveStyle}
        >
          <span>Tours & Travels</span>
        </Link> */}
        <div className="md:block" id="google_translate_element"></div>
      </div>
    </div>
  );

  return (
    <nav className="navbar burger">
      {page === "home" && menu}
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
            <img className="logo" src={page === "home" ? logo : blacklogo} width={50} height={50} alt="" />
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
