import React, { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import {
	Card,
	Flex,
	Typography,
	Spin,
} from "antd";
const { Title } = Typography;

const Dashboard = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const [users, setUsers] = useState([]);
	const [packages, setPackages] = useState([]);
	const [revenue, setRevenue] = useState();
	const [totalAgents, setTotalAgents] = useState();

	useEffect(() => {
		const fetchAllPackages = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/packages/getAllPackages`,
					{
						headers: {
							Authorization: `Bearer ${user}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
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
							Authorization: `Bearer ${user}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
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
						Authorization: `Bearer ${user}`,
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				setLoading(false);
				setUsers(data.data);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchAllUsers();
	}, []);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/revenue/getRevenue`,
					{
						headers: {
							Authorization: `Bearer ${user}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				if (data.status === 200) {
					setLoading(false);
					setRevenue(data.data.totalRevenue);
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
		const fetchAgents = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/api/agent/getAllAgents`);
				const data = await response.json();
				if (data.status === 200) {
					setLoading(false);
					setTotalAgents(data.data);
				} else {
					setError(data.message);
					setLoading(false);
				}
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchAgents();
	}, []);

	if (loading || !users || !bookings || !packages) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<Flex gap={10} vertical>
				<Title level={3}>Dashboard</Title>

				<Flex gap={20}>
					{[
						{ title: "Total Users", count: users.length || 0 },
						{ title: "Package Bookings", count: bookings.length || 0 },
						{ title: "Packages", count: packages.length || 0 },
						{ title: "Total Revenue", count: revenue || 0 },
						{ title: "Total Agents", count: totalAgents || 0 },
					].map(({ title, count }, index) => (
						<Card
							key={index}
							bordered={false}
							style={{
								width: "150px", // Fixed width
								height: "150px", // Fixed height
								boxShadow: "0 2px 10px #fff3e6",
								display: "flex", // Flex display to center content
								flexDirection: "column", // Vertical alignment
								justifyContent: "center", // Center vertically
								alignItems: "center", // Center horizontally
								textAlign: "center", // Center text
							}}
						>
							<Typography style={{ fontWeight: "bold" }}>{title}</Typography>
							<Typography
								style={{
									fontSize: "1.5rem",
									backgroundColor: "#fff3e6",
									padding: "10px",
									borderRadius: "10px",
									lineHeight: "1.5",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{count}
							</Typography>
						</Card>
					))}
				</Flex>
			</Flex>
		</>
	);
};

export default Dashboard;
