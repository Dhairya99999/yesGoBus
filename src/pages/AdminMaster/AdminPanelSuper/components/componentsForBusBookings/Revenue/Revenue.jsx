import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import { Card, Flex, Typography, Table, Spin, DatePicker } from "antd";
const { Title } = Typography;
const { RangePicker } = DatePicker;
const columns = [
	{
		title: "Sr.No.",
		dataIndex: "No",
		key: "No",
	},
	{
		title: "Transaction Id",
		dataIndex: "merchantTransactionId",
		key: "merchantTransactionId",
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
		title: "Revenue Earned",
		dataIndex: "totalAmount",
		key: "totalAmount",
		render: (text) => `₹ ${text}`,
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
	const [filteredData, setFilteredData] = useState([]);
	console.log("filteredData", filteredData);
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
					setRevenueData(data.data.revenueData);
					setFilteredData(data.data.revenueData);
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
		if (dates && dates[0] && dates[1]) {
			const startDate = new Date(dates[0].startOf("day").toISOString());
			const endDate = new Date(dates[1].endOf("day").toISOString());
			endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the day

			const filtered = revenueData.filter((item) => {
				const createdAt = new Date(item.createdAt); // Parse createdAt
				return createdAt >= startDate && createdAt <= endDate; // Filter based on the date range
			});

			setFilteredData(filtered); // Update filtered data

			// Calculate total revenue from filtered data
			const totalRevenue = filtered.reduce(
				(sum, item) => sum + item.totalAmount,
				0
			);
			setRevenue(totalRevenue); // Update the total revenue
		} else {
			setFilteredData(revenueData); // Reset if no date is selected
			setRevenue(revenueData.reduce((sum, item) => sum + item.totalAmount, 0)); // Reset total revenue
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

	// if (!bookings || !Array.isArray(bookings)) {
	// 	return <div>Loading...</div>;
	// }
	// console.log("revenueData", revenueData);
	const data = filteredData.map((item, index) => {
		return {
			No: index + 1,
			agentCode: item.agentCode,
			totalAmount: item.totalAmount,
			merchantTransactionId: item.merchantTransactionId || "",
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
				<Flex style={{ marginBottom: 16, marginTop: 15 }}>
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

export default Revenue;
