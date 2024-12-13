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
					<Typography.Title level={3} style={{ margin: "-6.5px 0" }}>
						YesGoBus
					</Typography.Title>
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
						label: "Bookings",
					},
					{
						key: "3",
						icon: <UserOutlined />,
						label: "Users",
					},

					{
						key: "4",
						icon: <DollarOutlined />,
						label: "Revenue",
					},
					{
						key: "5",
						icon: <PiTruckBold />,
						label: "Ratings",
					},
					{
						key: "6",
						icon: <PiTruckBold />,
						label: "Queries",
					},
					// {
					// 	key: "5",
					// 	icon: <PiTruckBold />,
					// 	label: "Packages",
					// },
				]}
				onSelect={({ key }) => onSelect(key)}
			/>
		</>
	);
};

export default Sider;
