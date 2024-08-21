import { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./calendar.css"; // Import custom CSS for styling

const Calendar = ({ setOpenCalendar, setDate, setInputValue }) => {
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
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formatDateTo = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  // Handle date click
  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (selectedDate && clickedDate.toDateString() === selectedDate.toDateString()) {
      setSelectedDate(null);
      setDate("");
      setOpenCalendar(false);
    } else {
      setSelectedDate(clickedDate);
      setDate(formatDateToYYYYMMDD(clickedDate));
      setInputValue(formatDateTo(clickedDate));
      setOpenCalendar(false);
    }
  };

  return (
    <div>
      <div className="overlay" onClick={() => { setOpenCalendar(false); }}></div>
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
