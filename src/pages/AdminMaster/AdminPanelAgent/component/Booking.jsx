import React, { useState, useEffect } from "react";
import { Card, Flex, Typography, Avatar, Table, DatePicker } from "antd";
import { Space } from "antd";
const baseUrl = import.meta.env.VITE_BASE_URL;
const { Title } = Typography;
const { RangePicker } = DatePicker;
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
		title: "Booking Name",
		dataIndex: "name",
		key: "name",
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
		render: (_, { Status }) => (
			<Space>
				<span
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border:
							Status === "SUCCESS"
								? "1px solid green"
								: Status === "pending"
								? "1px solid blue"
								: "1px solid red",
						padding: "0.5px",
						borderRadius: "50%",
						width: "11px",
						height: "11px",
					}}
				>
					<span
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							backgroundColor:
								Status === "SUCCESS"
									? "green"
									: Status === "pending"
									? "blue"
									: "red",
						}}
					/>
				</span>
				<Typography>{Status}</Typography>
			</Space>
		),
	},
	{
		title: "Customer Name",
		dataIndex: "cusName",
		key: "cusName",
	},
	{
		title: "Customer Contact Number",
		dataIndex: "cusNumber",
		key: "cusNumber",
	},
	{
		title: "Price",
		dataIndex: "price",
		key: "price",
		render: (text) => `₹ ${text}`,
	},
];

const Booking = () => {
	const [bookings, setBookings] = useState([]);
	const [userDetails, setUserDetails] = useState({});
	const [error, setError] = useState(null);
	const agentCode = localStorage.getItem("agentCode");
	const [totalSales, setTotalSales] = useState(0);
	const [loading, setLoading] = useState(false);
	const [filteredBookings, setFilteredBookings] = useState([]);

	function formatDate(dateString) {
		const date = new Date(dateString);

		// Get day, month, year, hours and minutes
		const day = String(date.getUTCDate()).padStart(2, "0");
		const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
		const year = date.getUTCFullYear();
		let hours = date.getUTCHours();
		const minutes = String(date.getUTCMinutes()).padStart(2, "0");

		// Convert to 12-hour format and determine AM/PM
		const ampm = hours >= 12 ? "pm" : "am";
		hours = hours % 12;
		hours = hours ? String(hours).padStart(2, "0") : "12"; // the hour '0' should be '12'

		// Construct the final formatted string
		return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
	}

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				setLoading(true);
				const response = await fetch(`${baseUrl}/api/busBooking/getBookings`, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				if (data.status === 200) {
					setLoading(false);
					setBookings(data.data);
					setFilteredBookings(data.data);
					// const total = data.data
					// 	.filter(
					// 		(booking) =>
					// 			booking.agentCode === agentCode &&
					// 			booking.totalAmount &&
					// 			booking.bookingStatus === "paid"
					// 	)
					// 	.reduce((acc, booking) => acc + booking.totalAmount, 0);

					// setTotalSales(total);
				} else {
					setLoading(false);
					setError(data.message);
				}
			} catch (error) {
				setLoading(false);
				setError(error.message);
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
			const total = filtered
				.filter(
					(booking) =>
						booking.agentCode === agentCode &&
						booking.totalAmount &&
						booking.bookingStatus === "paid"
				)
				.reduce((acc, booking) => acc + booking.totalAmount, 0);

			setTotalSales(total);
			setFilteredBookings(filtered);
		} else {
			const total = bookings
				.filter(
					(booking) =>
						booking.agentCode === agentCode &&
						booking.totalAmount &&
						booking.bookingStatus === "paid"
				)
				.reduce((acc, booking) => acc + booking.totalAmount, 0);

			setTotalSales(total);
			setFilteredBookings(bookings);
		}
	};

	useEffect(() => {
		const fetchUserDetails = async () => {
			const userIds = bookings
				.filter(
					(booking) =>
						booking.userId !== null && booking.agentCode === agentCode
				)
				.map((booking) => booking.userId);

			if (userIds.length > 0) {
				const userPromises = userIds.map((userId) =>
					fetch(`${baseUrl}/api/user/getUserById`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ userId }),
					}).then((res) => res.json())
				);

				const userResponses = await Promise.all(userPromises);
				const userMap = {};
				userResponses.forEach((user) => {
					if (user.status === 200) {
						userMap[user.data._id] = user.data; // assuming user data has _id as identifier
					}
				});
				setUserDetails(userMap);
			}
		};

		if (bookings.length > 0) {
			fetchUserDetails();
		}
	}, [bookings, agentCode]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!bookings || !Array.isArray(bookings)) {
		return <div>Loading...</div>;
	}

	const data = filteredBookings
		.filter(
			(booking) => booking.userId !== null && booking.agentCode === agentCode
		)
		.map((booking, index) => {
			const user = userDetails[booking.userId];
			return {
				key: booking._id,
				No: index + 1,
				bookingId: booking._id,
				name: `${booking.sourceCity} --- ${
					booking.destinationCity
				} --- ${formatDate(booking.updatedAt)}`,
				Status: booking.bookingStatus,
				cusName: user ? user.fullName : "Loading...",
				cusNumber: user ? user.phoneNumber : "Loading...",
				price: booking.totalAmount,
			};
		});

	return (
		<>
			<Flex gap={20} vertical>
				<Typography>
					<Title level={3}>Bus-Bookings</Title>
				</Typography>
				<Flex gap={10} horizontal>
					<Card
						bordered={false}
						style={{
							width: 250,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Number of Bus Bookings
							</Typography>
							<Typography
								style={{
									fontSize: 25,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 50,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{data.length}
							</Typography>
							{/* <Avatar.Group
								maxCount={3}
								maxStyle={{
									color: "#f56a00",
									backgroundColor: "#fde3cf",
								}}
							>
								<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
								<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
							</Avatar.Group> */}
						</Flex>
					</Card>
					<Card
						bordered={false}
						style={{
							width: 250,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Sales
							</Typography>
							<Typography
								style={{
									fontSize: 25,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 140,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								₹ {!loading && Math.floor(totalSales).toLocaleString("en-IN")}
							</Typography>
						</Flex>
					</Card>
				</Flex>
				<Typography>
					<Title level={3}>List of Bus-Bookings</Title>
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
