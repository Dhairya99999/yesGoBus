import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import {
	Card,
	Flex,
	Typography,
	Table,
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
		title: "Selected Seats",
		dataIndex: "selectedSeats",
		key: "selectedSeats",
	},
	{
		title: "Bus Operator",
		dataIndex: "busOperator",
		key: "busOperator",
	},
	{
		title: "Transaction Id",
		dataIndex: "merchantTransactionId",
		key: "merchantTransactionId",
	},
	{
		title: "Revenue Earned",
		dataIndex: "totalAmount",
		key: "totalAmount",
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
					`${baseUrl}/api/admin/revenue/getRevenueForBus`,
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
			totalAmount: item.totalAmount,
			merchantTransactionId: item.merchantTransactionId,
			busOperator: item.busOperator,
			customerName: item.customerName,
			customerEmail: item.customerEmail,
			customerPhone: item.customerPhone,
			busType: item.busType,
			departureDate: item.departureDate,
			getJourneyFeedback: item.getJourneyFeedback,
			selectedSeats: item.selectedSeats,
			sourceCity: item.sourceCity,
			destinationCity: item.destinationCity,
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
							{!loading && Math.floor(revenue).toLocaleString("en-IN")}
						</Typography>
					</Flex>
				</Card>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default Revenue;
