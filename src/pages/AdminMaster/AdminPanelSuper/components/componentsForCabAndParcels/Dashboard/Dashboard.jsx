import React, { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_CAB_BOOKING_URL;
import { Card, Flex, Typography, Spin } from "antd";
const { Title } = Typography;

const Dashboard = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [parcelBookings, setParcelBookings] = useState([]);
	const [rideBookings, setRideBookings] = useState([]);

	useEffect(() => {
		const fetchAllUsers = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/user/all/users`);
				const data = await response.json();
				setUsers(data.data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		const fetchAllRideBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/cab/ride-history`);
				const data = await response.json();
				setRideBookings(data.data || []);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		const fetchAllParcelBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/cab/transport-history`);
				const data = await response.json();
				setParcelBookings(data.data || []);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAllUsers();
		fetchAllRideBookings();
		fetchAllParcelBookings();
	}, []);

	if (loading || !users || !rideBookings || !parcelBookings) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const getTotalRevenue = () => {
		const rideRevenue = rideBookings
			.filter(booking => booking.status === "Completed")
			.reduce((sum, booking) => {
				const amount = parseFloat(booking.amountPaid.replace(/[₹, ]/g, ''));
				return sum + (isNaN(amount) ? 0 : amount);
			}, 0);

		const parcelRevenue = parcelBookings
			.filter(booking => booking.status === "Completed")
			.reduce((sum, booking) => {
				const amount = parseFloat(booking.amountPaid.replace(/[₹, ]/g, ''));
				return sum + (isNaN(amount) ? 0 : amount);
			}, 0);

		return rideRevenue + parcelRevenue;
	};

	return (
		<>
			<Flex gap={10} vertical>
				<Title level={3}>Dashboard</Title>
				<Flex gap={20}>
					<Card bordered={false} style={{ width: 150, boxShadow: "0 2px 10px #fff3e6" }}>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>Total Number of Users</Typography>
							<Typography style={{
								fontSize: 25,
								backgroundColor: "#fff3e6",
								padding: 10,
								borderRadius: "10px",
								width: 70,
								height: 50,
								textAlign: "center",
								lineHeight: "30px",
							}}>
								{users || 0}
							</Typography>
						</Flex>
					</Card>
					<Card bordered={false} style={{ width: 150, boxShadow: "0 2px 10px #fff3e6" }}>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>Total Ride Bookings</Typography>
							<Typography style={{
								fontSize: 25,
								backgroundColor: "#fff3e6",
								padding: 10,
								borderRadius: "10px",
								width: 70,
								height: 50,
								textAlign: "center",
								lineHeight: "30px",
							}}>
								{rideBookings.length || 0}
							</Typography>
						</Flex>
					</Card>
					<Card bordered={false} style={{ width: 150, boxShadow: "0 2px 10px #fff3e6" }}>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>Total Parcel Bookings</Typography>
							<Typography style={{
								fontSize: 25,
								backgroundColor: "#fff3e6",
								padding: 10,
								borderRadius: "10px",
								width: 70,
								height: 50,
								textAlign: "center",
								lineHeight: "30px",
							}}>
								{parcelBookings.length || 0}
							</Typography>
						</Flex>
					</Card>
					<Card bordered={false} style={{ width: 300, boxShadow: "0 2px 10px #fff3e6" }}>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>Total Revenue</Typography>
							<Typography style={{
								fontSize: 25,
								backgroundColor: "#fff3e6",
								padding: 10,
								borderRadius: "10px",
								width: 150,
								height: 50,
								textAlign: "center",
								lineHeight: "30px",
							}}>
								₹ {getTotalRevenue()}
							</Typography>
						</Flex>
					</Card>
				</Flex>
			</Flex>
		</>
	);
};

export default Dashboard;
