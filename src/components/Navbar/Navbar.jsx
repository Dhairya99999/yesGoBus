import { useState, useEffect } from "react";
import { logo } from "../../assets";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiContactsFill } from "react-icons/ri";
import { BiSolidBus } from "react-icons/bi";
import { MdHome } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
//import { MdCardTravel } from "react-icons/md";
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

  function changeLanguage(languageCode) {
    translateElement.showInvisible();
    translateElement.selectLanguage(languageCode);
  }

  // useEffect(() => {
  //   const translateElement = document.getElementById("google_translate_element");
  //   if (translateElement) {
  //     translateElement.innerHTML = "";
  //   }
  //   const script = document.createElement("script");
  //   script.src =
  //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   window.googleTranslateElementInit = googleTranslateElementInit;
  // }, []);

  useEffect(() => {
    const translateElement = document.getElementById(
      "google_translate_element"
    );
    if (translateElement) {
      translateElement.innerHTML = "";
    }

    const buttonElement = document.getElementById("your_button_id");
    if (buttonElement) {
      // Check if the button element is already present
      return;
    }

    // Your existing script loading logic

    window.googleTranslateElementInit = googleTranslateElementInit;

    // Additional logic to prevent multiple renderings of the button
    const yourButton = document.createElement("button");
    yourButton.id = "your_button_id"; // Replace with the actual ID for your button
    yourButton.style.display = "none";
    document.querySelector(".right").appendChild(yourButton);

    // Clean up the button on component unmount
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
  const menu = (
    <div className="burger-menu">
     {/* <a href="/">
        <span>Home</span>
      </a>*/}
      <Link to="/busbooking">
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

{ /*     <Link to="/contactus">
        <span>Contact Us</span>
      </Link>*/}
      <div className="md:block" id="google_translate_element"></div>
    </div>
  );
  return (
    <nav className="navbar burger">
      {menu}
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
          {page === "home" ? (
            <a href={"/"}>
              <img className="logo" src={logo} width={50} height={50} alt="" />
            </a>
          ) : (
            <a href={"/"}>
              <img className="blacklogo" src={blacklogo} width={50} alt="" />
            </a>
          )}
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

        <div className="right  ">

          <Link to={`/profile`} className="user">
            <span className={page === "home" ? "user-icon" : "user-icon"}>
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
                  {JSON.parse(loggedInUser)?.phoneNumber
                    ? JSON.parse(loggedInUser)?.phoneNumber
                    : JSON.parse(loggedInUser)?.mobileNumber}
                </div>
              )}
            </div>
          </Link>
        </div>
        <>
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
{ /*           <button className="btn">
              <Link
                to={
                  token
                    ? `/travel-app/?token=${token}&userName=${
                        JSON.parse(loggedInUser).fullName
                      }&email=${JSON.parse(loggedInUser).email}&userId=${
                        JSON.parse(loggedInUser)._id
                      }&phoneNumber=${JSON.parse(loggedInUser).phoneNumber}`
                    : "/login"
                }
                className="link"
              >
                <MdCardTravel size={22} />
                Tours & Travels
              </Link>
            </button>*/}
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
        </>
        {showMenu && menu}
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
