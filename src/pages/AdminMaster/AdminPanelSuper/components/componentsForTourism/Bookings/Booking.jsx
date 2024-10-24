// import React from 'react'
import { useState, useEffect } from "react";
// import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const user = localStorage.getItem("token");
import {
	Card,
	Flex,
	Typography,
	Avatar,
	Space,
	Table,
	Button,
	Spin,
	DatePicker
} from "antd";
const { Title } = Typography;
const { RangePicker } = DatePicker; 
const columns = [
	{
		title: "No.",
		dataIndex: "No",
		key: "No",
	},
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Status",
		dataIndex: "Status",
		key: "Status",
		render: (_, { Status }) => (
			<Space>
				<span
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border:
							Status === "SUCCESS"
								? "1px solid green"
								: Status === "pending"
								? "1px solid blue"
								: "1px solid red",
						padding: "0.5px",
						borderRadius: "50%",
						width: "11px",
						height: "11px",
						boxSizing: "none",
					}}
				>
					<span
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "8px",
							height: "8px",
							borderRadius: "50%",

							backgroundColor:
								Status === "SUCCESS"
									? "green"
									: Status === "pending"
									? "blue"
									: "red",
						}}
					/>
				</span>
				<Typography>{Status}</Typography>
			</Space>
		),
	},
	{
		title: "From Place",
		dataIndex: "Source",
		key: "Source",
	},
	{
		title: "To Place",
		dataIndex: "Destination",
		key: "Destination",
	},{
		title: "Departure Date",
		dataIndex: "departure",
		key: "departure",
	},{
		title: "Return Date",
		dataIndex: "return",
		key: "return",
	},
	{
		title: "Package Price",
		dataIndex: "price",
		key: "price",
	},
	// {
	// 	dataIndex: "action",
	// 	key: "action",
	// 	render: (_, { action }) => (
	// 		<Button type="primary" variant="solid">
	// 			{action.toUpperCase()}
	// 		</Button>
	// 	),
	// },
];

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/api/admin/bookings/getAllBookings`, {
                    headers: {
                        Authorization: `Bearer ${user}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (data.status) {
                    setLoading(false);
                    setBookings(data.data.bookings);
                    setFilteredBookings(data.data.bookings); 
                } else {
                    setError(data.message);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleDateChange = (dates) => {
        setDateRange(dates);
        if (dates && dates[0] && dates[1]) {
            const startDate = new Date(dates[0].startOf('day').toISOString());
            const endDate = new Date(dates[1].endOf('day').toISOString());
            endDate.setHours(23, 59, 59, 999); 

            const filtered = bookings.filter((booking) => {
                const createdAt = new Date(booking.createdAt); 
                return createdAt >= startDate && createdAt <= endDate; 
            });

            setFilteredBookings(filtered); 
        } else {
            setFilteredBookings(bookings); 
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Spin size="large" />
            </Flex>
        );
    }

    const data = filteredBookings.length > 0
        ? filteredBookings.filter((booking) => booking.userId !== null)
        .map((booking, index) => {
            return {
                key: booking._id,
                No: index + 1,
                name: booking.userId.fullName,
                Status: booking.paymentStatus,
                Source: booking.fromPlace,
                Destination: booking.toPlace,
                departure: booking.departureDate,
                return: booking.returnDate,
                price: booking.totalPackagePrice,
            };
        })
        : []; 

    return (
        <>
            <Flex gap={10} vertical>
                <Typography>
                    <Title level={3}>Bookings</Title>
                </Typography>
                <Card bordered={false} style={{ width: 300 }}>
                    <Flex gap={10} vertical>
                        <Typography>Number of Bookings</Typography>
                        <Typography>{bookings.length}</Typography>
                        <Avatar.Group
                            maxCount={3}
                            maxStyle={{
                                color: "#f56a00",
                                backgroundColor: "#fde3cf",
                            }}
                        >
                            {bookings.map((booking) => (
                                <Avatar
                                    key={booking._id}
                                    src="https://lh3.googleusercontent.com/proxy/xr1GXMGF5o6oKuDqHFK5Fb6fwQbaG-8XKkHC59OC8Epx1LkEgctv0jGrSf22Eir6Hngf4bN7RSV_odfUKqT74ZRvcf_r6qtvlbfkyKjMkkFbaFRWeMuLbh-X"
                                />
                            ))}
                        </Avatar.Group>
                    </Flex>
                </Card>
                <Flex style={{ marginBottom: 16, marginTop: 10 }}>
                    <RangePicker
                        style={{ width: "45%" }}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                    />
                </Flex>
                <Typography>
                    <Title level={3}>Bookings</Title>
                </Typography>
                <Table columns={columns} dataSource={data} />
            </Flex>
        </>
    );
};


export default Booking;
