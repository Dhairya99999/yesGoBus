import React, { useState, useEffect } from "react";
import { Flex, Typography, Card, Table, Space, Spin, Button } from "antd";
const { Title } = Typography;
const baseUrl = import.meta.env.VITE_BASE_URL;

const Revenue = () => {
	const agentCode = localStorage.getItem("agentCode");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const [PackageBookings, setPackageBookings] = useState([]);
	const [totalBookingsSales, setTotalBookingsSales] = useState(0);
	const [totalPackageBookingsSales, setTotalPackageBookingsSales] = useState(0);
	const [bookingUserDetails, setBookingUserDetails] = useState({});
	const [packageBookingUserDetails, setPackageBookingUserDetails] = useState(
		{}
	);
	const [switchData, setSwitchData] = useState(false);

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

	// Fetch Bookings
	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/api/busBooking/getBookings`, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				if (data.status === 200) {
					setLoading(false);
					setBookings(data.data);
					const total = data.data
						.filter(
							(booking) =>
								booking.agentCode === agentCode &&
								booking.totalAmount &&
								booking.bookingStatus === "paid"
						)
						.reduce((acc, booking) => acc + booking.totalAmount, 0);

					setTotalBookingsSales(total);
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

	useEffect(() => {
		const fetchUserDetails = async () => {
			setLoading(true);
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
				setBookingUserDetails(userMap);
				setLoading(false);
			}
		};

		if (bookings.length > 0) {
			fetchUserDetails();
		}
	}, [bookings, agentCode]);

	// Fetch Package Bookings
	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/bookingHistory/getAllBookings`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				setLoading(false);
				setPackageBookings(data.data);

				const total = data.data
					.filter(
						(booking) =>
							booking.agentCode === agentCode &&
							booking.totalPackagePrice &&
							(booking.paymentStatus === "SUCCESS" ||
								booking.paymentStatus === "PAYMENT_SUCCESS")
					)
					.reduce((acc, booking) => acc + booking.totalPackagePrice, 0);

				setTotalPackageBookingsSales(total);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchBookings();
	}, []);

	useEffect(() => {
		const fetchUserDetails = async () => {
			const userIds = PackageBookings.filter(
				(booking) => booking.userId !== null && booking.agentCode === agentCode
			).map((booking) => booking.userId);

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
				setPackageBookingUserDetails(userMap);
			}
		};

		if (PackageBookings.length > 0) {
			fetchUserDetails();
		}
	}, [PackageBookings, agentCode]);

	if (error) {
		return <div>Error: {error}</div>;
	}
	if (loading) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		); // Render a loading indicator when loading is true
	}
	if (!bookings || !Array.isArray(bookings)) {
		return <div>Loading...</div>;
	}

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
	const bookingData = bookings
		.filter(
			(booking) => booking.userId !== null && booking.agentCode === agentCode
		)
		.map((booking, index) => {
			const user = bookingUserDetails[booking.userId];
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

	const packageBookingData = PackageBookings.filter(
		(booking) => booking.userId !== null && booking.agentCode === agentCode
	).map((booking, index) => {
		const user = packageBookingUserDetails[booking.userId];
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
			<Flex vertical gap={10}>
				<Typography.Title level={3}>Revenue</Typography.Title>
				<Flex gap={10} horizontal>
					<Card
						bordered={false}
						style={{
							width: 200,
						}}
					>
						<Flex gap={10} vertical>
							<Typography>Bus Booking</Typography>
							<Typography>
								₹ {totalBookingsSales.toLocaleString("en-IN")}
							</Typography>
						</Flex>
					</Card>
					<Card
						bordered={false}
						style={{
							width: 200,
						}}
					>
						<Flex gap={10} vertical>
							<Typography>Package Booking</Typography>
							<Typography>
								₹ {totalPackageBookingsSales.toLocaleString("en-IN")}
							</Typography>
						</Flex>
					</Card>
				</Flex>
				<Typography>
					<Title level={4}>
						List of {switchData ? "Bus" : "Package"} Bookings
					</Title>
				</Typography>
				<Button
					type="primary"
					style={{ width: "200px" }}
					onClick={() => setSwitchData(!switchData)}
				>
					{switchData ? "Bus Bookings" : "Package Bookings"}
				</Button>
				<Table
					columns={columns}
					expandable={{
						expandedRowRender: (record) => (
							<p
								style={{
									margin: 0,
								}}
							>
								{record.name}
							</p>
						),
						rowExpandable: (record) => record.name !== "Not Expandable",
					}}
					dataSource={switchData ? bookingData : packageBookingData}
				/>
			</Flex>
		</>
	);
};

export default Revenue;
