// import React from "react";
import { busloading } from "../../assets/busbooking";
import "./customloader.scss";

const CustomLoader = () => {
	return (
		<div className="custom-loader">
			<img src={busloading} alt="loading..." />
			<p>Loading...</p>
		</div>
	);
};

export default CustomLoader;
