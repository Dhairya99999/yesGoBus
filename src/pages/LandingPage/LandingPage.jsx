import {
  // applestore,
  // blacklogo,
  bus,
  // bus1,
  // bus2,
  // bus3,
  // bus4,
  // bus5,
  // bus6,
  // calender,
  // copy,
  custcare,
  disabled,
  //fb,
  filledticket,
  fromto,
  heroimage,
  // insta,
  // linkedin,
  // mastercard,
  // mic,
  // offer1,
  // office,
  orangeBus,
  //playstore,
  routes,
  //rupay,
  smile,
  ticket,
  // twitter,
  // visa,
  // wifi,
} from "../../assets/homepage";

import { Navbar, Button, InfoCard, Title, BusRoute } from "../../components";
import "./landingPage.scss";
import { useState, useEffect } from "react";
//import axiosInstance from "../../utils/service";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();

  let currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  currentDate = `${year}-${month}-${day}`;

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const [locationOneSuggestions, setLocationOneSuggestions] = useState([]);
  const [locationTwoSuggestions, setLocationTwoSuggestions] = useState([]);

  // const [dateSource, setDateSource] = useState("input");
  // const [todayHighlighted, setTodayHighlighted] = useState(false);
  // const [tomorrowHighlighted, setTomorrowHighlighted] = useState(false);

  // const handleDateInputChange = (date) => {
  //   setSelectedDate(date);
  //   setDateSource("input");
  //   setTodayHighlighted(false);
  //   setTomorrowHighlighted(false);
  // };

  // const handleTodayButtonClick = () => {
  //   const today = new Date();
  //   const todayFormatted = `${today.getFullYear()}-${String(
  //     today.getMonth() + 1
  //   ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  //   setSelectedDate(todayFormatted);
  //   setDateSource("today");
  //   setTodayHighlighted(true);
  //   setTomorrowHighlighted(false);
  // };

  // const handleTomorrowButtonClick = () => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   const tomorrowFormatted = `${tomorrow.getFullYear()}-${String(
  //     tomorrow.getMonth() + 1
  //   ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  //   setSelectedDate(tomorrowFormatted);
  //   setDateSource("tomorrow");
  //   setTomorrowHighlighted(true);
  //   setTodayHighlighted(false);
  // };

  const handleSearchClick = (fromLocation,toLocation,selectedDate) => {
    if (fromLocation && toLocation && selectedDate) {
      if (
        fromLocation.trim().toLowerCase() === toLocation.trim().toLowerCase()
      ) {
        alert("Source and destination cities cannot be the same.");
        return;
      }

      navigate(
        `/busbooking?from=${fromLocation}&to=${toLocation}&date=${selectedDate}`
      );
    } else {
      alert("Please enter values for all fields");
    }
  };

  const fetchLocationSuggestions = async (query, setLocationSuggestions) => {
    try {
      console.log("hii");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/busBooking/searchCity/${query}`
      );
      setLocationSuggestions(response.data.data);
      // } else {
      //   setLocationSuggestions([]);
      // }
    } catch (error) {
      console.error("omething went wrong:", error);
    }
  };

  // useEffect(() => {
  //   if (fromLocation) {
  //     fetchLocationSuggestions(fromLocation, setLocationOneSuggestions);
  //   }
  //   if (toLocation) {
  //     fetchLocationSuggestions(toLocation, setLocationTwoSuggestions);
  //   }
  // }, [fromLocation, toLocation]);

  useEffect(() => {
    let debounceTimer;

    const handleQueryChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (fromLocation) {
          fetchLocationSuggestions(fromLocation, setLocationOneSuggestions);
        }
        if (toLocation) {
          fetchLocationSuggestions(toLocation, setLocationTwoSuggestions);
        }
      }, 500);
    };

    handleQueryChange();

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [fromLocation, toLocation]);

  const formatDateToYYYYMMDD = (date) => {
    console.log(date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="landingPage">
      <Navbar page={"home"} />
      {/*<div className="hero" style={{ maxHeight: "90vh" }}>
        <img
          src={heroimage}
          alt=""
          className="heroImg"
          style={{ maxHeight: "90vh" }}
        />
        <div className="heroContainer">
          <div className="title">
            <h1>PROVIDING QUALITY SERVICES AT</h1>
            <h1>AFFORDABLE PRICES</h1>
          </div>

          <h2>
            India’s largest online bus ticketing platform, trusted by over 6
            million Indians.
          </h2>
          <div className="bus-search-container">
            <InfoCard
              // img={office}
              title={fromLocation}
              // subtitle={"From"}
              label="From"
              inputField={true}
              onChanged={setFromLocation}
              suggestions={locationOneSuggestions}
              placeholder={"Departure"}
              style={{
                borderTop: "none",
                backgroundColor: "transparent",
                paddingLeft: "10px",
                paddingTop: "0px",
                paddingBottom: "20px",
                paddingRight: "10px",
                maxWidth: "100%",
              }}
            />
            <img
              src={fromto}
              alt="reverse route"
              className="reverse-image cursor-pointer"
              onClick={({ target: image }) => {
                const currentRotation =
                  getComputedStyle(image).getPropertyValue("transform");

                if (currentRotation === "none") {
                  image.style.transform = "rotate(180deg)";
                } else {
                  image.style.transform = "";
                }
                setFromLocation(toLocation);
                setToLocation(fromLocation);
              }}
            />
            <InfoCard
              // img={office}
              title={toLocation}
              label="To"
              // subtitle={"Destination"}
              inputField={true}
              onChanged={setToLocation}
              suggestions={locationTwoSuggestions}
              placeholder={"Destination"}
            />
            {/* <img src={mic} alt="" /> 
            <InfoCard
              // img={calender}
              title={selectedDate}
              // subtitle={"Select Date"}
              date={true}
              label="Date"
              inputField={true}
              onChanged={handleDateInputChange}
            />
            {/* <InfoCard
              img={calender}
              title={"- - -"}
              subtitle={"Return Optional"}
            /> 


            <div className="buttons">
              <button
                onClick={handleTodayButtonClick}
                className={
                  todayHighlighted ? "dayButton highlighted" : "dayButton"
                }
              >
                Today
              </button>
              <button
                onClick={handleTomorrowButtonClick}
                className={
                  tomorrowHighlighted ? "dayButton highlighted" : "dayButton"
                }
              >
                Tomorrow
              </button>
            </div>
            <Button
            className="search-btn"
            text={"Search"}
            onClicked={handleSearchClick}
          />
          </div>
        </div>
      </div>*/}
      <BusRoute
        locationOne={fromLocation}
        locationTwo={toLocation}
        departureDate={formatDateToYYYYMMDD(new Date())}
        returnDate=""
        onSearch={handleSearchClick}
      />
      <div className="popularBusTicket">
      <h1 style={{fontSize:24,textAlign:"center",paddingTop:20}}>Popular Bus Ticket</h1>
        <div className="wrapper">
          {/* <InfoCard
            img={wifi}
            title={"FREE WIFI"}
            subtitle={"We have buses equipped with Wi-Fi and sockets"}
          /> */}
          <InfoCard
            img={bus}
            title={"CONVENIENT Booking"}
            subtitle={"Free Taxi On The Bus"}
          />
          <InfoCard
            img={disabled}
            title={"COMFORTABLE SEATS"}
            subtitle={
              "You can spend 12 hours without any discomfort in our seats"
            }
          />
          <InfoCard
            img={ticket}
            title={"BUY TICKETS EASILY"}
            subtitle={"UPI, Bank Payments, Visa, MasterCards, etc..."}
          />
        </div>
      </div>

      {/* <div className="exclusiveOffers">
        <Title title={"Exclusive Offers"} subtitle={"view more"} />
        <div className="offers">
          <OffersCard
            img={offer1}
            title={"Deal of the Day"}
            subtitle={"Enjoy Different  Deals Each Day With "}
            code={"EASEDAY"}
            date={"31st july, 2023"}
          />
          <OffersCard
            img={offer1}
            title={"Deal of the Day"}
            subtitle={"Enjoy Different  Deals Each Day With "}
            code={"EASEDAY"}
            date={"31st july, 2023"}
          />
          <OffersCard
            img={offer1}
            title={"Deal of the Day"}
            subtitle={"Enjoy Different  Deals Each Day With "}
            code={"EASEDAY"}
            date={"31st july, 2023"}
          />
        </div>
      </div> */}

      {/* <div className="govBuses">
        <Title title={"Government Buses"} subtitle={"view more"} />
        <div className="govBusesContainer">
          <InfoCard img={bus1} subtitle={"APSRTC"} />
          <InfoCard img={bus2} subtitle={"KSRTC"} />
          <InfoCard img={bus3} subtitle={"TSRTC"} />
          <InfoCard img={bus4} subtitle={"HRTC"} />
          <InfoCard img={bus5} subtitle={"MSRTC"} />
          <InfoCard img={bus6} subtitle={"KSRTC"} />
        </div>
      </div> */}

      {/* <div className="popularBusRoutes">
        <Title title={"Popular Bus Routes"} subtitle={"View More"} />

        <div className="popularBusRoutesContainer">
          <PopularRoutes busname={"Mumbai Bus"} to={"Goa, Pune, Bangalore"} />
          <PopularRoutes busname={"Mumbai Bus"} to={"Goa, Pune, Bangalore"} />
          <PopularRoutes busname={"Mumbai Bus"} to={"Goa, Pune, Bangalore"} />
          <PopularRoutes busname={"Mumbai Bus"} to={"Goa, Pune, Bangalore"} />
          <PopularRoutes busname={"Mumbai Bus"} to={"Goa, Pune, Bangalore"} />
        </div>
      </div> */}

      <div className="whyChooseYesGoBus">
        <Title title={"Why YesGoBus For Bus Booking"} />
        <div className="whyChooseYesGoBusContainer">
          <InfoCard img={routes} title={"10000+"} subtitle={"Routes"} />
          <InfoCard img={orangeBus} title={"3500+"} subtitle={"BUS PARTNERS"} />
          <InfoCard
            img={filledticket}
            title={"30 SEC"}
            subtitle={"routeINSTANT E-TICKET & REFUND"}
          />
          <InfoCard
            img={smile}
            title={"1 million"}
            subtitle={"HAPPY CUSTOMERS"}
          />
          <InfoCard
            img={custcare}
            title={"24/7"}
            subtitle={"CUSTOMER SUPPORT"}
          />
        </div>
      </div>

      {/* <div className="customerReviews">
        <Title title={"Customer Reviews"} subtitle={"View More"} />
        <div className="customerReviewsContainer">
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
      </div> */}

      {/* <div className="aboveFooter">
        <img src={blacklogo} alt="" />
        <AboveFooterImages
          images={[visa, mastercard, rupay]}
          title={"PAY SECURELY BY"}
        />
        <hr style={{ borderLeft: "2px solid lightgray", height: "100px" }} />

        <div className="reachUs">
          <span>Reach Us</span>
          <p>For any query Please email us questions?</p>
          <a href="">xxxxxxxxxx@gmail.com</a>
        </div>
        <hr style={{ borderLeft: "2px solid lightgray", height: "100px" }} />
        <AboveFooterImages
          images={[playstore, applestore]}
          title={"DOWNLOAD THE APP NOW"}
        />
        <hr style={{ borderLeft: "2px solid lightgray", height: "100px" }} />

        <AboveFooterImages
          images={[fb, insta, twitter, linkedin]}
          title={"FOLLOW US ON"}
        />
      </div> */}
    </div>
  );
};
export default LandingPage;
