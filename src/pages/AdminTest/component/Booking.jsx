// import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import { Card, Flex, Typography, Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Space, Table, Button } from "antd";
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

const Booking = () => {
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookings = async () => {
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
					setBookings(data.data.bookings);
				} else {
					setError(data.message);
				}
			} catch (error) {
				setError(error.message);
			}
		};
		fetchBookings();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!bookings || !Array.isArray(bookings)) {
		return <div>Loading...</div>;
	}
	// console.log(bookings);

	// const data = bookings.map((booking, index) => {
	// 	const name = booking.userId
	// 		? booking.userId.fullName
	// 		: "User ID not available";
	// 	return {
	// 		key: booking._id,
	// 		No: index + 1,
	// 		bookingId: booking.bookingId,
	// 		name,
	// 		Status: booking.status,
	// 		Payment: booking.payment,
	// 		Destination: booking.toPlace,
	// 		action: "Details",
	// 	};
	// });
	const data = bookings
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
				action: "Details",
			};
		});

	if (error) {
		return <div>Error: {error}</div>;
	}
	// const data = [
	// 	{
	// 		key: "1",
	// 		No: "01",
	// 		bookingId: 4125,
	// 		name: "John Brown",
	// 		Status: "Completed",
	// 		Payment: "Paid",
	// 		Destination: "Kathmandu",
	// 		action: "Details",
	// 	},
	// ];
	// const data = bookings.map((booking, index) => {
	// 	return {
	// 		key: booking.id,
	// 		No: index + 1,
	// 		bookingId: booking.id,
	// 		name: booking.name,
	// 		Status: booking.status,
	// 		Payment: booking.payment,
	// 		Destination: booking.destination,
	// 		action: "Details",
	// 	};
	// });

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Users List</Title>
				</Typography>
				<Card
					// title="No of Users"
					bordered={false}
					style={{
						width: 300,
					}}
				>
					<Flex gap={10} vertical>
						<Typography>Number of Users</Typography>
						<Typography>{bookings.length}</Typography>
						<Avatar.Group
							maxCount={3}
							maxStyle={{
								color: "#f56a00",
								backgroundColor: "#fde3cf",
							}}
						>
							<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
							<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
							<Avatar
								style={{
									backgroundColor: "#f56a00",
								}}
							>
								K
							</Avatar>
							<Avatar
								style={{
									backgroundColor: "#f56a00",
								}}
							>
								K
							</Avatar>
							<Avatar
								style={{
									backgroundColor: "#f56a00",
								}}
							>
								K
							</Avatar>
							<Tooltip title="Ant User" placement="top">
								<Avatar
									style={{
										backgroundColor: "#87d068",
									}}
									icon={<UserOutlined />}
								/>
							</Tooltip>
						</Avatar.Group>
					</Flex>
				</Card>
				<Typography>
					<Title level={3}>Customers</Title>
				</Typography>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default Booking;
