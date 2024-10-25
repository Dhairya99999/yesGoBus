import { Flex, Typography, Menu } from "antd";
import {
	FileTextOutlined,
	UserOutlined,
	DollarOutlined,
	HomeOutlined,
} from "@ant-design/icons";
import { PiTruckBold } from "react-icons/pi";
import { FcRating } from "react-icons/fc";
import { SiGooglebigquery } from "react-icons/si";
import "./sider.scss";

function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	};
}

// Define common sub-menu items
const subItemsForBusBookings = [
	getItem("Dashboard", "1", <HomeOutlined />),
	getItem("Booking", "2", <FileTextOutlined />),
	getItem("Users", "3", <UserOutlined />),
	// getItem("Packages", "4", <PiTruckBold />),
	getItem("Revenue", "4", <DollarOutlined />),
	getItem("Ratings", "5", <FcRating />),
	getItem("Queries", "6", <SiGooglebigquery />),
];
const subItemsForPackages = [
	getItem("Dashboard", "7", <HomeOutlined />),
	getItem("Booking", "8", <FileTextOutlined />),
	getItem("Users", "9", <UserOutlined />),
	getItem("Packages", "10", <PiTruckBold />),
	getItem("Revenue", "11", <DollarOutlined />),
	getItem("Ratings", "12", <FcRating />),
	getItem("Queries", "13", <SiGooglebigquery />),
];

const subMenuItems = [
	getItem("Dashboard", "14", <HomeOutlined />),
	getItem("Users", "18", <UserOutlined />),
	getItem("Cab Bookings", "16", <FileTextOutlined />),
	getItem("Parcel Bookings", "17", <FileTextOutlined />),
	// getItem("Revenue", "19", <DollarOutlined />),
	// getItem("Ratings", "20", <FcRating />),
	// getItem("Queries", "21", <SiGooglebigquery />),
];

// Define main menu items with sub-menus
const menuItems = [
	getItem("Bus Booking", "sub1", <FileTextOutlined />, subItemsForBusBookings),
	getItem("Tourism", "sub2", <PiTruckBold />, subItemsForPackages),
	getItem("Cab and Parcel", "sub3", <PiTruckBold />, subMenuItems),
];

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
				items={menuItems}
				onSelect={({ key }) => onSelect(key)}
			/>
		</>
	);
};

export default Sider;
