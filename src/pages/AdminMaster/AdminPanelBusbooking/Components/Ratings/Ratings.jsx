import React, { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

import { Flex, Spin, Table } from "antd";
// const { Title } = Typography;

const Ratings = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [packageData, setPackageData] = useState([]);

	useEffect(() => {
		const fetchAllPackages = async () => {
			setLoading(true);
			try {
				const itineryPlansResponse = await fetch(
					`${baseUrl}/api/admin/bookings/getAllBookings`,
					{
						headers: {
							Authorization: `Bearer ${token}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const itineryPlans = await itineryPlansResponse.json();
				setPackageData(itineryPlans.data.bookings);
				setLoading(false);
			} catch (error) {
				console.error(error);
				setError(error.message || "An unknown error occurred");
				setLoading(false);
			}
		};
		fetchAllPackages();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (loading) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		);
	}

	if (!loading && packageData.length === 0) {
		return <div>No data available</div>;
	}

	const columns = [
		{
			title: "Sr.No.",
			dataIndex: "key",
		},
		{
			title: "Rating",
			dataIndex: "rating",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.rating - b.rating,
		},
		{
			title: "Package Name",
			dataIndex: "packageName",
		},
		{
			title: "Destination",
			dataIndex: "destination",
		},
		{
			title: "User Name",
			dataIndex: "user",
		},
	];

	// console.log("packageData", packageData);
	const data =
		packageData &&
		packageData.map((plan, index) => ({
			key: index + 1,
			packageName: plan.packageId?.name || "N/A",
			destination: plan.packageId?.destination || "N/A",
			rating: plan.packageId?.destinationID?.rating || 0,
			user: plan.user,
		}));

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	return (
		<>
			<Flex vertical gap={40} className="ratings-container">
				<h2>Customer Ratings</h2>

				{!loading && (
					<Table
						columns={columns}
						dataSource={data}
						onChange={onChange}
						showSorterTooltip={{
							target: "sorter-icon",
						}}
					/>
				)}
			</Flex>
		</>
	);
};

export default Ratings;

// import React, { useEffect, useState } from "react";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// const token = localStorage.getItem("token");
// // import "./ratings.scss";
// import {
// 	Flex,
// 	Typography,
// 	Card,
// 	Spin,
// 	Modal,
// 	Select,
// 	Table,
// 	Button,
// } from "antd";
// const { Title } = Typography;

// const Ratings = () => {
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState(null);
// 	const [packageData, setPackageData] = useState([]);

// 	useEffect(() => {
// 		const fetchAllPackages = async () => {
// 			setLoading(true);
// 			try {
// 				const itineryPlansResponse = await fetch(
// 					// `${baseUrl}/api/admin/itineraryPlans/getAllItineraryPlans`,
// 					`${baseUrl}/api/admin/bookings/getAllBookings`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${token}`, // Assuming token is the correct variable
// 							"Content-Type": "application/json",
// 						},
// 					}
// 				);
// 				const itineryPlans = await itineryPlansResponse.json();
// 				// const feedBackResponse = await fetch(
// 				// 	`${baseUrl}/api/feedback/get_feedback`,
// 				// 	{
// 				// 		headers: {
// 				// 			Authorization: `Bearer ${token}`, // Assuming token is the correct variable
// 				// 			"Content-Type": "application/json",
// 				// 		},
// 				// 	}
// 				// );
// 				// const feedBack = await feedBackResponse.json();
// 				// const mergedData = itineryPlans.data.plans.map((plan) => {
// 				// 	const feedback = feedBack.data.feedback.find(
// 				// 		(feedback) => feedback.itineraryPlanId === plan._id
// 				// 	);
// 				// 	return {
// 				// 		...plan,
// 				// 		key: plan._id,
// 				// 		rating: feedback ? feedback.rating : 0,
// 				// 	};
// 				// });

// 				// console.log("mergedData", mergedData);
// 				// setPackageData(mergedData);
// 				// console.log("itineryPlans", itineryPlans.data.bookings);
// 				setPackageData(itineryPlans.data.bookings);
// 				setLoading(false);
// 			} catch (error) {
// 				setError(error.message);
// 				setLoading(false);
// 			}
// 		};
// 		fetchAllPackages();
// 	}, []);

// 	if (error) {
// 		return <div>Error: {error}</div>;
// 	}

// 	if (loading) {
// 		return (
// 			<Flex justify="center" align="center" style={{ height: "100vh" }}>
// 				<Spin size="large" />
// 			</Flex>
// 		); // Render a loading indicator when loading is true
// 	}

// 	const columns = [
// 		{
// 			title: "Sr.No.",
// 			dataIndex: "key",
// 		},
// 		{
// 			title: "Rating",
// 			dataIndex: "rating",
// 			defaultSortOrder: "descend",
// 			sorter: (a, b) => a.rating - b.rating,
// 		},
// 		{
// 			title: "Package Name",
// 			dataIndex: "packageName",
// 		},
// 		{
// 			title: "Destination",
// 			dataIndex: "destination",
// 			// filters: [
// 			// 	{
// 			// 		text: "London",
// 			// 		value: "London",
// 			// 	},
// 			// 	{
// 			// 		text: "New York",
// 			// 		value: "New York",
// 			// 	},
// 			// ],
// 			// onFilter: (value, record) => record.address.indexOf(value) === 0,
// 		},
// 		{
// 			title: "User Name",
// 			dataIndex: "user",
// 		},
// 		// {
// 		// 	title: "User Id",
// 		// 	dataIndex: "userId",
// 		// },
// 	];

// 	console.log("packageData", packageData);
// 	// const data =
// 	// 	packageData &&
// 	// 	packageData.map((plan, index) => ({
// 	// 		key: index + 1,
// 	// 		packageName: plan.packageId.name,
// 	// 		destination: plan.destination,
// 	// 		rating: plan.packageId.destinationID.rating,
// 	// 	}));
// 	const onChange = (pagination, filters, sorter, extra) => {
// 		console.log("params", pagination, filters, sorter, extra);
// 	};

// 	return (
// 		<>
// 			<Flex vertical gap={40} className="ratings-container">
// 				<h2>Customer Ratings</h2>

// 				{!loading && (
// 					<Table
// 						columns={columns}
// 						// dataSource={data}
// 						onChange={onChange}
// 						showSorterTooltip={{
// 							target: "sorter-icon",
// 						}}
// 						// style={{ height: "90vh" }}
// 					/>
// 				)}
// 			</Flex>
// 		</>
// 	);
// };

// export default Ratings;
