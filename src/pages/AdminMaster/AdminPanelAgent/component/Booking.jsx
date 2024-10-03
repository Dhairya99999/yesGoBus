import React, { useState, useEffect } from "react";
import { Flex, Typography, Table, Spin, Space } from "antd";
const baseUrl = import.meta.env.VITE_BASE_URL;
const agentToken = localStorage.getItem("agenttoken");
const user = JSON.parse(localStorage.getItem("agentUser"));
// console.log("user", user);

const Booking = () => {
	const [bookings, setBookingData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getAllAgentBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					// /getAllBookings
					`${baseUrl}/api/admin/agents/getAllBookings/${user._id}`,
					{
						headers: {
							Authorization: `Bearer ${agentToken}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				// console.log("agent", data.data);
				setBookingData(data.data);
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		getAllAgentBookings();
	}, []);
	// console.log("bookings", bookings);
	const columns = [
		{
			title: "Sr. No.",
			dataIndex: "key",
			key: "key",
		},
		{
			title: "Customer Name",
			dataIndex: "customerName",
			key: "customerName",
		},
		{
			title: "Customer Phone",
			dataIndex: "customerPhone",
			key: "customerPhone",
		},
		{
			title: "Customer Email",
			dataIndex: "CustomerEmail",
			key: "CustomerEmail",
		},
		{
			title: "Total Amount",
			dataIndex: "totalAmount",
			key: "totalAmount",
		},
		{
			title: "Booking Status",
			dataIndex: "bookingStatus",
			key: "bookingStatus",
		},
		{
			title: "Bus Operator",
			dataIndex: "busOperator",
			key: "busOperator",
		},

		// {
		// 	title: "Action",
		// 	dataIndex: "",
		// 	key: "x",
		// 	render: () => <a>Delete</a>,
		// },
	];

	const data = bookings.map((booking, index) => {
		return {
			key: index + 1,
			customerName: booking.customerName,
			customerPhone: booking.customerPhone,
			CustomerEmail: booking.customerEmail,
			totalAmount: booking.totalAmount,
			boardingPoint: booking.boardingPoint,
			bookingStatus: booking.bookingStatus,
			busOperator: booking.busOperator,
			busType: booking.busType,
			driverNumber: booking.driverNumber,
			droppingPoint: booking.droppingPoint,
			merchantTransactionId: booking.merchantTransactionId,
			pickUpTime: booking.pickUpTime,
			reachTime: booking.reachTime,
			selectedSeats: booking.selectedSeats,
			isSrs: booking.isSrs,
			isVrl: booking.isVrl,
			agentCode: booking.agentCode,
			doj: booking.doj,
			sourceCity: booking.sourceCity,
		};
	});

	if (loading || !bookings) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		); // Render a loading indicator when loading is true
	}
	return (
		<>
			<Flex vertical gap={20}>
				<Typography.Title level={3}>Bookings</Typography.Title>
				<Table
					columns={columns}
					expandable={{
						expandedRowRender: (record) => (
							<Flex
								gap={20}
								style={{
									margin: 0,
									marginLeft: 20,
								}}
								wrap="wrap"
							>
								<Space>
									<Typography.Text>Boarding Point :- </Typography.Text>
									<Typography.Text>{record.boardingPoint}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Bus Type :- </Typography.Text>
									<Typography.Text>{record.busType}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Destination City :- </Typography.Text>
									<Typography.Text>{record.destinationCity}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>dropping Point :- </Typography.Text>
									<Typography.Text>{record.droppingPoint}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Boarding Point :- </Typography.Text>
									<Typography.Text>{record.boardingPoint}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Pickup Time :- </Typography.Text>
									<Typography.Text>{record.pickUpTime}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Reach Time :- </Typography.Text>
									<Typography.Text>{record.reachTime}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Selected Seat :- </Typography.Text>
									<Typography.Text>{record.selectedSeats}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Source City :- </Typography.Text>
									<Typography.Text>{record.sourchCity}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Boarding Point :- </Typography.Text>
									<Typography.Text>{record.boardingPoint}</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>
										Merchant Transation Id Point :-{" "}
									</Typography.Text>
									<Typography.Text>
										{record.merchantTransactionId}
									</Typography.Text>
								</Space>
								<Space>
									<Typography.Text>Date Of Journey Point :- </Typography.Text>
									<Typography.Text>{record.doj}</Typography.Text>
								</Space>
							</Flex>
						),
						rowExpandable: (record) => record.name !== "Not Expandable",
					}}
					dataSource={data}
				/>
			</Flex>
		</>
	);
};

export default Booking;
