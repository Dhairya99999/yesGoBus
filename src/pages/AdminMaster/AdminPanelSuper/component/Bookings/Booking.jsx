// import React from 'react'
import { useState, useEffect } from "react";
// import axios from "axios";
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
import { FileTextOutlined } from "@ant-design/icons";
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
		title: "Name",
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
						boxSizing: "none",
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
		title: "Payment",
		dataIndex: "Payment",
		key: "Payment",
	},
	{
		title: "Destination",
		dataIndex: "Destination",
		key: "Destination",
	},
	{
		dataIndex: "action",
		key: "action",
		render: (_, { action }) => (
			<Button type="primary" variant="solid">
				{action.toUpperCase()}
			</Button>
		),
	},
];

const busColumns = [
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
		title: "Bus Type",
		dataIndex: "busOperator",
		key: "busOperator",
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
		title: "Customer Phone",
		dataIndex: "customerPhone",
		key: "customerPhone",
	},
	{
		title: "Status",
		dataIndex: "Status",
		key: "Status",
	},
	{
		title: "Payment",
		dataIndex: "Payment",
		key: "Payment",
	},
	{
		title: "Selected Seats",
		dataIndex: "selectedSeats",
		key: "selectedSeats",
	},
	{
		title: "Destination",
		dataIndex: "destinationCity",
		key: "destinationCity",
	},
];

const Booking = () => {
	const [bookings, setBookings] = useState([]);
	const [packageBookings, setPackageBookings] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [switchData, setSwitchData] = useState(false);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/busBooking/getAllBookings`,
					{
						headers: {
							Authorization: `Bearer ${user}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				if (data.status === true) {
					setLoading(false);
					setBookings(data.data.bookings);
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
	}, [switchData]);

	useEffect(() => {
		const fetchBookings = async () => {
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
				if (data.status === true) {
					setLoading(false);
					setPackageBookings(data.data.bookings);
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
	}, [switchData]);

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

	if (packageBookings.length === 0) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		); // Render a loading indicator when loading is true
	}

	console.log("Bus bookings", bookings);
	console.log("Package bookings", packageBookings);
	const busBookingData = bookings.map((booking, index) => {
		return {
			No: index + 1,
			bookingId: booking._id,
			busOperator: booking.busOperator,
			busType: booking.busType,
			customerEmail: booking.customerEmail,
			customerName: booking.customerName + " " + booking.customerLastName,
			customerPhone: booking.customerPhone,
			Status: booking.bookingStatus,
			Payment: booking.totalAmount,
			SourceCity: booking.sourceCity,
			destinationCity: booking.destinationCity,
			agentCode: booking.agentCode,
			boardingPoint: booking.boardingPoint,
			droppingPoint: booking.droppingPoint,
			doj: booking.doj,
			merchantTransactionId: booking.merchantTransactionId,
			pickUpTime: booking.pickUpTime,
			reachTime: booking.reachTime,
			selectedSeats: booking.selectedSeats,
			userId: booking.userId,
			action: "",
		};
	});

	const data = packageBookings
		.filter((booking) => booking.userId !== null)
		.map((booking, index) => {
			return {
				key: booking._id,
				No: index + 1,
				bookingId: booking.bookingId,
				name: booking.userId.fullName,
				Status: booking.paymentStatus,
				Payment: booking.paymentStatus,
				Destination: booking.toPlace,
				action: "",
			};
		});

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Bookings</Title>
				</Typography>
				<Card
					// title="No of Users"
					bordered={false}
					style={{
						width: 200,
					}}
				>
					<Flex gap={10} vertical align="center">
						<Typography>Number of Bookings</Typography>
						<Typography>
							{switchData ? bookings.length : packageBookings.length}
						</Typography>
						{/* <Avatar.Group
							maxCount={3}
							maxStyle={{
								color: "#f56a00",
								backgroundColor: "#fde3cf",
							}}
						>
							{bookings.map((booking) => (
								<Avatar key={booking._id} src={FileTextOutlined} />
							))}
						</Avatar.Group> */}
					</Flex>
				</Card>
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
					columns={switchData ? busColumns : columns}
					dataSource={switchData ? busBookingData : data}
				/>
			</Flex>
		</>
	);
};

export default Booking;
