import React, { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import { Card, Flex, Typography, Spin } from "antd";
const { Title } = Typography;
const Dashboard = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const [users, setUsers] = useState([]);
	const [packages, setPackages] = useState([]);
	const [agents, setAgents] = useState([]);
	const [revenue, setRevenue] = useState(0);

	useEffect(() => {
		const fetchAllPackages = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/packages/getAllPackages`,
					{
						headers: {
							Authorization: `Bearer ${user}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				// console.log("data", data.data);
				setLoading(false);
				setPackages(data.data.packages);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchAllPackages();
		const fetchAllData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/bookings/getAllBookings`,
					{
						headers: {
							Authorization: `Bearer ${user}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				// console.log("data", data.data);
				setLoading(false);
				setBookings(data.data.bookings);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchAllData();

		const fetchAllUsers = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/api/admin/user/getAllUsers`, {
					headers: {
						Authorization: `Bearer ${user}`, // Assuming token is the correct variable
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				// console.log("data", data.data);
				setLoading(false);
				setUsers(data.data);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchAllUsers();

		const fetchAllAgents = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/agents/getAllAgents`,
					{
						headers: {
							Authorization: `Bearer ${user}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				// console.log("data", data.data);
				setLoading(false);
				setAgents(data.data);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchAllAgents();
	}, []);
	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/revenue/getRevenueForBus`,
					{
						headers: {
							Authorization: `Bearer ${user}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				// console.log("data", data.data);
				if (data.status === 200) {
					setLoading(false);
					setRevenue(data.data.totalRevenue);
					// setRevenueData(data.data.revenueData);
					// setFilteredData(data.data.revenueData);
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

	// console.log("users", users);
	// console.log("bookings", bookings);
	// console.log("packages", packages);

	if (loading || !users || !bookings || !packages) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		); // Render a loading indicator when loading is true or data is not received
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<Flex gap={10} vertical>
				<Title level={3}>Dashboard</Title>

				<Flex gap={20}>
					<Card
						bordered={false}
						style={{
							width: 150,
							height: 140,
							boxShadow: "0 2px 10px #fff3e6",
							// backgroundColor: "#fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Users
							</Typography>
							<Typography
								style={{
									fontSize: 25,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 70,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{users.length || 50}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 150,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Bookings
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
								{bookings.length || 50}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 150,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Packages
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
								{!loading && packages.length ? packages.length : 0}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 150,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Agents
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
								{!loading && agents.length ? agents.length : 0}
							</Typography>
						</Flex>
					</Card>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 200,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Revenue
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
								₹ {!loading && Math.floor(revenue).toLocaleString("en-IN")}
							</Typography>
						</Flex>
					</Card>
				</Flex>
			</Flex>
		</>
	);
};

export default Dashboard;
