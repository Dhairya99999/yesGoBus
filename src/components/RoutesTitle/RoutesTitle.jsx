import { useState } from "react";
import { rightarrow } from "../../assets/busbooking";
import "./RoutesTitle.scss";
import { formatDate } from "../../utils/BusBookingHelpers";

const RoutesTitle = ({ locationOne, locationTwo, date, onDateChange }) => {
	const [highlighted, setHighlighted] = useState(true);
	const handleDateChange = (isToday) => {
		const currentDate = new Date();
		const nextDate = new Date(currentDate);
		nextDate.setDate(currentDate.getDate() + (isToday ? 0 : 1));
		const formattedDate = `${nextDate.getFullYear()}-${String(
			nextDate.getMonth() + 1
		).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;
		onDateChange(formattedDate);
		setHighlighted(isToday);
	};
	return (
		<div className="RoutesTitle">
			<div className="locations">
				<div className="toandfrom">
					<span>{locationOne}</span>
					<img src={rightarrow} alt="" />
					<span>{locationTwo}</span>
				</div>
				<hr />
				<h3>{formatDate(date)}</h3>
			</div>
			<div className="buttons">
				<button
					onClick={() => handleDateChange(true)}
					className={highlighted ? "dayButton highlighted" : "dayButton"}
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
	);
};

export default RoutesTitle;
