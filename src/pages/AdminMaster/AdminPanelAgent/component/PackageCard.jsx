import { useState } from "react";
import "./PackageCard.scss";
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
	Carousel,
	// Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { SubMenu } = Menu;

const App = ({ destination, categorizedPackagesData }) => {
	const [form] = Form.useForm();
	const [isEnabled, setIsEnabled] = useState(false);
	// const [categorizedPackagesDataState, setCategorizedPackagesDataState] =
	// 	useState(categorizedPackagesData);

	const toggleEnabled = (checked) => {
		setIsEnabled(checked);
		if (!checked) {
			form.resetFields();
		}
	};

	const onChange = (currentSlide) => {
		console.log(currentSlide);
	};

	return (
		<>
			<Carousel afterChange={onChange} dotPosition={"top"}>
				{categorizedPackagesData.map((packageItem, index) => (
					<Form
						key={index}
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
									borderRadius: "5px",
								}}
							>
								<Title level={4}>{destination}</Title>
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
										<Form.Item
											name="name"
											label="Package Name"
											initialValue={packageItem.name}
										>
											{/* <Input disabled={!isEnabled} /> */}
											<Typography.Text level={4} editable={isEnabled}>
												{packageItem.name}
											</Typography.Text>
										</Form.Item>
										<Form.Item
											name="description"
											label="Description"
											// initialValue={packageItem.description}
										>
											<TextArea rows={4} disabled={!isEnabled} />
										</Form.Item>
									</Space>
									<Space direction="vertical">
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
														src={packageItem.image}
													/>
												</div>
											}
										/>
									</Space>
								</Space>
								<Space>
									<Form.Item
										name="validity"
										label="Validity"
										initialValue={packageItem.validity}
									>
										{/* <DatePicker.RangePicker disabled={!isEnabled} /> */}
									</Form.Item>
									<Form.Item
										name="destination"
										label="Destination"
										initialValue={packageItem.destination}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
								</Space>
								<Space>
									<Form.Item
										name="category"
										label="Category"
										initialValue={packageItem.category}
									>
										<Select style={{ width: 120 }} disabled={!isEnabled}>
											<Option value="hotel">Hotel</Option>
											<Option value="flight">Flight</Option>
											<Option value="package">Package</Option>
										</Select>
									</Form.Item>
									<Form.Item
										name="createdAt"
										label="Created at"
										initialValue={packageItem.createdAt}
									>
										{/* <DatePicker disabled={!isEnabled} /> */}
									</Form.Item>
								</Space>
								<Space>
									<Form.Item
										name="dayNight"
										label="Day & Night"
										initialValue={packageItem.dayNight}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="withFlightPrice"
										label="With Flight Price"
										initialValue={packageItem.withFlightPrice}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="withoutFlightPrice"
										label="Without Flight Price"
										initialValue={packageItem.withoutFlightPrice}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
								</Space>
								<Form.Item
									name="coupon"
									label="Coupon"
									initialValue={packageItem.coupon}
								>
									<Select style={{ width: 120 }} disabled={!isEnabled}>
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>
								<Form.Item
									name="benefits"
									label="Benefits"
									initialValue={packageItem.benefits}
								>
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
									<Form.Item name="hotel" initialValue={packageItem.hotel}>
										<Input placeholder="Hotel Name" disabled={!isEnabled} />
									</Form.Item>
									<Space>
										<Form.Item
											name="checkIn"
											label="Check-in"
											initialValue={packageItem.checkIn}
										>
											{/* <DatePicker disabled={!isEnabled} /> */}
										</Form.Item>
										<Form.Item
											name="checkOut"
											label="Check-out"
											initialValue={packageItem.checkOut}
										>
											{/* <DatePicker disabled={!isEnabled} /> */}
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
									<Form.Item
										name="itineraryTitle"
										label="Title"
										initialValue={
											packageItem.itinerary && packageItem.itinerary.title
										}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="itineraryPlan"
										label="Plan"
										initialValue={
											packageItem.itinerary && packageItem.itinerary.plan
										}
									>
										<TextArea rows={2} disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="itineraryActivities"
										label="Activities"
										initialValue={
											packageItem.itinerary && packageItem.itinerary.activities
										}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="itineraryActivitiesHour"
										label="Activities Hour"
										initialValue={
											packageItem.itinerary &&
											packageItem.itinerary.activitiesHour
										}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="itineraryActivitiesAddress"
										label="Activities Address"
										initialValue={
											packageItem.itinerary &&
											packageItem.itinerary.activitiesAddress
										}
									>
										<Input disabled={!isEnabled} />
									</Form.Item>
									<Form.Item
										name="itineraryEndOfDayInfo"
										label="End of Day Info"
										initialValue={
											packageItem.itinerary &&
											packageItem.itinerary.endOfDayInfo
										}
									>
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
				))}
			</Carousel>
		</>
	);
};

export default App;
