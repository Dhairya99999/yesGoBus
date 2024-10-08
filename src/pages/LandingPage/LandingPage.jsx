import React, { useState, useEffect } from "react";
import {
	custcare,
	recommendation,
	seat,
	schoolBus,
	filledticket,
	orangeBus,
	routes,
	smile,
} from "../../assets/homepage";
import { Navbar, InfoCard, Title, BusRoute } from "../../components";
import BottomBar from "../BottomBar/BottomBar.jsx"; // Import the BottomBar component
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./landingPage.scss";
import RecentSearch from "../../components/Recent Search/RecentSearch.jsx";
// import Banner from "../../components/IntroHome/Banner.jsx";
import { formatDate } from "../../utils/BusBookingHelpers.js";

const LandingPage = () => {
	const navigate = useNavigate();

	let currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, "0");
	const day = String(currentDate.getDate()).padStart(2, "0");
	currentDate = `${day}-${month}-${year}`;

	const [fromLocation, setFromLocation] = useState("");
	const [toLocation, setToLocation] = useState("");
	// const [selectedDate, setSelectedDate] = useState(currentDate);

	const [locationOneSuggestions, setLocationOneSuggestions] = useState([]);
	const [locationTwoSuggestions, setLocationTwoSuggestions] = useState([]);

	const [data, setData] = useState(() => {
		const storedData = localStorage.getItem("recentSearch");
		try {
			return storedData ? JSON.parse(storedData) : [];
		} catch (error) {
			return [];
		}
	});

	const handleSave = (from, to, doj) => {
		const newData = [from, to, doj];
		const updatedData = [...data];
		if (updatedData.length >= 4) {
			updatedData.shift(); // remove the oldest entry
		}
		updatedData.push(newData);
		setData(updatedData);
		localStorage.setItem("recentSearch", JSON.stringify(updatedData));
	};

	const handleSearchClick = (fromLocation, toLocation, selectedDate) => {
		if (fromLocation && toLocation && selectedDate) {
			if (
				fromLocation.trim().toLowerCase() === toLocation.trim().toLowerCase()
			) {
				alert("Source and destination cities cannot be the same.");
				return;
			}
			handleSave(fromLocation, toLocation, selectedDate);
			navigate(
				`/busbooking?from=${fromLocation}&to=${toLocation}&date=${selectedDate}`
			);
		} else {
			alert("Please enter values for all fields");
		}
	};

	const fetchLocationSuggestions = async (query, setLocationSuggestions) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/busBooking/searchCity/${query}`
			);
			setLocationSuggestions(response.data.data);
		} catch (error) {
			console.error("Something went wrong:", error);
		}
	};

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const sourceCity = queryParams.get("from");
		//  || localStorage.getItem("sourceCity");
		const destinationCity = queryParams.get("to");
		// || localStorage.getItem("destinationCity");
		if (sourceCity && destinationCity) {
			setFromLocation(sourceCity);
			setToLocation(destinationCity);
		}
	}, [fromLocation, toLocation]);

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

	return (
		<div className="landingPage">
			<Navbar page={"home"} />
			{/* <Banner/> */}
			<BusRoute
				locationOne={fromLocation}
				locationTwo={toLocation}
				departureDate={formatDate(currentDate)}
				returnDate=""
				onSearch={handleSearchClick}
			/>
			{data && <RecentSearch data={data} />}
			<div className="popularBusTicket">
				<span className="popularBusTicketTitle">Popular Bus Ticket</span>
				<div className="wrapper">
					<InfoCard
						img={schoolBus}
						title={"Convenient Booking"}
						subtitle={"Free Taxi On The Bus"}
					/>
					<InfoCard
						img={seat}
						title={"Comfortable Seats"}
						subtitle={
							"You can spend 12 hours without any discomfort in our seats"
						}
					/>
					<InfoCard
						img={recommendation}
						title={"Buy Tickets Easily"}
						subtitle={"UPI, Bank Payments, Visa, MasterCards, etc..."}
					/>
				</div>
			</div>
			<div className="whyChooseYesGoBus">
				{/* <Title title={"Why YesGoBus For Bus Booking"} /> */}
				<span className="whyChooseYesGoBusTitle">
					Why YesGoBus For Bus Booking
				</span>
				<div className="whyChooseYesGoBusContainer">
					<InfoCard img={routes} title={"10000+"} subtitle={"Routes"} />
					<InfoCard img={orangeBus} title={"3500+"} subtitle={"BUS PARTNERS"} />
					<InfoCard
						img={filledticket}
						title={"30 SEC"}
						subtitle={"INSTANT E-TICKET & REFUND"}
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
			<BottomBar /> {/* Add the BottomBar component */}
		</div>
	);
};

export default LandingPage;
