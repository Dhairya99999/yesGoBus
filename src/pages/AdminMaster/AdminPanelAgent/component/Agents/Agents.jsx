import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import { Card, Flex, Typography, Avatar, Table, Button, Spin } from "antd";
const { Title } = Typography;
import UserForm from "./Component/AgentForm";
// import { UserOutlined } from "@ant-design/icons";

const UsesList = ({ handleSelect }) => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [userFormData, setUserFormData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [bookingData, setBookingData] = useState([]);
	// const
	// console.log("users", users);

	const showModal = (userData) => {
		setOpenModal(true);
		setUserFormData(userData);
	};

	const getAllAgentBookings = async (record) => {
		console.log("record", record);
		try {
			const response = await fetch(
				// /getAllBookings
				`${baseUrl}/api/agent/getAllBookings/${record._id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`, // Assuming token is the correct variable
						"Content-Type": "application/json",
					},
				}
			);
			const data = await response.json();
			console.log("users", data.data);
			handleSelect(3, data.data);
			setBookingData(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const columns = [
		{
			title: "No.",
			dataIndex: "No",
			key: "No",
		},
		{
			title: "User Id",
			dataIndex: "userId",
			key: "userId",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		// {
		// 	title: "Gender",
		// 	dataIndex: "Gender",
		// 	key: "Gender",
		// },
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Mobile No.",
			dataIndex: "Mobile_No",
			key: "Mobile_No",
		},
		{
			key: "_id",
		},
		{
			title: "Agent Code",
			dataIndex: "agentCode",
			key: "agentCode",
		},
		{
			title: "Max Tickets Per Day",
			dataIndex: "maxTickets",
			key: "maxTickets",
		},
		{
			dataIndex: "action",
			key: "action",
			render: (text, record) => (
				<Button type="primary" onClick={() => showModal(record)}>
					Update
				</Button>
			),
		},
		{
			dataIndex: "action",
			key: "action",
			render: (text, record) => (
				<Button type="primary" onClick={() => getAllAgentBookings(record)}>
					Bookings
				</Button>
			),
		},
	];

	useEffect(() => {
		if (!openModal) {
			const fetchUsers = async () => {
				setLoading(true);
				try {
					const response = await fetch(
						`${baseUrl}/api/admin/agents/getAllAgents`,
						{
							headers: {
								Authorization: `Bearer ${token}`, // Assuming token is the correct variable
								"Content-Type": "application/json",
							},
						}
					);
					const data = await response.json();
					// console.log("users", data.data);
					setLoading(false);
					setUsers(data.data);
				} catch (error) {
					setError(error.message);
					setLoading(false);
				}
			};
			fetchUsers();
		}
	}, [openModal]);

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

	if (!users || !Array.isArray(users)) {
		return <div>Loading...</div>;
	}
	// console.log(users);

	const data = users
		.filter(
			(user) => user.email !== "admin@yesgobus.com" && user.userId !== null
		)
		.map((user, index) => {
			return {
				key: user._id,
				No: index + 1,
				userId: user.userId,
				name: user.firstName + " " + user.lastName || "N/A",
				// Gender: user.gender || "N/A",
				email: user.email,
				Mobile_No: user.phNum || "N/A",
				_id: user._id,
				status: user.status,
				agentCode: user.agentCode,
				maxTickets: user.maxTicket,
			};
		});

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Agents</Title>
				</Typography>
				<Flex>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 300,
						}}
					>
						<Flex gap={10} vertical>
							<Typography>Number of Agents</Typography>
							<Typography>{users.length - 1}</Typography>
							<Avatar.Group
								maxCount={2}
								maxStyle={{
									color: "#f56a00",
									backgroundColor: "#fde3cf",
								}}
							>
								{users.map((user) => (
									<Avatar
										key={user._id}
										src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
									/>
								))}
							</Avatar.Group>
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
					{/* <Button
						type="primary"
						onClick={() => showModal(null)}
						style={{ marginRight: 60 }}
					>
						Add User
					</Button> */}
				</Flex>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default UsesList;
