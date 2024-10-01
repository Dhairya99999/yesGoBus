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
// import { UserOutlined } from "@ant-design/icons";
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
	const [loading, setLoading] = useState(false);

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

	if (!bookings || !Array.isArray(bookings)) {
		return <div>Loading...</div>;
	}

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
						width: 300,
					}}
				>
					<Flex gap={10} vertical>
						<Typography>Number of Bookings</Typography>
						<Typography>{bookings.length}</Typography>
						<Avatar.Group
							maxCount={3}
							maxStyle={{
								color: "#f56a00",
								backgroundColor: "#fde3cf",
							}}
						>
							{bookings.map((booking) => (
								<Avatar
									key={booking._id}
									src="https://lh3.googleusercontent.com/proxy/xr1GXMGF5o6oKuDqHFK5Fb6fwQbaG-8XKkHC59OC8Epx1LkEgctv0jGrSf22Eir6Hngf4bN7RSV_odfUKqT74ZRvcf_r6qtvlbfkyKjMkkFbaFRWeMuLbh-X"
								/>
							))}
						</Avatar.Group>
					</Flex>
				</Card>
				<Typography>
					<Title level={3}>Bookings</Title>
				</Typography>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default Booking;
