import { useState, useEffect } from "react";
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
} from "antd";
const { Title } = Typography;
const columns = [
	{
		title: "Sr.No.",
		dataIndex: "No",
		key: "No",
	},
	{
		title: "Agent Code",
		dataIndex: "agentCode",
		key: "agentCode",
	},
	{
		title: "Agent Id",
		dataIndex: "agentId",
		key: "agentId",
	},
	// {
	// 	title: "Status",
	// 	dataIndex: "Status",
	// 	key: "Status",
	// 	render: (_, { Status }) => (
	// 		<Space>
	// 			<span
	// 				style={{
	// 					display: "flex",
	// 					alignItems: "center",
	// 					justifyContent: "center",
	// 					border:
	// 						Status === "SUCCESS"
	// 							? "1px solid green"
	// 							: Status === "pending"
	// 							? "1px solid blue"
	// 							: "1px solid red",
	// 					padding: "0.5px",
	// 					borderRadius: "50%",
	// 					width: "11px",
	// 					height: "11px",
	// 					boxSizing: "none",
	// 				}}
	// 			>
	// 				<span
	// 					style={{
	// 						display: "flex",
	// 						alignItems: "center",
	// 						justifyContent: "center",
	// 						width: "8px",
	// 						height: "8px",
	// 						borderRadius: "50%",

	// 						backgroundColor:
	// 							Status === "SUCCESS"
	// 								? "green"
	// 								: Status === "pending"
	// 								? "blue"
	// 								: "red",
	// 					}}
	// 				/>
	// 			</span>
	// 			<Typography>{Status}</Typography>
	// 		</Space>
	// 	),
	// },
	// {
	// 	title: "Payment",
	// 	dataIndex: "Payment",
	// 	key: "Payment",
	// },
	{
		title: "Agent Name",
		dataIndex: "agentName",
		key: "agentName",
	},
	{
		title: "Package Name",
		dataIndex: "packageName",
		key: "packageName",
	},
	{
		title: "Destination",
		dataIndex: "destination",
		key: "destination",
	},
	{
		title: "Revenue Earned",
		dataIndex: "totalPackagePrice",
		key: "totalPackagePrice",
	},
	// {
	// 	dataIndex: "action",
	// 	key: "action",
	// 	render: (text, record) => (
	// 		<Button
	// 			type="primary"
	// 			// onClick={() => handleDestinationClick(record.plan)}
	// 		>
	// 			Details
	// 		</Button>
	// 	),
	// },
];
const Revenue = () => {
	const [revenueData, setRevenueData] = useState([]);
	const [revenue, setRevenue] = useState(0);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
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
				console.log("data", data.data);
				if (data.status === 200) {
					setLoading(false);
					setRevenue(data.data.totalRevenue);
					setRevenueData(data.data.revenueData);
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

	// if (!bookings || !Array.isArray(bookings)) {
	// 	return <div>Loading...</div>;
	// }
	// console.log("revenueData", revenueData);
	const data = revenueData.map((item, index) => {
		return {
			No: index + 1,
			agentCode: item.agentCode,
			agentId: item.agentId,
			agentName: item.agentName,
			packageName: item.packageName,
			destination: item.destination,
			totalPackagePrice: item.totalPackagePrice,
			userId: item.userId,
			bookingId: item.bookingId,
			agentEmail: item.agentEmail,
			agentStatus: item.agentStatus,
			userName: item.userName,
			userEmail: item.userEmail,
			userPhone: item.userPhoneNumber,
			totalRoom: item.totalRoom,
			totalGuests: item.totalGuests,
			totalDuration: item.totalDuration,
			maxTicket: item.maxTicket,
			fromPlace: item.fromPlace,
			toPlace: item.toPlace,
			items: item,
			action: "",
		};
	});

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Revenue</Title>
				</Typography>
				<Card
					bordered={false}
					style={{
						width: 150,
					}}
				>
					<Flex gap={10} vertical align="center" justify="center">
						<Typography>Total Revenue</Typography>
						<Typography
							style={{
								backgroundColor: "#FF620E",
								color: "white",
								padding: "10px",
								borderRadius: "10px",
								fontWeight: "bold",
							}}
						>
							{!loading && revenue}
						</Typography>
					</Flex>
				</Card>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default Revenue;
