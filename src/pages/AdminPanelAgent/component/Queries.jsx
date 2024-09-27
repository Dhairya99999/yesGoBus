import { useState, useEffect } from "react";
import { Flex, Typography, Table, Spin, Button, message, Select } from "antd";

const { Title } = Typography;
const { Option } = Select;
const baseUrl = import.meta.env.VITE_BASE_URL;

const Queries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState("all");
  const agentCode = localStorage.getItem("agentCode"); // Get agentCode from localStorage

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/query/getQueries`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // Filter queries by agentId
        const filteredQueries = data.filter(query => query.agentId === agentCode);
        setQueries(filteredQueries || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, [agentCode]); // Add agentCode as a dependency

  const handleMarkAsResolved = async (queryId) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/query/updateQuery`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryId,
          data: { status: 'resolved' },
        }),
      });
      const result = await response.json();
      if (response.ok) {
        message.success('Query marked as resolved!');
        setQueries((prevQueries) =>
          prevQueries.map((query) =>
            query._id === queryId ? { ...query, status: 'resolved' } : query
          )
        );
      } else {
        message.error(result.message || 'Failed to mark as resolved');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueries = filter === "resolved" 
    ? queries.filter(query => query.status === 'resolved') 
    : filter === "pending"
    ? queries.filter(query => query.status === 'pending')
    : queries;

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Agent ID',
      dataIndex: 'agentId',
      key: 'agentId',
    },
    {
      title: 'User Name',
      dataIndex: ['userId', 'fullName'],
      key: 'userName',
    },
    {
      title: 'User Phone Number',
      dataIndex: ['userId', 'phoneNumber'],
      key: 'userPhoneNumber',
    },
    {
      title: 'User Email',
      dataIndex: ['userId', 'email'],
      key: 'userEmail',
    },
    {
      title: 'Booking Name',
      dataIndex: 'bookingId',
      key: 'bookingName',
      render: (bookingId, record) => (
        bookingId ? 
        `${bookingId.fromPlace} --- ${bookingId.toPlace} --- ${bookingId.createdAt}` : 
        `${record.busBookingId.sourceCity} --- ${record.busBookingId.destinationCity} --- ${record.busBookingId.doj}`
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => handleMarkAsResolved(record._id)} 
          disabled={record.status === 'resolved'}
        >
          Mark as Resolved
        </Button>
      ),
    },
  ];

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

  return (
    <>
      <div style={{ height: "700px", overflowY: "auto" }}>
        <Flex vertical gap={20}>
          <Title level={3}>Queries</Title>
          <Select
            defaultValue="all"
            onChange={setFilter}
            style={{ width: 200, marginBottom: 20 }}
          >
            <Option value="all">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
          <Table 
            dataSource={filteredQueries} 
            columns={columns} 
            rowKey="_id" 
            pagination={false} 
          />
        </Flex>
      </div>
    </>
  );
};

export default Queries;
