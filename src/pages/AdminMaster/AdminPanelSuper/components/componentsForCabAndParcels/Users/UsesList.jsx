import { useState, useEffect } from "react";
import { Card, Flex, Typography, Table, Spin } from "antd";
const { Title } = Typography;
const baseUrl = import.meta.env.VITE_CAB_BOOKING_URL;
const token = localStorage.getItem("token");

const UserList = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const userResponse = await fetch(`${baseUrl}/user/all/users`);
				const userData = await userResponse.json();
				if (!userData.status) {
					throw new Error(userData.message);
				}

				const rideResponse = await fetch(`${baseUrl}/cab/ride-history`);
				const transportResponse = await fetch(`${baseUrl}/cab/transport-history`);

				const rideData = await rideResponse.json();
				const transportData = await transportResponse.json();

				const allBookings = [...rideData.data, ...transportData.data];
				setBookings(allBookings);
				const userBookings = userData.data.map(user => {
					const userBookingsArray = allBookings.filter(
						booking => booking.userId === user._id
					);
					return {
						userId: user._id,
						userEmail: user.email || "Not Available",
						userFullName: `${user.firstName} ${user.lastName}`,
						userPhoneNumber: user.mobileNumber,
						bookings: userBookingsArray,
					};
				});

				setUsers(userBookings);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchData();
	}, [token]);

	if (error) {
		return <div>Error: {error}</div>;
	}
	if (loading) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		);
	}

	const columns = [
		{
			title: "No.",
			dataIndex: "No",
			key: "No",
		},
		{
			title: "User ID",
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
			title: "Phone Number",
			dataIndex: "phoneNumber",
			key: "phoneNumber",
		},
		{
			title: "No Of Bookings",
			dataIndex: "NoOfBookings",
			key: "NoOfBookings",
		},
	];

	const bookingColumns = [
		{
			title: "Booking ID",
			dataIndex: "bookingId",
			key: "bookingId",
		},
		{
			title: "Start Location",
			dataIndex: "startLocation",
			key: "startLocation",
		},
		{
			title: "End Location",
			dataIndex: "endLocation",
			key: "endLocation",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Distance",
			dataIndex: "distance",
			key: "distance",
		},
	];

	const bookingUserData = users.map((user, index) => ({
		No: index + 1,
		key: user.userId,
		userId: user.userId,
		name: user.userFullName,
		email: user.userEmail ,
		phoneNumber: user.userPhoneNumber,
		NoOfBookings: user.bookings.length,
		bookings: user.bookings,
	}));

	const getBookingData = (data) => {
		return data.map((item) => ({
			bookingId: item.id || "Not Available",
			startLocation: item.startLocation || "Not Available",
			endLocation: item.endLocation || "Not Available", 
			status: item.status || "Not Available", 
			amount: item.amountPaid || "Not Available", 
			date: item.date || "Not Available", 
			distance: item.kmCovered || "Not Available", 
		}));
	};

	return (
		<>
			<Flex vertical gap={15}>
				<Title level={4}>List of Users</Title>
				<Flex gap={20}>
					<Card bordered={false} style={{ width: 300, boxShadow: "0 2px 10px #fff3e6" }}>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>Total Number of Users</Typography>
							<Typography style={{
								fontSize: 25,
								backgroundColor: "#fff3e6",
								padding: 10,
								borderRadius: "10px",
								width: 150,
								height: 50,
								textAlign: "center",
								lineHeight: "30px",
							}}>
								{users.length || 0}
							</Typography>
						</Flex>
					</Card>
				</Flex>
				<Table
					columns={columns}
					expandable={{
						expandedRowRender: (record) => (
							<Table
								columns={bookingColumns}
								dataSource={getBookingData(record.bookings)}
							/>
						),
						rowExpandable: (record) => record.NoOfBookings > 0,
					}}
					dataSource={bookingUserData}
				/>
			</Flex>
		</>
	);
};

export default UserList;
