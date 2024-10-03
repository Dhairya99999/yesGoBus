import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("agentToken");
    setIsLoggedIn(!!token);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const { emailMobile, password } = values;

    try {
      const response = await fetch(`${baseUrl}/api/agent/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailMobile, password }),
      });

      const result = await response.json();

      setResult(result);

      if (response.ok) {
        localStorage.setItem("agentToken", result.token);
		localStorage.setItem("agentCode", result.data.agentCode);
        message.success("Login successful!");
        setIsLoggedIn(true);
        // Optionally redirect to another page
        // navigate("/anotherPage");
      } else {
        message.error(result.message || "Login failed");
      }
    } catch (error) {
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agentToken");
	localStorage.removeItem("agentCode");
    setIsLoggedIn(false);
    navigate("/agent/admin/test")
  };

  if (!isLoggedIn) {
    return (
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email/Mobile"
          name="emailMobile"
          rules={[{ required: true, message: "Please input your email or mobile!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      {/* {result && <div>{result.message || "No additional information available."}</div>}
      <Button type="danger" onClick={handleLogout}>
        Logout
      </Button> */}
      {/* Additional dashboard content goes here */}
    </div>
  );
};

export default Dashboard;
