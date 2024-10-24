import { useState, useEffect } from "react";
import {
	Card,
	Flex,
	Typography,
	Table,
	DatePicker,
} from "antd";
const { RangePicker } = DatePicker;
const { Title } = Typography;
const baseUrl = import.meta.env.VITE_CAB_BOOKING_URL;

const columns = [
	{
		title: "No.",
		dataIndex: "No",
		key: "No",
	},
	{
		title: "Booking Id",
		dataIndex: "bookingId",
		key: "bookingId",
	},
	{
		title: "Car Name",
		dataIndex: "carName",
		key: "carName",
	},
	{
		title: "From Location",
		dataIndex: "fromLocation",
		key: "fromLocation",
	},
	{
		title: "To Location",
		dataIndex: "toLocation",
		key: "toLocation",
	},
	{
		title: "Status",
		dataIndex: "status",
		key: "status",
		filters: [
			{ text: "Completed", value: "Completed" },
			{ text: "Accepted", value: "Accepted" },
			{ text: "Ongoing", value: "Ongoing" },
			{ text: "Cancelled", value: "Cancelled" },
		],
		onFilter: (value, record) => record.status.startsWith(value),
		filterSearch: true,
		width: 130,
	},
	{
		title: "Amount Paid",
		dataIndex: "amountPaid",
		key: "amountPaid",
		render: (text) => `${text}`,
	},
	{
		title: "Date",
		dataIndex: "date",
		key: "date",
	},
];

const ParcelBooking = () => {
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [filteredBookings, setFilteredBookings] = useState([]);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			const user = localStorage.getItem("token");
			try {
				const response = await fetch(
					`${baseUrl}/cab/transport-history`
				);
				const data = await response.json();
				console.log(data);
				if (data.status === true) {
					setBookings(data.data);
					setFilteredBookings(data.data);
				} else {
					console.log(data.message)
					setError(data.message);
				}
			} catch (error) {
				console.log(error)
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchBookings();
	}, []);

	const handleDateChange = (dates) => {
		if (dates && dates[0] && dates[1]) {
			const startDate = new Date(dates[0].startOf("day").toISOString());
			const endDate = new Date(dates[1].endOf("day").toISOString());
			endDate.setHours(23, 59, 59, 999);

			const filtered = bookings.filter((booking) => {
				const createdAt = new Date(booking.date);
				return createdAt >= startDate && createdAt <= endDate;
			});
			setFilteredBookings(filtered);
		} else {
			setFilteredBookings(bookings);
		}
	};

	const getTotalRevenue = () => {
		return filteredBookings
			.filter(booking => booking.status === "Completed")
			.reduce((sum, booking) => {
				const amount = parseFloat(booking.amountPaid.replace(/[₹, ]/g, ''));
				return sum + (isNaN(amount) ? 0 : amount);
			}, 0);
	};

	if (error) {
		return <div>Error: {error}</div>;
	}
	if (!bookings || !Array.isArray(bookings)) {
		return <div>Loading...</div>;
	}

	const data = filteredBookings.map((booking, index) => ({
		No: index + 1,
		bookingId: booking.id,
		carName: booking.car_name,
		fromLocation: booking.startLocation,
		toLocation: booking.endLocation,
		status: booking.status,
		amountPaid: booking.amountPaid,
		date: booking.date,
	}));

	return (
		<>
			<Flex gap={10} vertical>
				<Typography>
					<Title level={3}>Bookings</Title>
				</Typography>
				<Flex gap={10} style={{ marginBottom: 16 }}>
					<Card
						bordered={false}
						style={{
							width: 190,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Number of Bookings
							</Typography>
							<Typography
								style={{
									fontSize: 25,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 100,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								{filteredBookings.length}
							</Typography>
						</Flex>
					</Card>
					{/* Total Revenue Card */}
					<Card
						bordered={false}
						style={{
							width: 300,
							boxShadow: "0 2px 10px #fff3e6",
						}}
					>
						<Flex gap={10} vertical align="center" justify="center">
							<Typography style={{ fontWeight: "bold" }}>
								Total Revenue
							</Typography>
							<Typography
								style={{
									fontSize: 25,
									backgroundColor: "#fff3e6",
									padding: 10,
									borderRadius: "10px",
									width: 150,
									height: 50,
									textAlign: "center",
									lineHeight: "30px",
								}}
							>
								₹ {getTotalRevenue()}
							</Typography>
						</Flex>
					</Card>
				</Flex>
				<Flex style={{ marginBottom: 16, marginTop: 10 }}>
					<RangePicker
						style={{ width: "45%" }}
						onChange={handleDateChange}
						format="YYYY-MM-DD"
					/>
				</Flex>
				<Table columns={columns} dataSource={data} loading={loading} />
			</Flex>
		</>
	);
};

export default ParcelBooking;
