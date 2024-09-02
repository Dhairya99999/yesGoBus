import { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./calendar.css"; // Import custom CSS for styling

const Calendar = ({ setOpenCalendar, setDoj, setInputDate }) => {
	const today = new Date();
	const [currentDate, setCurrentDate] = useState(today);
	const [selectedDate, setSelectedDate] = useState(null);

	// Get the first day and the total days of the month
	const getFirstDayOfMonth = (date) =>
		new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	const getDaysInMonth = (date) =>
		new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

	// Generate an array of days for the calendar
	const generateCalendar = (date) => {
		const daysInMonth = getDaysInMonth(date);
		const firstDay = getFirstDayOfMonth(date);
		const daysArray = [];

		// Fill the days array with empty slots for the previous month
		for (let i = 0; i < firstDay; i++) {
			daysArray.push("");
		}

		// Fill the days array with the current month days
		for (let i = 1; i <= daysInMonth; i++) {
			daysArray.push(i);
		}

		return daysArray;
	};

	// Navigate to the previous month
	const prevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		);
	};

	// Navigate to the next month
	const nextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		);
	};

	// Generate the days array
	const daysArray = generateCalendar(currentDate);

	// Get month and year to display
	const month = currentDate.toLocaleString("default", { month: "long" });
	const year = currentDate.getFullYear();

	// Days of the week headers
	const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

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

	// Handle date click
	const handleDateClick = (day) => {
		// console.log("handleDateClick called with day:", day);
		if (day > 0 && day <= getDaysInMonth(currentDate)) {
			const clickedDate = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				day
			);
			// console.log("clickedDate:", clickedDate);
			// console.log(
			// 	"clickedDate.toLocaleString():",
			// 	clickedDate.toLocaleString()
			// );
			if (
				selectedDate &&
				clickedDate.toDateString() === selectedDate.toDateString()
			) {
				// console.log(" deselecting date");
				setSelectedDate(null);
				setDoj("");
				setInputDate("");
				setOpenCalendar(false);
			} else {
				// console.log("selecting date");
				setSelectedDate(clickedDate);
				setDoj(formatDate(clickedDate));
				setInputDate(formatDate(clickedDate));
				setOpenCalendar(false);
			}
		}
	};

	return (
		<div>
			<div
				className="overlay"
				onClick={() => {
					setOpenCalendar(false);
				}}
			></div>
			<div className="calendar-container">
				<div className="calendar-header">
					<div onClick={prevMonth} style={{ cursor: "pointer" }}>
						<FaArrowLeftLong />
					</div>
					<h2>{`${month} ${year}`}</h2>
					<div onClick={nextMonth} style={{ cursor: "pointer" }}>
						<FaArrowRightLong />
					</div>
				</div>
				<div className="calendar-grid">
					{daysOfWeek.map((day) => (
						<div key={day} className="calendar-day-header">
							{day}
						</div>
					))}
					{daysArray.map((day, index) => {
						const dateObj = new Date(
							currentDate.getFullYear(),
							currentDate.getMonth(),
							day
						);
						const isBeforeToday = dateObj < today && day !== "";
						const isToday = dateObj.toDateString() === today.toDateString();
						const isSelected =
							selectedDate &&
							dateObj.toDateString() === selectedDate.toDateString();

						return (
							<div
								key={index}
								className={`calendar-day ${day === "" ? "empty" : ""} ${
									isBeforeToday ? "disabled" : ""
								} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
								onClick={() => handleDateClick(day)}
							>
								{day}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
