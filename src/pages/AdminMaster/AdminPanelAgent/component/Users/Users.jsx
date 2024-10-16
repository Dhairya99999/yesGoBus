import React, { useState, useEffect } from "react";
import { Flex, Typography, Card, Table, Space, Spin, Button } from "antd";
const { Title } = Typography;
const baseUrl = import.meta.env.VITE_BASE_URL;

const Users = () => {
	const agentCode = localStorage.getItem("agentCode");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [switchUser, setSwitchUser] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/bookings/getAllBookings`,
					{
						headers: {
							Authorization: `Bearer ${agentCode}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				if (data.status === true) {
					// console.log("data", data.data);
					setLoading(false);

					const userIds = [
						...new Set(
							data.data.bookings
								.filter((booking) => booking.userId !== null)
								.map((booking) => booking.userId._id)
						),
					];
					const userBookings = userIds.map((userId) => {
						const userBookingsArray = data.data.bookings.filter(
							(booking) =>
								booking.userId !== null && booking.userId._id === userId
						);
						const userEmail = data.data.bookings.find(
							(booking) =>
								booking.userId !== null && booking.userId._id === userId
						).userId.email;
						const userFullName = data.data.bookings.find(
							(booking) =>
								booking.userId !== null && booking.userId._id === userId
						).userId.fullName;
						const userGender = data.data.bookings.find(
							(booking) =>
								booking.userId !== null && booking.userId._id === userId
						).userId.gender;
						const userPhoneNumber = data.data.bookings.find(
							(booking) =>
								booking.userId !== null && booking.userId._id === userId
						).userId.phoneNumber;
						return {
							userId,
							userEmail,
							userFullName,
							userGender,
							userPhoneNumber,
							bookings: userBookingsArray,
						};
					});

					// Update your state with the userBookings array
					setUsers(userBookings);
				} else {
					setError(data.message);
					setLoading(false);
				}
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};
		fetchUsers();
	}, [switchUser, agentCode]);

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

	const columns = [
		{
			title: "No.",
			dataIndex: "No",
			key: "No",
		},
		{
			title: "UserId",
			dataIndex: "userId",
			key: "userId",
		},
		{
			title: "Customer Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Gender",
			dataIndex: "gender",
			key: "gender",
		},
		{
			title: "Phone Number",
			dataIndex: "phoneNumber",
			key: "phoneNumber",
		},
		{
			title: "No Of Bookings",
			dataIndex: "NoOfBookings",
			key: "NoOfBookings",
		},
		// {
		//   title: 'Action',
		//   dataIndex: '',
		//   key: 'x',
		//   render: () => <a>Delete</a>,
		// },
	];
	console.log("users", users);

	const bookingUserData =
		users &&
		users.map((user, index) => ({
			No: index + 1,
			key: user.userId,
			userId: user.userId,
			name: user.userFullName,
			email: user.userEmail,
			gender: user.userGender,
			phoneNumber: user.userPhoneNumber,
			NoOfBookings: user.bookings.length,
			bookings: user.bookings,
		}));

	const bookingColumns = [
		{
			title: "Booking ID",
			dataIndex: "bookingId",
			key: "bookingId",
		},
		{
			title: "Package Name",
			dataIndex: "packageName",
			key: "packageName",
		},
		{
			title: "Departure Date",
			dataIndex: "departureDate",
			key: "departureDate",
		},
		{
			title: "Destination",
			dataIndex: "destination",
			key: "destination",
		},
		{
			title: "Return Date",
			dataIndex: "returnDate",
			key: "returnDate",
		},
		{
			title: "totalPackagePrice",
			dataIndex: "totalPackagePrice",
			key: "totalPackagePrice",
		},
		{
			title: "total Guests",
			dataIndex: "totalGuests",
			key: "totalGuests",
		},
		{
			title: "Payment Status",
			dataIndex: "paymentStatus",
			key: "paymentStatus",
		},
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "createdAt",
		},
	];

	const getBookingData = (data) => {
		console.log("data", data);
		return data.map((item) => ({
			bookingId: item.bookingId || "Not Available",
			packageName: item.packageId.name || "Not Available",
			departureDate: item.departureDate || "Not Available",
			destination: item.packageId.destination || "Not Available",
			returnDate: item.returnDate || "Not Available",
			totalPackagePrice: item.totalPackagePrice || "Not Available",
			totalGuests: item.totalGuests || "Not Available",
			paymentStatus: item.paymentStatus || "Not Available",
			createdAt: item.createdAt || "Not Available",
		}));
	};

	return (
		<>
			<Flex vertical gap={15}>
				<Title level={3}>Users</Title>
				<Title level={4}>
					List of Users Booked {switchUser ? "Bus" : "Package"}
				</Title>
				<Button
					type="primary"
					style={{ width: "200px" }}
					onClick={() => setSwitchUser(!switchUser)}
				>
					{switchUser ? "Bus Booking" : "Package Booking"}
				</Button>
				{/* <Table
					columns={columns}
					expandable={{
						expandedRowRender: (record) => (
							<p
								style={{
									margin: 0,
								}}
							>
								{record.name}
							</p>
						),
						rowExpandable: (record) => record.name !== "Not Expandable",
					}}
					dataSource={switchUser ? bookingUserData : bookingUserData}
				/> */}
				<Table
					columns={columns}
					expandable={{
						expandedRowRender: (record) => (
							<Table
								columns={bookingColumns}
								dataSource={getBookingData(record.bookings)}
							/>
						),
						rowExpandable: (record) => record.userEmail !== "Not Expandable",
					}}
					dataSource={switchUser ? bookingUserData : bookingUserData}
				/>
			</Flex>
		</>
	);
};

export default Users;
