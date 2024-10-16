import React, { useState, useEffect } from "react";
import { Card, Flex, Typography, Avatar, Table } from "antd";
import { Space } from "antd";
const baseUrl = import.meta.env.VITE_BASE_URL;
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
		title: "Booking Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Status",
		dataIndex: "Status",
		key: "Status",
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
];

const Booking = () => {
	const [bookings, setBookings] = useState([]);
	const [userDetails, setUserDetails] = useState({});
	const [error, setError] = useState(null);
	const agentCode = localStorage.getItem("agentCode");
	const [totalSales, setTotalSales] = useState(0);

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
				const response = await fetch(`${baseUrl}/api/busBooking/getBookings`, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				if (data.status === 200) {
					setBookings(data.data);
					const total = data.data
						.filter(
							(booking) =>
								booking.agentCode === agentCode &&
								booking.totalAmount &&
								booking.bookingStatus === "paid"
						)
						.reduce((acc, booking) => acc + booking.totalAmount, 0);

					setTotalSales(total);
				} else {
					setError(data.message);
				}
			} catch (error) {
				setError(error.message);
			}
		};
		fetchBookings();
	}, []);

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

	const data = bookings
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
			};
		});

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Bus-Bookings</Title>
				</Typography>
				<Flex gap={10} horizontal>
					<Card
						bordered={false}
						style={{
							width: 300,
						}}
					>
						<Flex gap={10} vertical>
							<Typography>Number of Bus Bookings</Typography>
							<Typography>{data.length}</Typography>
							<Avatar.Group
								maxCount={3}
								maxStyle={{
									color: "#f56a00",
									backgroundColor: "#fde3cf",
								}}
							>
								<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
								<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
							</Avatar.Group>
						</Flex>
					</Card>
					<Card
						bordered={false}
						style={{
							width: 300,
						}}
					>
						<Flex gap={10} vertical>
							<Typography>Total Sales</Typography>
							<Typography>₹{totalSales.toFixed(2)}</Typography>
						</Flex>
					</Card>
				</Flex>
				<Typography>
					<Title level={3}>List of Bus-Bookings</Title>
				</Typography>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default Booking;
