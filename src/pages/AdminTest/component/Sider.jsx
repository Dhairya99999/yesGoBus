// import React from "react";
import { Flex, Typography, Menu } from "antd";
import {
	FileTextOutlined,
	UserOutlined,
	DollarOutlined,
	HomeOutlined,
} from "@ant-design/icons";
import { PiTruckBold } from "react-icons/pi";
import "./sider.scss";
const Sider = ({ onSelect }) => {
	return (
		<>
			<Flex align="center" justify="center" className="sider">
				<div className="sider-title">
					<Typography>YesGoBus</Typography>
				</div>
			</Flex>

			<Menu
				mode="inline"
				defaultSelectedKeys={["1"]}
				className="menu-bar"
				items={[
					{
						key: "1",
						icon: <HomeOutlined />,
						label: "Dashboard",
					},
					{
						key: "2",
						icon: <FileTextOutlined />,
						label: "Booking",
					},
					{
						key: "3",
						icon: <UserOutlined />,
						label: "User",
					},
					{
						key: "4",
						icon: <DollarOutlined />,
						label: "Revenue",
					},
					{
						key: "5",
						icon: <PiTruckBold />,
						label: "Packages",
					},
				]}
				onSelect={({ key }) => onSelect(key)}
			/>
		</>
	);
};

export default Sider;
