import { useState, useEffect } from "react";
//import { twowayarrow } from "../../assets/busbooking";
import BusRouteCard from "../BusRouteCard/BusRouteCard";
import Button from "../Button/Button";
import "./BusRoute.scss";
//import axiosInstance from "../../utils/service";
import { LuArrowUpDown } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
//import { Link } from "react-router-dom";
import axios from "axios";
import Calendar from "../Calendar/Calendar";

const BusRoute = ({ locationOne, locationTwo, departureDate, onSearch }) => {
	const [locationOneSuggestions, setLocationOneSuggestions] = useState([]);
	const [locationTwoSuggestions, setLocationTwoSuggestions] = useState([]);
	const [sourceCity, setSourceCity] = useState(locationOne);
	const [destinationCity, setDestinationCity] = useState(locationTwo);
	const [doj, setDoj] = useState(departureDate);
	const [inputDate, setInputDate] = useState(departureDate);
	const [loading, setLoading] = useState(false);
	const [highlighted, setHighlighted] = useState(true);
	const [openCalendar, setOpenCalendar] = useState(false);
	const token = localStorage.getItem("token");
	// const [departureDate, setDepartureDate] = useState("");

	const formatDate = (dateValue) => {
		let date;
		if (typeof dateValue === "string") {
			const [day, month, year] = dateValue.split("-");
			date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
		} else {
			date = new Date(dateValue);
		}
		const year = date.getFullYear();
		const month = date.toLocaleString("default", { month: "2-digit" });
		const day = date.toLocaleString("default", { day: "2-digit" });
		return `${day}-${month}-${year}`;
	};
	const handleDateChange = (isToday) => {
		const currentDate = new Date();
		const nextDate = new Date(currentDate);
		nextDate.setDate(currentDate.getDate() + (isToday ? 0 : 1));
		setInputDate(formatDate(nextDate));
		setHighlighted(isToday);
	};

	useEffect(() => {
		setSourceCity(locationOne);
		setDestinationCity(locationTwo);
		setDoj(departureDate);
	}, [locationOne, locationTwo, departureDate]);

	const fetchLocationSuggestions = async (query, setLocationSuggestions) => {
		try {
			setLoading(true);
			// if (query.length > 3) {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/busBooking/searchCity/${query}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json", // Set the content type to JSON
					},
				}
			);
			setLocationSuggestions(response.data.data);
			setLoading(false);
			// } else {
			//   setLocationSuggestions([]);
			// }
		} catch (error) {
			console.error("Something went wrong:", error);
		}
	};

	const [locationOneQuery, setLocationOneQuery] = useState("");
	const [locationTwoQuery, setLocationTwoQuery] = useState("");

	useEffect(() => {
		let debounceTimer;

		const handleQueryChange = () => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				if (locationOneQuery) {
					fetchLocationSuggestions(locationOneQuery, setLocationOneSuggestions);
				}
				if (locationTwoQuery) {
					fetchLocationSuggestions(locationTwoQuery, setLocationTwoSuggestions);
				}
			}, 500);
		};

		handleQueryChange();

		return () => {
			clearTimeout(debounceTimer);
		};
	}, [locationOneQuery, locationTwoQuery]);

	const handleSearch = async () => {
		if (sourceCity && destinationCity && doj) {
			let formattedDate;
			if (/^\d{4}-\d{2}-\d{2}$/.test(doj)) {
				formattedDate = doj;
			} else {
				formattedDate = formatDateTo(new Date(doj));
			}
			console.log(formattedDate);
			onSearch(sourceCity, destinationCity, formattedDate);
		} else {
			alert("Please enter values for all fields");
		}
	};

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
		yourButton.className = "my-button";
		document.querySelector(".right").appendChild(yourButton);

		// return () => {
		// 	const buttonToRemove = document.getElementById("your_button_id");
		// 	if (buttonToRemove) {
		// 		buttonToRemove.remove();
		// 	}
		// };
	});

	return (
		<>
			<div className="BusRoute">
				<BusRouteCard
					title="From"
					location={sourceCity}
					setLocation={(value) => onSearch(value, locationTwo, departureDate)}
					suggestions={locationOneSuggestions}
					loading={loading}
					setLocationQuery={setLocationOneQuery}
					startRecording={() => startRecording(setSourceCity)}
					setData={setSourceCity}
				/>
				<div
					//src={twowayarrow}
					//alt="reverse routes"
					className="reverse-img"
					onClick={({ target: image }) => {
						const currentRotation =
							getComputedStyle(image).getPropertyValue("transform");

						if (currentRotation === "none") {
							image.style.transform = "rotate(180deg)";
						} else {
							image.style.transform = "";
						}
						setDestinationCity(locationOne);
						setSourceCity(locationTwo);
						console.log(sourceCity);
						onSearch(locationTwo, locationOne, departureDate);
					}}
				>
					<LuArrowUpDown />
				</div>
				<BusRouteCard
					title="To"
					location={destinationCity}
					setLocation={(value) => onSearch(locationOne, value, departureDate)}
					suggestions={locationTwoSuggestions}
					loading={loading}
					setLocationQuery={setLocationTwoQuery}
					startRecording={() => startRecording(setDestinationCity)}
					setData={setDestinationCity}
				/>
				<BusRouteCard
					title="Select Date"
					location={departureDate}
					setLocation={(value) => onSearch(locationOne, locationTwo, value)}
					date={true}
					setData={setDoj}
				/>
				<Button text={"Search"} onClicked={() => handleSearch()} />
			</div>
			<div className="MobileBusRoute">
				<div className="MobileBusRouteHead">
					<h3 className="ml-3">Bus Ticket</h3>
					<div
						id="google_translate_element"
						className="google_translate_element"
						style={{ position: "static" }}
					></div>
				</div>

				{/* <h4 style={{ color: "white" }}>PROVIDING QUALITY SERVICES AT </h4>
        <h4 className="orange-text">AFFORDABLE PRICES</h4> */}
				<div>
					{/* <h5 style={{ color: "white" }}>Bus Ticket</h5> */}

					<div className="outer_border">
						<div className="inputs">
							<div className="fromto">
								<BusRouteCard
									title="From"
									location={sourceCity}
									setLocation={(value) =>
										onSearch(value, locationTwo, departureDate)
									}
									suggestions={locationOneSuggestions}
									loading={loading}
									setLocationQuery={setLocationOneQuery}
									style={{
										borderTop: "none",
										backgroundColor: "transparent",
										paddingLeft: "10px",
										paddingTop: "0px",
										paddingBottom: "0px",
										paddingRight: "10px",
										maxWidth: "100%",
									}}
									// color={{ color: "#fd5901" }}
									setData={setSourceCity}
								/>
								<div className="img_rotater">
									<div
										//src={twowayarrow}
										//alt="reverse routes"
										className="reverse-img"
										width={23}
										onClick={({ target: image }) => {
											const currentRotation =
												getComputedStyle(image).getPropertyValue("transform");

											if (currentRotation === "none") {
												image.style.transform = "rotate(180deg)";
											} else {
												image.style.transform = "";
											}
											setDestinationCity(locationOne);
											setSourceCity(locationTwo);
											onSearch(locationTwo, locationOne, departureDate);
										}}
									>
										<LuArrowUpDown />
									</div>
									<hr />
								</div>
								<BusRouteCard
									title="To"
									location={destinationCity}
									setLocation={(value) =>
										onSearch(locationOne, value, departureDate)
									}
									suggestions={locationTwoSuggestions}
									loading={loading}
									setLocationQuery={setLocationTwoQuery}
									style={{
										borderTop: "none",
										backgroundColor: "transparent",
										paddingLeft: "10px",
										paddingTop: "0px",
										paddingBottom: "0px",
										paddingRight: "10px",
										maxWidth: "100%",
									}}
									setData={setDestinationCity}
								/>
								<hr />
								<div className="date-input">
									<p className="date-label">Select Date</p>
									<div className="date-container">
										<input
											placeholder="dd-mm-yyyy"
											value={formatDate(inputDate)}
										/>
										<div
											className="calendar-icon"
											onClick={() => {
												setOpenCalendar(true);
											}}
										>
											<LuCalendarDays size={25} />
										</div>
									</div>
								</div>
							</div>

							<div className="days">
								<button
									onClick={() => handleDateChange(true)}
									className={
										highlighted ? "dayButton highlighted" : "dayButton"
									}
									style={{ color: highlighted ? "#fff" : "#000" }}
								>
									Today
								</button>
								<button
									onClick={() => handleDateChange(false)}
									className={
										!highlighted ? "dayButton highlighted" : "dayButton"
									}
								>
									Tomorrow
								</button>
							</div>
						</div>
					</div>
				</div>
				<Button
					text={"Search"}
					onClicked={() => handleSearch()}
					style={{ width: "100%", marginTop: "5px" }}
				/>
			</div>
			{openCalendar && (
				<Calendar
					setOpenCalendar={setOpenCalendar}
					setDoj={setDoj}
					setInputDate={setInputDate}
				/>
			)}
		</>
	);
};

export default BusRoute;
