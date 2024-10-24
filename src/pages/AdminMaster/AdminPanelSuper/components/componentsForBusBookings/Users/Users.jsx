import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import { Card, Flex, Typography, Avatar, Table, Button, Spin } from "antd";
import { createStyles } from "antd-style";
const { Title } = Typography;
import UserForm from "./Component/UserForm";
// import { render } from "react-dom";
// import { UserOutlined } from "@ant-design/icons";
const useStyle = createStyles(({ css, token }) => {
	const { antCls } = token;
	return {
		customTable: css`
			${antCls}-table {
				${antCls}-table-container {
					${antCls}-table-body,
					${antCls}-table-content {
						scrollbar-width: thin;
						scrollbar-color: #eaeaea transparent;
						scrollbar-gutter: stable;
					}
				}
			}
		`,
	};
});
const UsesList = () => {
	// const [users, setUsers] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [userFormData, setUserFormData] = useState(null);
	const [loading, setLoading] = useState(false);
	// console.log("users", users);
	console.log("bookings", bookings);

	const showModal = (userData) => {
		setOpenModal(true);
		setUserFormData(userData);
	};
	const { styles } = useStyle();

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
		// {
		// 	title: "Gender",
		// 	dataIndex: "gender",
		// 	key: "gender",
		// },
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

	const bookingColumns = [
		{
			title: "Booking ID",
			dataIndex: "bookingId",
			key: "bookingId",
			fixed: "left",
		},
		{
			title: "Agent Code",
			dataIndex: "agentCode",
			key: "agentCode",
		},
		// {
		// 	title: "Boarding-Dropping Point",
		// 	dataIndex: "boardingDroppingPoint",
		// 	key: "boardingDroppingPoint",
		// },
		{
			title: "Source-Destination",
			dataIndex: "sourceDestination",
			key: "sourceDestination",
		},
		{
			title: "Status",
			dataIndex: "bookingStatus",
			key: "bookingStatus",
		},
		{
			title: "Bus Type",
			dataIndex: "busType",
			key: "busType",
		},
		{
			title: "Bus Operator",
			dataIndex: "busOperator",
			key: "busOperator",
		},
		// {
		// 	title: "Date Of Journey",
		// 	dataIndex: "doj",
		// 	key: "doj",
		// },
		{
			title: "Transaction Id",
			dataIndex: "merchantTransactionId",
			key: "merchantTransactionId",
		},
		// {
		// 	title: "Pickup-Reach Time",
		// 	dataIndex: "pickupReachTime",
		// 	key: "pickupReachTime",
		// },
		{
			title: "Selected Seats",
			dataIndex: "selectedSeats",
			key: "selectedSeats",
		},
		{
			title: "Total Amount",
			dataIndex: "totalAmount",
			key: "totalAmount",
			render: (text) => `₹ ${text}`,
		},
		// {
		// 	title: "Created At",
		// 	dataIndex: "createdAt",
		// 	key: "createdAt",
		// },
	];

	// useEffect(() => {
	// 	if (!openModal) {
	// 		const fetchUsers = async () => {
	// 			setLoading(true);
	// 			try {
	// 				const response = await fetch(
	// 					`${baseUrl}/api/admin/user/getAllUsers`,
	// 					{
	// 						headers: {
	// 							Authorization: `Bearer ${token}`, // Assuming token is the correct variable
	// 							"Content-Type": "application/json",
	// 						},
	// 					}
	// 				);
	// 				const data = await response.json();
	// 				// console.log("users", data.data);
	// 				setLoading(false);
	// 				setUsers(data.data);
	// 			} catch (error) {
	// 				setError(error.message);
	// 				setLoading(false);
	// 			}
	// 		};
	// 		fetchUsers();
	// 	}
	// }, [openModal]);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/busBooking/getAllBookings`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				if (data.status === true) {
					setLoading(false);

					const userIds = [
						...new Set(
							data.data.bookings
								.filter((booking) => booking.userId !== null)
								.map((booking) => booking.userId)
						),
					];

					const userBookings = userIds.map((userId) => {
						const userBookingsArray = data.data.bookings.filter(
							(booking) => booking.userId !== null && booking.userId === userId
						);
						const userEmail = data.data.bookings.find(
							(booking) => booking.userId !== null && booking.userId === userId
						).customerEmail;
						const userFirstName = data.data.bookings.find(
							(booking) => booking.userId !== null && booking.userId === userId
						).customerName;
						const userLastName = data.data.bookings.find(
							(booking) => booking.userId !== null && booking.userId === userId
						).customerLastName;
						const userPhoneNumber = data.data.bookings.find(
							(booking) => booking.userId !== null && booking.userId === userId
						).customerPhone;
						const bookingId = data.data.bookings.find(
							(booking) => booking.userId !== null && booking.userId === userId
						)._id;
						return {
							bookingId,
							userId,
							userEmail,
							userFullName: userFirstName + " " + userLastName,
							userPhoneNumber,
							bookings: userBookingsArray,
						};
					});

					setBookings(userBookings);
					// setFilteredBookings(data.data.bookings);
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

	// if (loading) {
	// 	return (
	// 		<Flex justify="center" align="center" style={{ height: "100vh" }}>
	// 			<Spin size="large" />
	// 		</Flex>
	// 	); // Render a loading indicator when loading is true
	// }

	// if (!users || !Array.isArray(users)) {
	// 	return <div>Loading...</div>;
	// }
	// console.log(users);

	// const data = users
	// 	.filter((user) => user.userId !== null)
	// 	.map((user, index) => {
	// 		return {
	// 			key: user.userId,
	// 			No: index + 1,
	// 			userId: user.userId,
	// 			name: user.fullName,
	// 			Gender: user.gender || "N/A",
	// 			email: user.email,
	// 			Mobile_No: user.phoneNumber || "N/A",
	// 			_id: user._id,
	// 		};
	// 	});

	const userData =
		bookings &&
		bookings.map((user, index) => ({
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

	const getBookingData = (data) => {
		return data.map((booking) => ({
			key: booking._id,
			bookingId: booking._id,
			agentCode: booking.agentCode || "N/A",
			userId: booking.userId,
			boardingDroppingPoint:
				booking.boardingPoint + " - " + booking.droppingPoint,
			sourceDestination: booking.sourceCity + " - " + booking.destinationCity,
			pickupReachTime: booking.pickUpTim + " - " + booking.reachTime,
			bookingStatus: booking.bookingStatus,
			busType: booking.busType,
			busOperator: booking.busOperator,
			doj: booking.doj,
			merchantTransactionId: booking.merchantTransactionId,
			selectedSeats: booking.selectedSeats,
			totalAmount: booking.totalAmount,
			createdAt: booking.createdAt,
			// boardingPoint: booking.boardingPoint,
			// droppingPoint: booking.droppingPoint,
			// destinationCity: booking.destinationCity,
			// pickUpTime: booking.pickUpTime,
			// reachTime: booking.reachTime,
			// sourceCity: booking.sourceCity,
		}));
	};

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Users</Title>
				</Typography>
				<Flex>
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
								Number of Users
							</Typography>
							<Typography
								style={{
									fontSize: 25,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 100,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{bookings.length}
							</Typography>
							{/* <Avatar.Group
								maxCount={2}
								maxStyle={{
									color: "#f56a00",
									backgroundColor: "#fde3cf",
								}}
							>
								{bookings.map((user) => (
									<Avatar
										key={user._id}
										src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
									/>
								))}
							</Avatar.Group> */}
						</Flex>
					</Card>
				</Flex>
				<UserForm
					openModal={openModal}
					setOpenModal={setOpenModal}
					userFormData={userFormData}
				/>
				<Flex justify="space-between" align="center">
					<Typography>
						<Title level={3}>List</Title>
					</Typography>
					<Button
						type="primary"
						onClick={() => showModal(null)}
						style={{ marginRight: 60 }}
					>
						Add User
					</Button>
				</Flex>
				<Table
					loading={loading}
					columns={columns}
					dataSource={userData}
					expandable={{
						expandedRowRender: (record) => (
							<Table
								// loading={loading}
								columns={bookingColumns}
								dataSource={getBookingData(record.bookings)}
								pagination={{ pageSize: 5 }}
								className={styles.customTable}
								scroll={{
									x: "max-content",
								}}
							/>
						),
						rowExpandable: (record) => record.userEmail !== "Not Expandable",
					}}
				/>
			</Flex>
		</>
	);
};

export default UsesList;
