import { useState, useEffect } from "react";
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
import Dashboard from "../component/Dashboard";
import Booking from "../component/Booking";
import Packages from "../component/Packages";
import Queries from "../component/Queries";
import PackageBooking from "../component/PackageBooking";
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
	},[agentCode]); 
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
    <div> {/* Left side content (if any) */} </div>

    <Flex gap={10} style={{ alignItems: 'center' }}>
      {agentCode && (
        <>
          <Typography>{agentCode}</Typography>
          <Avatar
            style={{ backgroundColor: "#FF742C" }}
            icon={<UserOutlined />}
          />
        </>
      )}
    </Flex>
  </Flex>
</Header>

				<Content className="content">
					{selectedItem === "1" && <Dashboard />}
					{selectedItem === "2" && <Booking />}
					{/* {selectedItem === "3" && <Packages />} */}
					{selectedItem === "4" && <PackageBooking />}

					{selectedItem === "5" && <Queries />}
				</Content>
				{/* <Footer>footer</Footer> */}
			</Layout>
		</Layout>
	);
};

export default AdminAgentLayout;