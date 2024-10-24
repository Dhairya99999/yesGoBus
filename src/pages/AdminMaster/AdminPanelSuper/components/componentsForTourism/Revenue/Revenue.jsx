import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("adminToken");
import {
    Card,
    Flex,
    Typography,
    Table,
    Spin,
    DatePicker
} from "antd";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const columns = [
    {
        title: "Sr.No.",
        dataIndex: "No",
        key: "No",
    },
    {
        title: "Agent Code",
        dataIndex: "agentCode",
        key: "agentCode",
    },
    {
        title: "Agent Id",
        dataIndex: "agentId",
        key: "agentId",
    },
    {
        title: "Agent Name",
        dataIndex: "agentName",
        key: "agentName",
    },
    {
        title: "Package Name",
        dataIndex: "packageName",
        key: "packageName",
    },
    {
        title: "Destination",
        dataIndex: "destination",
        key: "destination",
    },
    {
        title: "Revenue Earned",
        dataIndex: "totalPackagePrice",
        key: "totalPackagePrice",
    },
];

const Revenue = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/api/admin/revenue/getRevenue`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();
                if (data.status === 200) {
                    setLoading(false);
                    setRevenue(data.data.totalRevenue);
                    setRevenueData(data.data.revenueData);
                    setFilteredData(data.data.revenueData); // Initialize filtered data
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
        if (dates && dates[0] && dates[1]) {
            const startDate = new Date(dates[0].startOf('day').toISOString());
            const endDate = new Date(dates[1].endOf('day').toISOString());
            endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the day

            const filtered = revenueData.filter((item) => {
                const createdAt = new Date(item.createdAt); // Parse createdAt
                return createdAt >= startDate && createdAt <= endDate; // Filter based on the date range
            });

            setFilteredData(filtered); // Update filtered data

            // Calculate total revenue from filtered data
            const totalRevenue = filtered.reduce((sum, item) => sum + item.totalPackagePrice, 0);
            setRevenue(totalRevenue); // Update the total revenue
        } else {
            setFilteredData(revenueData); // Reset if no date is selected
            setRevenue(revenueData.reduce((sum, item) => sum + item.totalPackagePrice, 0)); // Reset total revenue
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

    const data = filteredData.map((item, index) => {
        return {
            No: index + 1,
            agentCode: item.agentCode,
            agentId: item.agentId,
            agentName: item.agentName,
            packageName: item.packageName,
            destination: item.destination,
            totalPackagePrice: item.totalPackagePrice,
            createdAt: item.createdAt, // Include createdAt if needed for debugging
        };
    });

    return (
        <>
            <Flex gap={10} vertical>
                <Typography>
                    <Title level={3}>Revenue</Title>
                </Typography>
                <Card bordered={false} style={{ width: 150 }}>
                    <Flex gap={10} vertical align="center" justify="center">
                        <Typography>Total Revenue</Typography>
                        <Typography
                            style={{
                                backgroundColor: "#FF620E",
                                color: "white",
                                padding: "10px",
                                borderRadius: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            {!loading && revenue}
                        </Typography>
                    </Flex>
                </Card>
                <Flex style={{ marginBottom: 16, marginTop: 15 }}>
                    <RangePicker
                        style={{ width: "45%" }}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                    />
                </Flex>
                <Table columns={columns} dataSource={data} />
            </Flex>
        </>
    );
};

export default Revenue;
