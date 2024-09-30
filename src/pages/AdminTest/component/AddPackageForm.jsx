import { useState, useEffect } from "react";
import axios from "axios";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Flex, Form, Input, Button, Select, Spin, Upload, message } from "antd";

const { Option } = Select;

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

const AddPackageForm = ({ closeForm }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [dataFromBackend, setDataFromBackend] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/packages/getAllPackages`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				const packageData = await response.json();
				setDataFromBackend(packageData.data);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// console.log("dataFromBackend", dataFromBackend);

	let hotel = [];
	let destination = [];
	let packages = [];
	if (dataFromBackend && dataFromBackend.packages) {
		dataFromBackend.packages.forEach((item) => {
			if (item.hotelId) {
				// Extract hotel data
				const hotelData = {
					value: item.hotelId.hotelName,
					label: item.hotelId.hotelName,
					id: item.hotelId._id,
				};
				if (!hotel.find((h) => h.id === hotelData.id)) {
					hotel.push(hotelData);
				}
			}

			if (item.destinationID) {
				// Extract destination data
				const destinationData = {
					value: item.destinationID.destination,
					label: item.destinationID.destination,
					id: item.destinationID._id,
				};
				if (!destination.find((d) => d.id === destinationData.id)) {
					destination.push(destinationData);
				}
			}

			if (item) {
				// Extract package data
				const packageData = {
					value: item.name,
					label: `${item.name} (${item.destination})`,
					id: item._id,
				};
				if (!packages.find((p) => p.id === packageData.id)) {
					packages.push(packageData);
				}
			}
		});
	}
	// console.log("hotel", hotel);
	// console.log("destination", destination);
	console.log("packages", packages);

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

	const createItineraryPlan = async (formData) => {
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			};

			const response = await axios.post(
				`${baseUrl}/api/admin/itineraryPlans/createItineraryPlan`,
				formData,
				{ headers }
			);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const onFinish = (values) => {
		const formData = {
			destination: values.destination,
			checkIn: values.checkIn,
			checkOut: values.checkOut,
			room_name: values.room_name,
			end_of_day_info: values.end_of_day_info,
			additional_info: values.info,
			plans: values.plans.map((plan) => ({
				title: plan.title,
				plan: plan.plan,
				activities: plan.activities,
				activitiesAddress: plan.activitiesAddress,
				activitiesHour: plan.activitiesHour,
				image: plan.image?.[0]?.thumbUrl,
				endOfDayInfo: plan.endOfDayInfo,
			})),
			hotelId: values.hotelId,
			destinationId: values.destinationId,
			packageId: values.packageId,
		};
		console.log("Success:", formData);
		createItineraryPlan(formData);
		closeForm(false);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const beforeUpload = (file) => {
		if (!file) return false;
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			message.error("You can only upload JPG/PNG file!");
		}
		const isLt50M = file.size / 1024 / 1024 < 50;
		if (!isLt50M) {
			message.error("Image must smaller than 50MB!");
		}
		return isJpgOrPng && isLt50M;
	};

	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	return (
		<div className="flex justify-end min-h-screen bg-gray-100">
			<div className="w-full max-w-2xl p-8 bg-white shadow-lg">
				<Form
					name="basic"
					initialValues={{
						remember: true,
						info: [""],
						plans: [
							{
								title: "",
								plan: "",
								activities: "",
								activitiesAddress: "",
								activitiesHour: "",
								image: [],
								endOfDayInfo: "",
							},
						],
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
					layout="vertical"
				>
					<Flex vertical>
						<Form.Item
							name="destination"
							label="Destination"
							rules={[
								{
									required: true,
									message: "Please select a destination label",
								},
							]}
						>
							<Select placeholder="Select a destination label">
								{destination.map((destination) => (
									<Option key={destination.id} value={destination.value}>
										{destination.label}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="Check In"
							name="checkIn"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="Check Out"
							name="checkOut"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="Room Name"
							name="room_name"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="End Of Day Info"
							name="end_of_day_info"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.List name="info">
							{(fields, { add, remove }) => (
								<>
									{fields.map((field, index) => (
										<Form.Item
											label={index === 0 ? "Additional Info" : ""}
											required={false}
											key={field.key}
										>
											<Form.Item {...field} noStyle>
												<Input
													placeholder="Additional information"
													style={{ width: "90%" }}
												/>
											</Form.Item>
											{fields.length > 1 && (
												<MinusCircleOutlined
													className="ml-2"
													onClick={() => remove(field.name)}
												/>
											)}
										</Form.Item>
									))}
									<Form.Item>
										<Button
											type="dashed"
											onClick={() => add()}
											icon={<PlusOutlined />}
											block
										>
											Add field
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>

						<Form.List name="plans">
							{(fields, { add, remove }) => (
								<>
									{fields.map((field, index) => (
										<div key={field.key} className="mb-4 p-4 border rounded">
											<h4 className="mb-2">Plan {index + 1}</h4>
											<Form.Item label="Title" name={[field.name, "title"]}>
												<Input />
											</Form.Item>
											<Form.Item label="Plan" name={[field.name, "plan"]}>
												<Input />
											</Form.Item>
											<Form.Item
												label="Activities"
												name={[field.name, "activities"]}
											>
												<Input />
											</Form.Item>
											<Form.Item
												label="Activities Address"
												name={[field.name, "activitiesAddress"]}
											>
												<Input />
											</Form.Item>
											<Form.Item
												label="Activities Hour"
												name={[field.name, "activitiesHour"]}
											>
												<Input />
											</Form.Item>
											<Form.Item label="Image" name={[field.name, "image"]}>
												<Upload
													name="image"
													listType="picture-card"
													className="avatar-uploader"
													beforeUpload={beforeUpload}
													customRequest={async ({ file, onSuccess }) => {
														try {
															const base64 = await convertToBase64(file);
															onSuccess({ url: base64, thumbUrl: base64 });
														} catch (err) {
															console.error("Error converting image:", err);
															message.error("Failed to upload image");
														}
													}}
												>
													{field.image && field.image[0]?.thumbUrl ? (
														<img
															src={field.image[0].thumbUrl}
															alt="avatar"
															style={{ width: "100%" }}
														/>
													) : (
														<div style={{ width: "50%", height: "50%" }}>
															<PlusOutlined />
															<div style={{ marginTop: 8 }}>Upload</div>
														</div>
													)}
												</Upload>
											</Form.Item>
											<Form.Item
												label="End Of Day Info"
												name={[field.name, "endOfDayInfo"]}
											>
												<Input />
											</Form.Item>
											{fields.length > 1 && (
												<Button
													type="link"
													onClick={() => remove(field.name)}
													icon={<MinusCircleOutlined />}
												>
													Remove Plan
												</Button>
											)}
										</div>
									))}
									<Form.Item>
										<Button
											type="dashed"
											onClick={() => add()}
											icon={<PlusOutlined />}
											block
										>
											Add Plan
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
						
						<Form.Item
							name="hotelId"
							label="Hotel"
							rules={[
								{ required: true, message: "Please select a hotel label" },
							]}
						>
							<Select placeholder="Select a hotel label">
								{hotel.map((hotel) => (
									<Option key={hotel.id} value={hotel.id}>
										{hotel.label}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name="packageId"
							label="Package"
							rules={[
								{
									required: true,
									message: "Please select a package label",
								},
							]}
						>
							<Select placeholder="Select a package label">
								{packages.map((item) => (
									<Option key={item.id} value={item.id}>
										{item.label}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" block>
								Submit
							</Button>
						</Form.Item>
					</Flex>
				</Form>
			</div>
		</div>
	);
};

export default AddPackageForm;
