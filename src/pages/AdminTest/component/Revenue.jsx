import React, { useState } from "react";
import {
	Form,
	Input,
	Select,
	DatePicker,
	Card,
	Button,
	Space,
	Typography,
	Switch,
	Menu,
	Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { SubMenu } = Menu;

export default function Revenue() {
	const [form] = Form.useForm();
	const [isEnabled, setIsEnabled] = useState(false);

	const toggleEnabled = (checked) => {
		setIsEnabled(checked);
		if (!checked) {
			form.resetFields();
		}
	};

	return (
		<React.StrictMode>
			<div
				style={{
					height: "700px",
					overflowY: "auto",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
				}}
			>
				<Form
					form={form}
					layout="vertical"
					style={{
						margin: "0",
					}}
				>
					<Space direction="vertical" size="large" style={{ width: "100%" }}>
						<Space
							align="center"
							style={{
								justifyContent: "space-between",
								width: "100%",
								padding: "24px",
								paddingBottom: "0",
								backgroundColor: "white",
								borderRadius: "20px",
							}}
						>
							<Title level={4}>Packages Name</Title>
							<Space>
								<span>Update</span>
								<Switch checked={isEnabled} onChange={toggleEnabled} />
							</Space>
						</Space>

						<Space
							size="large"
							direction="vertical"
							align="start"
							style={{
								width: "100%",
								padding: "24px",
								backgroundColor: "white",
								borderRadius: "20px",
							}}
						>
							<Space
								align="center"
								size={"large"}
								style={{ justifyContent: "space-between", width: "100%" }}
							>
								<Space direction="vertical">
									<Form.Item name="packageName" label="Package Name">
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item name="description" label="Description">
										<TextArea rows={4} disabled={!isEnabled} />
									</Form.Item>
								</Space>
								<Space direction="vertical">
									{/* <Form.Item name="packageImage" label="Image">
									<Input disabled={!isEnabled} />
								</Form.Item> */}
									<Card
										style={{ width: 300, height: 200 }}
										cover={
											<div
												style={{
													height: 200,
													background: "#f0f0f0",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Image
													width={300}
													height={200}
													src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
												/>
											</div>
										}
									/>
								</Space>
							</Space>
							<Space>
								<Form.Item name="validity" label="Validity">
									<DatePicker.RangePicker disabled={!isEnabled} />
								</Form.Item>
								<Form.Item name="destination" label="Destination">
									<Input disabled={!isEnabled} />
								</Form.Item>
							</Space>
							<Space>
								<Form.Item name="category" label="Category">
									<Select style={{ width: 120 }} disabled={!isEnabled}>
										<Option value="hotel">Hotel</Option>
										<Option value="flight">Flight</Option>
										<Option value="package">Package</Option>
									</Select>
								</Form.Item>
								<Form.Item name="createdAt" label="Created at">
									<DatePicker disabled={!isEnabled} />
								</Form.Item>
							</Space>
							<Space>
								<Form.Item name="dayNight" label="Day & Night">
									<Input disabled={!isEnabled} />
								</Form.Item>
								<Form.Item name="withFlightPrice" label="With Flight Price">
									<Input disabled={!isEnabled} />
								</Form.Item>
								<Form.Item
									name="withoutFlightPrice"
									label="Without Flight Price"
								>
									<Input disabled={!isEnabled} />
								</Form.Item>
							</Space>
							<Form.Item name="coupon" label="Coupon">
								<Select style={{ width: 120 }} disabled={!isEnabled}>
									<Option value="yes">Yes</Option>
									<Option value="no">No</Option>
								</Select>
							</Form.Item>
							<Form.Item name="benefits" label="Benefits">
								<Select
									mode="tags"
									style={{ width: "100%" }}
									disabled={!isEnabled}
								>
									<Option value="hotel">3 Star Hotel</Option>
									<Option value="flight">Flight Round</Option>
								</Select>
							</Form.Item>
						</Space>

						<Card
							title="Hotel"
							extra={
								<Button
									type="link"
									icon={<PlusOutlined />}
									disabled={!isEnabled}
								>
									Add
								</Button>
							}
						>
							<Space direction="vertical" style={{ width: "100%" }}>
								<Input
									placeholder="Hotel Regent Laguna"
									disabled={!isEnabled}
								/>
								<Input placeholder="Room Name" disabled={!isEnabled} />
								<Space>
									<Form.Item name="checkIn" label="Check-in">
										<DatePicker disabled={!isEnabled} />
									</Form.Item>
									<Form.Item name="checkOut" label="Check-out">
										<DatePicker disabled={!isEnabled} />
									</Form.Item>
								</Space>
							</Space>
						</Card>

						<Card
							title="Itinerary"
							extra={
								<Menu mode="horizontal" selectable={false}>
									<SubMenu key="day" title="Day 1">
										<Menu.Item key="add">Add Day</Menu.Item>
									</SubMenu>
								</Menu>
							}
						>
							<Space direction="vertical" style={{ width: "100%" }}>
								<Form.Item name="itineraryTitle" label="Title">
									<Input disabled={!isEnabled} />
								</Form.Item>
								<Form.Item name="itineraryPlan" label="Plan">
									<TextArea rows={2} disabled={!isEnabled} />
								</Form.Item>
								<Form.Item name="itineraryActivities" label="Activities">
									<Input disabled={!isEnabled} />
								</Form.Item>
								<Form.Item
									name="itineraryActivitiesHour"
									label="Activities Hour"
								>
									<Input disabled={!isEnabled} />
								</Form.Item>
								<Form.Item
									name="itineraryActivitiesAddress"
									label="Activities Address"
								>
									<Input disabled={!isEnabled} />
								</Form.Item>
								<Form.Item name="itineraryEndOfDayInfo" label="End of Day Info">
									<TextArea rows={2} disabled={!isEnabled} />
								</Form.Item>
							</Space>
						</Card>

						{isEnabled && (
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						)}
					</Space>
				</Form>
			</div>
		</React.StrictMode>
	);
}
