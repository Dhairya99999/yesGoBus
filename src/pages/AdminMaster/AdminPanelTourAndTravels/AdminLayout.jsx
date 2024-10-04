import { useState } from "react";
import {
	Button,
	Flex,
	Layout,
	Typography,
	Menu,
	Avatar,
	Popover,
	// Input,
} from "antd";
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	UserOutlined,
	LogoutOutlined,
	// SearchOutlined,
	// BellOutlined,
} from "@ant-design/icons";
const { Sider, Header, Content } = Layout;
import Sidebar from "./Components/Sidebar/Sider";
import UserList from "./Components/Users/UsesList";
import Dashboard from "./Components/Dashboard/Dashboard";
import Booking from "./Components/Bookings/Booking";
import Packages from "./Components/Packages/Packages";
import Queries from "./Components/Queries/Queries";
// import Revenue from "./Components/Revenue/Revenue";
import "./adminlayout.scss";
const AdminLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedItem, setSelectedItem] = useState("1"); // Add a state to store the selected item

	if (!localStorage.getItem("adminUser")) {
		window.location.href = "/admin/login";
	}
	const user = JSON.parse(localStorage.getItem("adminUser"));
	// console.log(user);

	const handleSelect = (key) => {
		setSelectedItem(key);
	};
	const handleLogout = () => {
		// Add your logout logic here
		console.log("Logging out");
		localStorage.removeItem("adminUser");
		localStorage.removeItem("adminToken");
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
								<Typography>{user.fullName || ""}</Typography>
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
					{(() => {
						switch (selectedItem) {
							case "1":
								return <Dashboard />;
							case "2":
								return <Booking />;
							case "3":
								return <UserList />;
							// case "4":
							//   return <Revenue />;
							case "5":
								return <Packages />;
							case "6":
								return <Queries />;
							default:
								return null;
						}
					})()}
				</Content>
				{/* <Footer>footer</Footer> */}
			</Layout>
		</Layout>
	);
};

export default AdminLayout;
