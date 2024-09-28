import { useState } from "react";
import { Button, Flex, Layout, Input, Typography } from "antd";
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	SearchOutlined,
	BellOutlined,
	UserOutlined,
} from "@ant-design/icons";
import Sidebar from "../component/Sider";
import { Avatar, Badge } from "antd";
const { Sider, Header, Content } = Layout;
import UserList from "../component/UsesList";
import Dashboard from "../component/Dashboard";
import Booking from "../component/Booking";
import Revenue from "../component/Revenue";
import Packages from "../component/Packages";
import Queries from "../component/Queries";
import "./adminlayout.scss";
const AdminLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedItem, setSelectedItem] = useState("1"); // Add a state to store the selected item

	const handleSelect = (key) => {
		setSelectedItem(key);
	};
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
					<Flex justify="space-between">
						<Flex gap={10}>
							<Input
								placeholder="Search"
								variant="borderless"
								style={{ minWidth: 300, maxWidth: 1000 }}
							/>

							<Button type="primary" icon={<SearchOutlined />} />
						</Flex>
						<Flex gap={30}>
							<Badge count={1}>
								<Button icon={<BellOutlined />} />
							</Badge>
							<Flex gap={10}>
								<Typography>User</Typography>

								<Avatar
									style={{
										backgroundColor: "#FF742C",
									}}
									icon={<UserOutlined />}
								/>
							</Flex>
						</Flex>
					</Flex>
				</Header>
				<Content className="content">
					{selectedItem === "1" && <Dashboard />}
					{selectedItem === "2" && <Booking />}
					{selectedItem === "3" && <UserList />}
					{selectedItem === "4" && <Revenue />}
					{selectedItem === "5" && <Packages />}
					{selectedItem === "6" && <Queries />}
				</Content>
				{/* <Footer>footer</Footer> */}
			</Layout>
		</Layout>
	);
};

export default AdminLayout;