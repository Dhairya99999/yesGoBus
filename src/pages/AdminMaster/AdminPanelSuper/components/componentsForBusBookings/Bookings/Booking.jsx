// import React from 'react'
import { useState, useEffect } from "react";
// import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import {
	Card,
	Flex,
	Typography,
	Avatar,
	Space,
	Table,
	Button,
	Spin,
	Modal,
	DatePicker,
} from "antd";
const { RangePicker } = DatePicker;
// import { UserOutlined } from "@ant-design/icons";
const { Title } = Typography;
const columns = [
	{
		title: "No.",
		dataIndex: "No",
		key: "No",
	},
	{
		title: "Booking Id",
		dataIndex: "bookingId",
		key: "bookingId",
	},
	{
		title: "Bus Type",
		dataIndex: "busOperator",
		key: "busOperator",
	},
	{
		title: "Customer Name",
		dataIndex: "customerName",
		key: "customerName",
	},
	{
		title: "Customer Email",
		dataIndex: "customerEmail",
		key: "customerEmail",
	},
	{
		title: "Customer Phone",
		dataIndex: "customerPhone",
		key: "customerPhone",
	},
	{
		title: "Status",
		dataIndex: "Status",
		key: "Status",
		filters: [
			{
				text: "Paid",
				value: "paid",
			},
			{
				text: "Pending",
				value: "pending",
			},
			{
				text: "Failed",
				value: "failed",
			},
			{
				text: "Cancelled",
				value: "cancelled",
			},
		],
		onFilter: (value, record) => record.Status.startsWith(value),
		filterSearch: true,
		width: 130,
	},
	{
		title: "Payment Received",
		dataIndex: "Payment",
		key: "Payment",
		render: (text) => `₹ ${text}`,
	},
	{
		title: "Seats Selected",
		dataIndex: "selectedSeats",
		key: "selectedSeats",
	},
	{
		title: "Destination",
		dataIndex: "destinationCity",
		key: "destinationCity",
	},
];
// const columns = [
// 	{
// 		title: "No.",
// 		dataIndex: "No",
// 		key: "No",
// 	},
// 	{
// 		title: "Booking Id",
// 		dataIndex: "bookingId",
// 		key: "bookingId",
// 	},
// 	{
// 		title: "Name",
// 		dataIndex: "name",
// 		key: "name",
// 	},
// 	{
// 		title: "Status",
// 		dataIndex: "Status",
// 		key: "Status",
// 		render: (_, { Status }) => (
// 			<Space>
// 				<span
// 					style={{
// 						display: "flex",
// 						alignItems: "center",
// 						justifyContent: "center",
// 						border:
// 							Status === "SUCCESS"
// 								? "1px solid green"
// 								: Status === "pending"
// 								? "1px solid blue"
// 								: "1px solid red",
// 						padding: "0.5px",
// 						borderRadius: "50%",
// 						width: "11px",
// 						height: "11px",
// 						boxSizing: "none",
// 					}}
// 				>
// 					<span
// 						style={{
// 							display: "flex",
// 							alignItems: "center",
// 							justifyContent: "center",
// 							width: "8px",
// 							height: "8px",
// 							borderRadius: "50%",

// 							backgroundColor:
// 								Status === "SUCCESS"
// 									? "green"
// 									: Status === "pending"
// 									? "blue"
// 									: "red",
// 						}}
// 					/>
// 				</span>
// 				<Typography>{Status}</Typography>
// 			</Space>
// 		),
// 	},
// 	{
// 		title: "Payment",
// 		dataIndex: "Payment",
// 		key: "Payment",
// 	},
// 	{
// 		title: "Destination",
// 		dataIndex: "Destination",
// 		key: "Destination",
// 	},
// 	{
// 		dataIndex: "action",
// 		key: "action",
// 		render: (_, { action }) => (
// 			<Button type="primary" variant="solid">
// 				{action.toUpperCase()}
// 			</Button>
// 		),
// 	},
// ];

const Booking = () => {
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [filteredBookings, setFilteredBookings] = useState([]);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/busBooking/getAllBookings`,
					{
						headers: {
							Authorization: `Bearer ${user}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				if (data.status === true) {
					setLoading(false);

					// const userIds = [
					// 	...new Set(
					// 		data.data.bookings
					// 			.filter((booking) => booking.userId !== null)
					// 			.map((booking) => booking.userId)
					// 	),
					// ];

					// const userBookings = userIds.map((userId) => {
					// 	const userBookingsArray = data.data.bookings.filter(
					// 		(booking) =>
					// 			booking.userId !== null && booking.userId === userId
					// 	);
					// 	const userEmail = data.data.bookings.find(
					// 		(booking) =>
					// 			booking.userId !== null && booking.userId === userId
					// 	).customerEmail;
					// 	const userFirstName = data.data.bookings.find(
					// 		(booking) =>
					// 			booking.userId !== null && booking.userId === userId
					// 	).customerName;
					// 	const userLastName = data.data.bookings.find(
					// 		(booking) =>
					// 			booking.userId !== null && booking.userId === userId
					// 	).customerLastName;
					// 	const userPhoneNumber = data.data.bookings.find(
					// 		(booking) =>
					// 			booking.userId !== null && booking.userId === userId
					// 	).customerPhone;
					// 	const bookingId = data.data.bookings.find(
					// 		(booking) =>
					// 			booking.userId !== null && booking.userId === userId
					// 	)._id;
					// 	return {
					// 		bookingId,
					// 		userId,
					// 		userEmail,
					// 		userFullName : userFirstName + " " + userLastName,
					// 		userPhoneNumber,
					// 		bookings: userBookingsArray,
					// 	};
					// });

					setBookings(data.data.bookings);
					setFilteredBookings(data.data.bookings);
				} else {
					setError(data.message);
					setLoading(false);
				}
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchBookings();
	}, []);

	const handleDateChange = (dates) => {
		// setDateRange(dates);
		if (dates && dates[0] && dates[1]) {
			const startDate = new Date(dates[0].startOf("day").toISOString());
			const endDate = new Date(dates[1].endOf("day").toISOString());
			endDate.setHours(23, 59, 59, 999);

			const filtered = bookings.filter((booking) => {
				const createdAt = new Date(booking.createdAt);
				return createdAt >= startDate && createdAt <= endDate;
			});

			setFilteredBookings(filtered);
		} else {
			setFilteredBookings(bookings);
		}
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	// if (loading) {
	// 	return (
	// 		<Flex justify="center" align="center" style={{ height: "100vh" }}>
	// 			<Spin size="large" />
	// 		</Flex>
	// 	); // Render a loading indicator when loading is true
	// }

	if (!bookings || !Array.isArray(bookings)) {
		return <div>Loading...</div>;
	}

	console.log("bookings", bookings);
	const data = filteredBookings.map((booking, index) => {
		return {
			No: index + 1,
			bookingId: booking._id,
			busOperator: booking.busOperator,
			busType: booking.busType,
			customerEmail: booking.customerEmail,
			customerName: booking.customerName + " " + booking.customerLastName,
			customerPhone: booking.customerPhone,
			Status: booking.bookingStatus,
			Payment: booking.totalAmount,
			SourceCity: booking.sourceCity,
			destinationCity: booking.destinationCity,
			agentCode: booking.agentCode,
			boardingPoint: booking.boardingPoint,
			droppingPoint: booking.droppingPoint,
			doj: booking.doj,
			merchantTransactionId: booking.merchantTransactionId,
			pickUpTime: booking.pickUpTime,
			reachTime: booking.reachTime,
			selectedSeats: booking.selectedSeats,
			userId: booking.userId,
			action: "",
		};
	});
	// console.log("bookings data", data);

	// const filterByDateRange = (startDate, endDate) => {
	// 	const filtered = bookings.filter((item) => {
	// 		const itemDate = new Date(item.doj);
	// 		return itemDate >= startDate && itemDate <= endDate;
	// 	});
	// 	setFilteredData(filtered);
	// };

	// const filterLastMonth = () => {
	// 	const endDate = new Date();
	// 	const startDate = new Date();
	// 	startDate.setMonth(startDate.getMonth() - 1);
	// 	filterByDateRange(startDate, endDate);
	// };

	// const filterLastThreeMonths = () => {
	// 	const endDate = new Date();
	// 	const startDate = new Date();
	// 	startDate.setMonth(startDate.getMonth() - 3);
	// 	filterByDateRange(startDate, endDate);
	// };

	// const filterLastSixMonths = () => {
	// 	const endDate = new Date();
	// 	const startDate = new Date();
	// 	startDate.setMonth(startDate.getMonth() - 6);
	// 	filterByDateRange(startDate, endDate);
	// };

	// const filterCustomDate = (start, end) => {
	// 	filterByDateRange(new Date(start), new Date(end));
	// };

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Bookings</Title>
				</Typography>
				<Card
					// title="No of Users"
					bordered={false}
					style={{
						width: 190,
						boxShadow: "0 2px 10px #fff3e6",
					}}
				>
					<Flex gap={10} vertical align="center" justify="center">
						<Typography style={{ fontWeight: "bold" }}>
							Number of Bookings
						</Typography>
						<Typography
							style={{
								fontSize: 25,
								backgroundColor: "#fff3e6",
								padding: 10,
								borderRadius: "10px",
								width: 100,
								height: 50,
								textAlign: "center",
								lineHeight: "30px",
							}}
						>
							{filteredBookings.length}
						</Typography>
						{/* <Avatar.Group
							maxCount={3}
							maxStyle={{
								color: "#f56a00",
								backgroundColor: "#fde3cf",
							}}
						>
							{bookings.map((booking) => (
								<Avatar
									key={booking._id}
									src="https://lh3.googleusercontent.com/proxy/xr1GXMGF5o6oKuDqHFK5Fb6fwQbaG-8XKkHC59OC8Epx1LkEgctv0jGrSf22Eir6Hngf4bN7RSV_odfUKqT74ZRvcf_r6qtvlbfkyKjMkkFbaFRWeMuLbh-X"
								/>
							))}
						</Avatar.Group> */}
					</Flex>
				</Card>
				<Typography>
					<Title level={3}>Bookings</Title>
				</Typography>
				<Flex style={{ marginBottom: 16, marginTop: 10 }}>
					<RangePicker
						style={{ width: "45%" }}
						onChange={handleDateChange}
						format="YYYY-MM-DD"
					/>
				</Flex>
				<Table columns={columns} dataSource={data} loading={loading} />
			</Flex>
		</>
	);
};

export default Booking;
