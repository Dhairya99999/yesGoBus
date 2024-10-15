import { useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import { Button, Form, Input, Select, Space, Modal } from "antd";
import "./userform.scss";
const { Option } = Select;
const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};
const tailLayout = {
	wrapperCol: {
		offset: 8,
		span: 16,
	},
};
const UserForm = ({ openModal, setOpenModal, userFormData }) => {
	// console.log("userFormData", userFormData);
	useEffect(() => {
		if (userFormData) {
			form.setFieldsValue({
				gender: userFormData.Gender,
				fullName: userFormData.name,
				email: userFormData.email,
				mobile: userFormData.Mobile_No,
				userId: userFormData.userId,
			});
		}
	});
	const [form] = Form.useForm();
	// const [confirmLoading, setConfirmLoading] = useState(false);

	const onFinish = (values) => {
		// console.log(values);
		if (values.userId) {
			updateUser(values);
		} else {
			createUser(values);
		}
		setOpenModal(false); // close the modal when form is submitted
	};
	const onReset = () => {
		form.resetFields();
	};
	const onFill = () => {
		form.setFieldsValue({
			gender: "male",
			fullName: "John Doe",
			email: "john@example.com",
			mobile: "1234567890",
			userId: "1234567890",
		});
	};
	const onGenderChange = (value) => {
		switch (value) {
			case "male":
				form.setFieldsValue({
					note: "Hi, man!",
				});
				break;
			case "female":
				form.setFieldsValue({
					note: "Hi, lady!",
				});
				break;
			case "other":
				form.setFieldsValue({
					note: "Hi there!",
				});
				break;
			default:
		}
	};

	const updateUser = async (values) => {
		// console.log(values);
		// make an API call to update user on /api/user/updateProfile:userId

		try {
			const { data: updatedUser } = await axios.patch(
				`${baseUrl}/api/admin/user/updateProfile/${userFormData._id}`,
				{
					userId: values.userId,
					fullName: values.fullName,
					email: values.email,
					phoneNumber: values.mobile,
					gender: values.gender,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (updatedUser.status === 200) {
				JSON.stringify(updatedUser?.data);
				// alert("Profile Updated");
				// console.log("updatedUser", updatedUser.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const createUser = async (values) => {
		console.log(values);
		// make an API call to update user on /api/user/updateProfile:userId

		try {
			const { data: user } = await axios.post(
				`${baseUrl}/api/admin/user/createUser`,
				{
					fullName: values.fullName,
					email: values.email,
					phoneNumber: values.mobile,
					gender: values.gender,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (user.status === 200) {
				JSON.stringify(user?.data);
				// alert("Profile Updated");
				console.log("user", user.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Modal
			title="User Details"
			open={openModal}
			closable={false}
			footer={null}
			centered={true}
			// afterClose={() => fetchUsers}
		>
			<Form
				{...layout}
				form={form}
				name="control-hooks"
				onFinish={onFinish}
				style={{
					maxWidth: 600,
				}}
			>
				<Form.Item
					name="userId"
					label="UserId"
					// rules={[
					// 	{
					// 		required: true,
					// 	},
					// ]}
				>
					<Input disabled />
				</Form.Item>
				<Form.Item
					name="fullName"
					label="Full Name"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input placeholder="Enter Full Name" />
				</Form.Item>

				<Form.Item
					name="gender"
					label="Gender"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Select
						placeholder="Select Gender"
						onChange={onGenderChange}
						allowClear
					>
						<Option value="male">male</Option>
						<Option value="female">female</Option>
						<Option value="other">other</Option>
					</Select>
				</Form.Item>
				<Form.Item
					noStyle
					shouldUpdate={(prevValues, currentValues) =>
						prevValues.gender !== currentValues.gender
					}
				>
					{({ getFieldValue }) =>
						getFieldValue("gender") === "other" ? (
							<Form.Item
								name="customizeGender"
								label="Customize Gender"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input />
							</Form.Item>
						) : null
					}
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input placeholder="demo@example.com" />
				</Form.Item>
				<Form.Item
					name="mobile"
					label="Mobile Number"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input placeholder="1234567890" />
				</Form.Item>
				<Form.Item {...tailLayout}>
					<Space>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
						<Button htmlType="button" onClick={() => setOpenModal(false)}>
							Cancel
						</Button>
						<Button htmlType="button" onClick={onReset}>
							Reset
						</Button>
						<Button type="link" htmlType="button" onClick={onFill}>
							Fill form
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default UserForm;
