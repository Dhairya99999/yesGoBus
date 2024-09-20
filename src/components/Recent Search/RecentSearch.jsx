import { rightarrow } from "../../assets/busbooking";
import "./recentSearch.scss";
import { formatDate } from "../../utils/BusBookingHelpers.js";
import { useNavigate } from "react-router-dom";

const ReacentSearch = ({ data }) => {
	const navigate = useNavigate();

	const handleSearch = (from, to, doj) => {
		// console.log("doj", doj);
		navigate(`/busbooking?from=${from}&to=${to}&date=${doj}`);
	};

	return (
		<div className="recent-search">
			<span className="recent-search-title">Recent Search</span>
			<div className="recent-search-container">
				{data.slice(0, 4).map((item, index) => (
					<div
						onClick={() => handleSearch(item[0], item[1], item[2])}
						className="search-card"
						key={index}
					>
						<span className="recent-data">
							<span>{item[0]}</span>
							<img src={rightarrow} alt="left arrow" style={{ width: 20 }} />
						</span>
						<span className="recent-data">{item[1]}</span>
						<span className="recent-data-doj">{formatDate(item[2])}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReacentSearch;
