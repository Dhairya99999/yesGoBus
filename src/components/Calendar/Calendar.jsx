import { useState, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./Calendar.scss"; // Import custom CSS for styling

const Calendar = ({ setOpenCalendar, setInputDate, inputDate }) => {
	const today = new Date();
	const [currentDate, setCurrentDate] = useState(today);

	const [highlighted, setHighlighted] = useState(true);

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
	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
	const [selectedDate, setSelectedDate] = useState(formatDate(inputDate));
	// console.log(selectedDate);
	// Handle date click
	const handleDateClick = (day) => {
		if (day > 0 && day <= getDaysInMonth(currentDate)) {
			const clickedDate = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				day
			);

			if (clickedDate < today) {
				return; // Do nothing if the date is in the past
			}

			if (
				selectedDate &&
				clickedDate.toDateString() === selectedDate.toString()
			) {
				setSelectedDate(null);
				setInputDate(""); // Clear the date
				setOpenCalendar(false);
			} else {
				setSelectedDate(clickedDate);
				setInputDate(formatDate(clickedDate)); // Set the date
				setOpenCalendar(false);
			}
		}
	};

	const handleDateChange = (isToday) => {
		const currentDate = new Date();
		const nextDate = new Date(currentDate);
		nextDate.setDate(currentDate.getDate() + (isToday ? 0 : 1));
		setInputDate(formatDate(nextDate));
		setHighlighted(isToday);
		setOpenCalendar(false);
	};

	function getCurrentAndNextDate() {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		const formattedToday = today.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "short",
			day: "numeric",
		});

		const formattedTomorrow = tomorrow.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "short",
			day: "numeric",
		});

		return { today: formattedToday, tomorrow: formattedTomorrow };
	}

	const dates = getCurrentAndNextDate();

	return (
		<div className="calendar-container">
			{/* Header */}
			<div className="header">
				<div
					className="back-btn"
					onClick={() => {
						setOpenCalendar(false);
					}}
				>
					<FaArrowLeftLong />
				</div>

				<div className="title">Select Journey Date</div>
			</div>
			{/* Today and tomorrow */}
			<div className="dates-container">
				<button
					onClick={() => handleDateChange(true)}
					className={highlighted ? "date highlighted" : "date"}
				>
					<span>Today</span>
					<span className="date-0">{dates.today}</span>
				</button>
				<button
					onClick={() => handleDateChange(false)}
					className={!highlighted ? "date highlighted" : "date"}
				>
					<span>Tomorrow</span>
					<span className="date-0">{dates.tomorrow}</span>
				</button>
			</div>
			{/* Calendar */}
			<div className="calendar">
				<div className="calendar-header">
					<div
						onClick={prevMonth}
						className="calendar-arrow"
						style={{
							cursor: "pointer",
						}}
					>
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
						// const isToday = dateObj.toDateString() === today.toDateString();
						const isSelected =
							selectedDate &&
							formatDate(dateObj).toString() === selectedDate.toString();
						// console.log(isSelected);

						return (
							<div
								key={index}
								className={`calendar-day ${day === "" ? "empty" : ""} ${
									isBeforeToday ? "disabled" : ""
								}  ${isSelected ? "selected" : ""}`}
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
