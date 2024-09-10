import { useState, useEffect, useRef } from "react";
import "./BusRouteCard.scss";
import { Spin } from "antd";
import VoiceSearchWeb from "./Components/VoiceSearchWeb/VoiceSearchWeb";

const BusRouteCard = ({
	title,
	suggestions,
	loading,
	setLocationQuery,
	style,
	color,
	setData,
	value,
}) => {
	const [inputValue, setInputValue] = useState(value);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef(null);

	useEffect(() => {
		setInputValue(value);
		setData(value);
	}, [value, setData]);

	const handleInputChange = (e) => {
		const newInputValue = e.target.value;
		setInputValue(newInputValue);
		setData(newInputValue);
		setLocationQuery(newInputValue);
		setShowSuggestions(true);
	};

	const handleSuggestionClick = (suggestion) => {
		setInputValue(suggestion);
		setData(suggestion);
		setShowSuggestions(false);
	};

	const handleClickOutside = (e) => {
		if (inputRef.current && !inputRef.current.contains(e.target)) {
			setShowSuggestions(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleInputClick = () => {
		setShowSuggestions(true);
	};

	return (
		<div className="BusRouteCard" ref={inputRef} style={style}>
			<p style={color}>{title}</p>
			<div style={{ display: "flex", alignItems: "center" }}>
				<input
					type="search"
					value={inputValue}
					onChange={handleInputChange}
					onClick={handleInputClick}
				/>
				<VoiceSearchWeb
					setLocationQuery={setLocationQuery}
					setInputValue={setInputValue}
					setData={setData}
					title={title}
				/>
			</div>

			{showSuggestions && (
				<ul className="suggestion-list">
					{loading ? (
						<li className="loading-spinner">
							<Spin size="small" />
						</li>
					) : (
						suggestions
							.filter(({ name }) => !/\d/.test(name) && !name.includes(" "))
							.map((suggestion) => (
								<li
									key={suggestion._id}
									onClick={() => handleSuggestionClick(suggestion.name)}
								>
									{suggestion.name}
								</li>
							))
					)}
				</ul>
			)}
		</div>
	);
};

export default BusRouteCard;
