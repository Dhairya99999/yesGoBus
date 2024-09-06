import { useState, useEffect } from "react";
import BusRouteCard from "../BusRouteCard/BusRouteCard";
import Button from "../Button/Button";
import "./BusRoute.scss";
import { LuArrowUpDown, LuCalendarDays } from "react-icons/lu";
import axios from "axios";
import Calendar from "../Calendar/Calendar";
import { formatDate } from "../../utils/BusBookingHelpers";

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

	// const formatDate = (dateValue) => {
	// 	let date;
	// 	if (typeof dateValue === "string") {
	// 		const [day, month, year] = dateValue.split("-");
	// 		date = new Date(`${year}-${month}-${day}`);
	// 	} else {
	// 		date = new Date(dateValue);
	// 	}
	// 	const year = date.getFullYear();
	// 	const month = String(date.getMonth() + 1).padStart(2, "0");
	// 	const day = String(date.getDate()).padStart(2, "0");
	// 	return `${day}-${month}-${year}`;
	// };

	const handleDateChange = (isToday) => {
		const currentDate = new Date();
		const nextDate = new Date(currentDate);
		nextDate.setDate(currentDate.getDate() + (isToday ? 0 : 1));
		setInputDate(formatDate(nextDate));
		setDoj(formatDate(nextDate));
		setHighlighted(isToday);
	};

	useEffect(() => {
		const formattedDate = formatDate(departureDate);
		setSourceCity(locationOne);
		setDestinationCity(locationTwo);
		setDoj(formattedDate);
		setInputDate(formattedDate);
	}, [locationOne, locationTwo, departureDate]);

	const fetchLocationSuggestions = async (query, setLocationSuggestions) => {
		try {
			setLoading(true);
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/busBooking/searchCity/${query}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			setLocationSuggestions(response.data.data);
		} catch (error) {
			console.error("Something went wrong:", error);
		} finally {
			setLoading(false);
		}
	};

	const [locationOneQuery, setLocationOneQuery] = useState("");
	const [locationTwoQuery, setLocationTwoQuery] = useState("");

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (locationOneQuery) {
				fetchLocationSuggestions(locationOneQuery, setLocationOneSuggestions);
			}
			if (locationTwoQuery) {
				fetchLocationSuggestions(locationTwoQuery, setLocationTwoSuggestions);
			}
		}, 500);

		return () => clearTimeout(debounceTimer);
	}, [locationOneQuery, locationTwoQuery]);

	// const handleSearch = async () => {
	// 	if (sourceCity && destinationCity && doj) {
	// 		let formattedDate;
	// 		if (/^\d{2}-\d{2}-\d{4}$/.test(doj)) {
	// 			const [day, month, year] = doj.split("-");
	// 			formattedDate = `${year}-${month}-${day}`;
	// 		} else {
	// 			formattedDate = doj;
	// 		}
	// 		onSearch(sourceCity, destinationCity, formattedDate);
	// 	} else {
	// 		alert("Please enter values for all fields");
	// 	}
	// };

	const handleSearch = async () => {
		if (sourceCity && destinationCity && doj) {
			let formattedDate;
			if (/^\w+, \d{1,2}-\w+$/.test(doj)) {
				const [dayOfWeek, dayMonth] = doj.split(", ");
				const [dayOfMonth, monthName] = dayMonth.split("-");
				const months = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];
				const monthIndex = months.indexOf(monthName) + 1;
				const year = new Date().getFullYear();
				formattedDate = `${year}-${monthIndex
					.toString()
					.padStart(2, "0")}-${dayOfMonth.padStart(2, "0")}`;
			} else {
				const [day, month, year] = doj.split("-");
				formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
					2,
					"0"
				)}`;
			}
			onSearch(sourceCity, destinationCity, formattedDate);
		} else {
			alert("Please enter values for all fields");
		}
	};

	useEffect(() => {
		const googleTranslateElementInit = () => {
			new window.google.translate.TranslateElement(
				{
					pageLanguage: "en",
					includedLanguages: "en,kn,te,ta,ml,hi",
					layout:
						window.google.translate.TranslateElement.InlineLayout.TOP_RIGHT,
				},
				"google_translate_element"
			);
		};

		if (!document.getElementById("your_button_id")) {
			window.googleTranslateElementInit = googleTranslateElementInit;

			const yourButton = document.createElement("button");
			yourButton.id = "your_button_id";
			yourButton.style.display = "none";
			document.querySelector(".right").appendChild(yourButton);
		}
	}, []);

	return (
		<>
			<div className="BusRoute">
				<BusRouteCard
					title="From"
					suggestions={locationOneSuggestions}
					loading={loading}
					setLocationQuery={setLocationOneQuery}
					setData={setSourceCity}
				/>
				<div
					className="reverse-img"
					onClick={() => {
						setDestinationCity(sourceCity);
						setSourceCity(destinationCity);
						onSearch(destinationCity, sourceCity, doj);
					}}
				>
					<LuArrowUpDown />
				</div>
				<BusRouteCard
					title="To"
					suggestions={locationTwoSuggestions}
					loading={loading}
					setLocationQuery={setLocationTwoQuery}
					setData={setDestinationCity}
				/>
				<div className="date-input">
					<p className="date-label">Date of Journey</p>
					<div className="date-container">
						<input placeholder="dd-mm-yyyy" value={inputDate} readOnly />
						<div
							className="calendar-icon"
							onClick={() => setOpenCalendar(true)}
						>
							<LuCalendarDays size={25} />
						</div>
					</div>
				</div>
				<Button text={"Search"} onClicked={handleSearch} />
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
				<div className="outer_border">
					<div className="inputs">
						<div className="fromto">
							<BusRouteCard
								title="From"
								suggestions={locationOneSuggestions}
								loading={loading}
								setLocationQuery={setLocationOneQuery}
								setData={setSourceCity}
							/>
							<div className="img_rotater">
								<div
									className="reverse-img"
									width={23}
									onClick={() => {
										setDestinationCity(sourceCity);
										setSourceCity(destinationCity);
										onSearch(destinationCity, sourceCity, doj);
									}}
								>
									<LuArrowUpDown />
								</div>
								<hr />
							</div>
							<BusRouteCard
								title="To"
								suggestions={locationTwoSuggestions}
								loading={loading}
								setLocationQuery={setLocationTwoQuery}
								setData={setDestinationCity}
							/>
							<hr />
							<div className="date-input">
								<p className="date-label">Date of Journey</p>
								<div className="date-container">
									<input placeholder="dd-mm-yyyy" value={inputDate} readOnly />
									<div
										className="calendar-icon"
										onClick={() => setOpenCalendar(true)}
									>
										<LuCalendarDays size={25} />
									</div>
								</div>
							</div>
						</div>
						<div className="days">
							<button
								onClick={() => handleDateChange(true)}
								className={highlighted ? "dayButton highlighted" : "dayButton"}
								style={{ color: highlighted ? "#fff" : "#000" }}
							>
								Today
							</button>
							<button
								onClick={() => handleDateChange(false)}
								className={!highlighted ? "dayButton highlighted" : "dayButton"}
							>
								Tomorrow
							</button>
						</div>
					</div>
				</div>
				<Button
					text={"Search"}
					onClicked={handleSearch}
					style={{ width: "100%", marginTop: "5px" }}
				/>
			</div>
			{openCalendar && (
				<Calendar
					setOpenCalendar={setOpenCalendar}
					setInputDate={(date) => {
						const formattedDate = formatDate(date);
						setDoj(formattedDate);
						setInputDate(formattedDate);
					}}
					inputDate={inputDate}
				/>
			)}
		</>
	);
};

export default BusRoute;
