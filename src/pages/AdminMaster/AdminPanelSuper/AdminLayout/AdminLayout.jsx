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
import Sidebar from "./Sidebar/Sider";

// imports for Bus Booking
import UserBusBooking from "../components/componentsForBusBookings/Users/Users";
import DashboardBusBooking from "../components/componentsForBusBookings/Dashboard/Dashboard";
import BookingsBusBooking from "../components/componentsForBusBookings/Bookings/Booking";
import QueriesBusBooking from "../components/componentsForBusBookings/Queries/Queries";
import RevenueBusBooking from "../components/componentsForBusBookings/Revenue/Revenue";
import RatingsBusBooking from "../components/componentsForBusBookings/Ratings/Ratings";

// imports for Tour and Travels
import UserTourAndTravels from "../components/componentsForTourism/Users/UsesList";
import DashboardTourAndTravels from "../components/componentsForTourism/Dashboard/Dashboard";
import BookingTourAndTravels from "../components/componentsForTourism/Bookings/Booking";
import QueriesTourAndTravels from "../components/componentsForTourism/Queries/Queries";
import RevenueTourAndTravels from "../components/componentsForTourism/Revenue/Revenue";
import RatingsTourAndTravels from "../components/componentsForTourism/CustomerRatings/Ratings";
import PackagesTourAndTravels from "../components/componentsForTourism/Packages/Packages";

// imports for CabsAndParcels
import DashboardCabAndParcels from "../components/componentsForCabAndParcels/Dashboard/Dashboard";
import CabBooking from "../components/componentsForCabAndParcels/Bookings/Booking";
import ParcelBooking from "../components/componentsForCabAndParcels/Bookings/ParcelBookings";
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
					<Flex justify="space-between">
						<Typography.Title level={3}>Admin Panel</Typography.Title>
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
								return <DashboardBusBooking />;
							case "2":
								return <BookingsBusBooking />;
							case "3":
								return <UserBusBooking />;
							// case "4":
								// return <Packages />;
							case "4":
								return <RevenueBusBooking />;
							case "5":
								return <RatingsBusBooking />;
							case "6":
								return <QueriesBusBooking />;
							case "7":
								return <DashboardTourAndTravels />;
							case "8":
								return <BookingTourAndTravels />;
							case "9":
								return <UserTourAndTravels />;
							case "10":
								return <PackagesTourAndTravels />;
							case "11":
								return <RevenueTourAndTravels />;
							case "12":
								return <RatingsTourAndTravels />;
							case "13":
								return <QueriesTourAndTravels />;
							case "14":
								return <DashboardCabAndParcels />;
								case "16":
								return <CabBooking />;
								case "17":
								return <ParcelBooking />;
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
