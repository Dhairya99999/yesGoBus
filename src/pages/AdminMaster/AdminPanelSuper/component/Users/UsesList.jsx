import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import { Card, Flex, Typography, Avatar, Table, Button, Spin } from "antd";
const { Title } = Typography;
import UserForm from "./Component/UserForm";
// import { UserOutlined } from "@ant-design/icons";

const UsesList = () => {
	const [users, setUsers] = useState([]);
	const [agents, setAgents] = useState([]);
	const [error, setError] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [userFormData, setUserFormData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [switchData, setSwitchData] = useState(true);

	// console.log("users", users);
	console.log("agents", agents);

	const showModal = (userData) => {
		setOpenModal(true);
		setUserFormData(userData);
	};

	const agentColumns = [
		{
			title: "No.",
			dataIndex: "No",
			key: "No",
		},
		{
			title: "Agent Code",
			dataIndex: "agentCode",
			key: "agentCode",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Mobile No.",
			dataIndex: "phNum",
			key: "phNum",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "UserId",
			dataIndex: "userId",
			key: "userId",
		},
		// {
		// 	dataIndex: "action",
		// 	key: "action",
		// 	render: (text, record) => (
		// 		<Button type="primary" onClick={() => showModal(record)}>
		// 			Update
		// 		</Button>
		// 	),
		// }
	];

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
		{
			title: "Gender",
			dataIndex: "Gender",
			key: "Gender",
		},
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
			dataIndex: "action",
			key: "action",
			render: (text, record) => (
				<Button type="primary" onClick={() => showModal(record)}>
					Update
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
						`${baseUrl}/api/admin/user/getAllUsers`,
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

	useEffect(() => {
		const fetchAgents = async () => {
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
				// console.log("agents", data.data);
				const filteredAgents = data.data.filter(
					(agent) => agent.email !== "admin@yesgobus.com"
				);
				setAgents(filteredAgents);
			} catch (error) {
				setError(error.message);
			}
		};
		fetchAgents();
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

	if (!users || !Array.isArray(users)) {
		return <div>Loading...</div>;
	}
	// console.log(users);

	const agentData = agents
		.filter((agent) => agent.userId !== null)
		.map((agent, index) => {
			return {
				key: agent.userId,
				No: index + 1,
				agentCode: agent.agentCode,
				name: agent.firstName + " " + agent.lastName,
				email: agent.email,
				phNum: agent.phNum || "N/A",
				status: agent.status ? "Active" : "Inactive",
				userId: agent.userId,
				maxTicket: agent.maxTicket,
				_id: agent._id,
			};
		});

	const data = users
		.filter((user) => user.userId !== null)
		.map((user, index) => {
			return {
				key: user.userId,
				No: index + 1,
				userId: user.userId,
				name: user.fullName,
				Gender: user.gender || "N/A",
				email: user.email,
				Mobile_No: user.phoneNumber || "N/A",
				_id: user._id,
			};
		});

	if (error) {
		return <div>Error: {error}</div>;
	}

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
						}}
					>
						<Flex gap={10} vertical align="center">
							<Typography>
								Number of {`${switchData ? "Users" : "Agents"}`}
							</Typography>
							<Typography>
								{switchData ? users.length : agents.length}
							</Typography>
							{/* <Avatar.Group
								maxCount={2}
								maxStyle={{
									color: "#f56a00",
									backgroundColor: "#fde3cf",
								}}
							>
								{switchData
									? users
									: agents.map((user) => (
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
				{switchData ? (
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
				) : (
					""
				)}

				<Button
					type="primary"
					onClick={() => setSwitchData(!switchData)}
					style={{ width: 200 }}
				>
					{switchData ? "Users" : "Agents"}
				</Button>
				<Table
					columns={switchData ? columns : agentColumns}
					dataSource={switchData ? data : agentData}
				/>
			</Flex>
		</>
	);
};

export default UsesList;
