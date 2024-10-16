import { useState, useEffect } from "react";
import { Button, Flex, Layout, Input, Typography, Menu, Popover } from "antd";
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	SearchOutlined,
	BellOutlined,
	UserOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import Sidebar from "../component/Sider";
import { Avatar, Badge } from "antd";
const { Sider, Header, Content } = Layout;
import Dashboard from "../component/Dashboard";
import Booking from "../component/Booking";
import Queries from "../component/Queries";
import PackageBooking from "../component/PackageBooking";
import Revenue from "../component/Revenue/Revenue";
import Ratings from "../component/Ratings/Ratings";
import Users from "../component/Users/Users";
import "./adminlayout.scss";
const AdminAgentLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedItem, setSelectedItem] = useState("1"); // Add a state to store the selected item

	const handleSelect = (key) => {
		setSelectedItem(key);
	};

	const [agentCode, setAgentCode] = useState("");

	useEffect(() => {
		const code = localStorage.getItem("agentCode");
		setAgentCode(code);
	}, [agentCode]);
	const handleLogout = () => {
		// Add your logout logic here
		console.log("Logging out");
		localStorage.removeItem("agentCode");
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
						{/* <div> Left side content (if any) </div> */}

						<Flex gap={10} style={{ alignItems: "center" }}>
							{agentCode && (
								<>
									<Typography>{agentCode}</Typography>
									{/* <Avatar
										style={{ backgroundColor: "#FF742C" }}
										icon={<UserOutlined />}
									/> */}
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
								</>
							)}
						</Flex>
					</Flex>
				</Header>

				<Content className="content">
					{selectedItem === "1" && <Dashboard />}
					{/* Bookings from Busbooking */}
					{selectedItem === "2" && <Booking />}
					{/* Booking from Packages/Tour and Travels */}
					{selectedItem === "3" && <PackageBooking />}
					{selectedItem === "4" && <Users />}
					{selectedItem === "5" && <Ratings />}
					{selectedItem === "6" && <Revenue />}
					{selectedItem === "7" && <Queries />}
				</Content>
				{/* <Footer>footer</Footer> */}
			</Layout>
		</Layout>
	);
};

export default AdminAgentLayout;
