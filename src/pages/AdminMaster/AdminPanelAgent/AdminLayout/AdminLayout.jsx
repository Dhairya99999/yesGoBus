import { useState } from "react";
import {
	Button,
	Flex,
	Layout,
	Input,
	Typography,
	Avatar,
	Badge,
	Menu,
	Popover,
} from "antd";
const { Sider, Header, Content } = Layout;
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	SearchOutlined,
	BellOutlined,
	UserOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import Sidebar from "../component/Sider";
import Dashboard from "../component/Dashboard";
import Booking from "../component/Booking";
import Agents from "../component/Agents/Agents";
import Queries from "../component/Queries";
import "./adminlayout.scss";
const AdminAgentLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedItem, setSelectedItem] = useState("1"); // Add a state to store the selected item
	// const [bookingData, setBookingData] = useState([]);

	if (!localStorage.getItem("agentUser")) {
		window.location.href = "/admin/login";
	}
	const user = JSON.parse(localStorage.getItem("agentUser"));
	// console.log(user);

	const handleSelect = (key) => {
		setSelectedItem(key);
	};

	const handleLogout = () => {
		// Add your logout logic here
		console.log("Logging out");
		localStorage.removeItem("agentUser");
		localStorage.removeItem("agentToken");
		window.location.href = "/admin/login";
	};
	const menuItems = [
		{
			key: "1",
			icon: <LogoutOutlined />,
			label: "Logout",
			onClick: handleLogout,
		},
	];

	return (
		<Layout>
			<Sider
				theme="light"
				trigger={null}
				collapsible
				collapsed={collapsed}
				className="sider-bar"
			>
				<Sidebar onSelect={handleSelect} />
				<Button
					onClick={() => setCollapsed(!collapsed)}
					icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					className="collapse-btn"
				/>
			</Sider>
			<Layout>
				<Header className="header">
					<Flex justify="end">
						{/* <Flex gap={10}>
							<Input
								placeholder="Search"
								variant="borderless"
								style={{ minWidth: 300, maxWidth: 1000 }}
							/>

							<Button type="primary" icon={<SearchOutlined />} />
						</Flex> */}
						<Flex gap={30}>
							{/* <Badge count={1}>
								<Button icon={<BellOutlined />} />
							</Badge> */}
							<Flex gap={10}>
								<Typography>
									{user.firstName && user.lastName
										? user.firstName + " " + user.lastName
										: user.fullName || user.email || ""}
								</Typography>
								<Popover
									content={<Menu items={menuItems} />}
									placement="bottomRight"
									trigger="click"
								>
									<Avatar
										style={{
											backgroundColor: "#FF742C",
											cursor: "pointer",
										}}
										icon={<UserOutlined />}
									/>
								</Popover>
							</Flex>
						</Flex>
					</Flex>
				</Header>
				<Content className="content">
					{selectedItem === "1" && <Dashboard />}
					{/* {selectedItem === "2" && <Agents />} */}
					{selectedItem === "3" && <Booking />}
					{selectedItem === "4" && <Queries />}
				</Content>
				{/* <Footer>footer</Footer> */}
			</Layout>
		</Layout>
	);
};

export default AdminAgentLayout;
