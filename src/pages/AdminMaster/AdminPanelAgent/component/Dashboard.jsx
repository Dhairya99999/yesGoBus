import React, { useState, useEffect } from "react";
import { Flex, Typography, Card, Spin } from "antd";
const { Title } = Typography;
const baseUrl = import.meta.env.VITE_BASE_URL;
const Dashboard = () => {
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

	console.log("bookings", bookings.length);
	// console.log("bookingUserDetails", bookingUserDetails);
	// console.log("packageBookingUserDetails", packageBookingUserDetails);
	console.log("PackageBookings", PackageBookings.length);
	console.log("totalBookingsSales", totalBookingsSales);
	console.log("totalPackageBookingsSales", totalPackageBookingsSales);

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
	if (
		loading ||
		!bookings ||
		!PackageBookings ||
		!bookingUserDetails ||
		!packageBookingUserDetails
	) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		); // Render a loading indicator when loading is true
	}

	return (
		<>
			<Flex gap={10} vertical>
				<Title level={3}>Dashboard</Title>

				<Flex gap={20}>
					<Card
						bordered={false}
						style={{
							width: 180,
							height: 140,
							boxShadow: "0 2px 10px #fff3e6",
							// backgroundColor: "#fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Bus Bookings
							</Typography>
							<Typography
								style={{
									fontSize: 18,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 100,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{bookings.length || 50}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 180,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Package Booked
							</Typography>
							<Typography
								style={{
									fontSize: 18,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 100,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{PackageBookings.length || 50}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 180,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Bus Booking Sales
							</Typography>
							<Typography
								style={{
									fontSize: 18,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 100,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{totalBookingsSales.toLocaleString("en-IN") || 50}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 180,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Package Sales
							</Typography>
							<Typography
								style={{
									fontSize: 18,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 100,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{totalPackageBookingsSales.toLocaleString("en-IN") || 50}
							</Typography>
						</Flex>
					</Card>
				</Flex>
			</Flex>
		</>
	);
};

export default Dashboard;
