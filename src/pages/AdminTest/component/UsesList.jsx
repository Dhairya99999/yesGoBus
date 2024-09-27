import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import { Card, Flex, Typography, Avatar } from "antd";
// import { UserOutlined } from "@ant-design/icons";
import { Table, Button, Spin } from "antd";
const { Title } = Typography;
import UserForm from "./UserForm";
// import { act } from "react";

const UsesList = () => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [userFormData, setUserFormData] = useState(null);
	const [loading, setLoading] = useState(false);
	// console.log("users", users);

	const showModal = (userData) => {
		setOpenModal(true);
		setUserFormData(userData);
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
					const response = await fetch(`${baseUrl}/api/admin/user/getAllUsers`, {
						headers: {
							Authorization: `Bearer ${token}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					});
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
					<Title level={3}>Users List</Title>
				</Typography>
				<Flex gap={20}>
					<Card
						// title="No of Users"
						bordered={false}
						style={{
							width: 300,
						}}
					>
						<Flex gap={10} vertical>
							<Typography>Number of Users</Typography>
							<Typography>{users.length}</Typography>
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
					<Button type="primary" onClick={() => showModal(null)}>
						Add User
					</Button>
				</Flex>
				<UserForm
					openModal={openModal}
					setOpenModal={setOpenModal}
					userFormData={userFormData}
				/>

				<Typography>
					<Title level={3}>List</Title>
				</Typography>
				<Table columns={columns} dataSource={data} />
			</Flex>
		</>
	);
};

export default UsesList;
