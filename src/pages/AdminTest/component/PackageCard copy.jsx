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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { SubMenu } = Menu;

// const tabList = [
// 	{
// 		key: "tab1",
// 		tab: "Description",
// 	},
// 	{
// 		key: "tab2",
// 		tab: "Hotel",
// 	},
// 	{
// 		key: "tab3",
// 		tab: "Benifits",
// 	},
// ];

const App = ({
	destination,
	// isModalOpen,
	// handleOk,
	// handleCancel,
	categorizedPackagesData,
}) => {
	const [form] = Form.useForm();
	const [isEnabled, setIsEnabled] = useState(false);

	const toggleEnabled = (checked) => {
		setIsEnabled(checked);
		if (!checked) {
			form.resetFields();
		}
	};
	const onChange = (currentSlide) => {
		console.log(currentSlide);
	};
	// const [activeTabKey1, setActiveTabKey1] = useState("tab1");

	// const onTab1Change = (key) => {
	// 	setActiveTabKey1(key);
	// };
	// console.log("categorizedPackagesData", categorizedPackagesData);
	// const contentList = {
	// 	tab1: (
	// 		<Flex vertical>
	// 			<Typography.Title level={5}>4N Kerla</Typography.Title>
	// 			<Typography.Text level={5}>Total Duration - 4N/5D</Typography.Text>
	// 			<Typography.Text level={5}>Price - 8000</Typography.Text>
	// 			<Typography.Text level={5}>
	// 				Coupon Code - CAPITALHUB(Extra ₹500 off)
	// 			</Typography.Text>
	// 		</Flex>
	// 	),
	// 	tab2: (
	// 		<Flex vertical>
	// 			<Typography.Title level={5}>Hotel Name - Kerla</Typography.Title>
	// 			<Flex vertical>
	// 				<Typography.Text level={5}>Rating - 4/5</Typography.Text>
	// 				<Typography.Text level={5}>Address - XYZ, Kerla</Typography.Text>
	// 			</Flex>
	// 			<Typography.Text level={5}>Images</Typography.Text>
	// 			<Flex gap={10}>
	// 				<Image
	// 					width={50}
	// 					height={50}
	// 					// style={{borderRadius: 10}}
	// 					src="https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1369/Capture%20the%20sunset%20views%20of%20Athirapally%20falls.jpg"
	// 				/>
	// 				<Image
	// 					width={50}
	// 					height={50}
	// 					src="https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1369/Capture%20the%20sunset%20views%20of%20Athirapally%20falls.jpg"
	// 				/>
	// 				<Image
	// 					width={50}
	// 					height={50}
	// 					src="https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1369/Capture%20the%20sunset%20views%20of%20Athirapally%20falls.jpg"
	// 				/>
	// 				<Image
	// 					width={50}
	// 					height={50}
	// 					src="https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1369/Capture%20the%20sunset%20views%20of%20Athirapally%20falls.jpg"
	// 				/>
	// 			</Flex>
	// 		</Flex>
	// 	),
	// 	tab3: (
	// 		<Flex vertical>
	// 			<Typography.Text level={5}>Round Trip Flights</Typography.Text>
	// 			<Typography.Text level={5}>Airport Transfer</Typography.Text>
	// 			<Typography.Text level={5}>1 Activity</Typography.Text>
	// 		</Flex>
	// 	),
	// };
	return (
		<>
			{/* <Modal
				title={destination}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				centered={true}
				width={1100}
			> */}
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
								<Title level={4}>{packageItem.name}</Title>
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
											<Input value={packageItem.name} disabled={!isEnabled} />
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
									<Form.Item
										name="itineraryEndOfDayInfo"
										label="End of Day Info"
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

					// <Flex vertical key={index}>
					// 	<Flex>
					// 		<Flex vertical style={{ width: "50%" }}>
					// 			<Typography.Title level={5}>
					// 				Package - {packageItem.name}
					// 			</Typography.Title>
					// 			<Image width="100%" height={250} src={packageItem.image} />
					// 		</Flex>
					// 		<Card
					// 			header={false}
					// 			style={{
					// 				width: "50%",
					// 			}}
					// 			bordered={false}
					// 			tabList={tabList}
					// 			activeTabKey={activeTabKey1}
					// 			onTabChange={onTab1Change}
					// 		>
					// 			{activeTabKey1 === "tab1" && (
					// 				<Flex vertical>
					// 					{/* <Typography.Title level={5}>4N Kerla</Typography.Title> */}
					// 					<Typography.Text level={5}>
					// 						Total Duration - {packageItem.totalDuration}
					// 					</Typography.Text>
					// 					<Typography.Text level={5}>
					// 						Price with Flight - {packageItem.witheFlitePrice}
					// 					</Typography.Text>
					// 					<Typography.Text level={5}>
					// 						Price with Flight - {packageItem.withoutFlitePrice}
					// 					</Typography.Text>
					// 					<Typography.Text level={5}>
					// 						{packageItem.couponCode}
					// 					</Typography.Text>
					// 				</Flex>
					// 			)}
					// 			{activeTabKey1 === "tab2" && (
					// 				<Flex gap={50} justify="space-betwwen">
					// 					<Flex vertical>
					// 						<Typography.Title level={5}>
					// 							Hotel Name - {packageItem.hotelId.hotelName}
					// 						</Typography.Title>
					// 						<Flex vertical>
					// 							<Typography.Text level={5}>
					// 								Rating - {packageItem.hotelId.rating}
					// 							</Typography.Text>
					// 							<Typography.Text level={5}>
					// 								Address - {packageItem.hotelId.address}
					// 							</Typography.Text>
					// 						</Flex>
					// 					</Flex>
					// 					{/* <Typography.Text level={5}>Images</Typography.Text> */}
					// 					<Flex gap={10}>
					// 						<Image
					// 							width={150}
					// 							height={100}
					// 							src={packageItem.hotelId.image}
					// 						/>
					// 					</Flex>
					// 				</Flex>
					// 			)}
					// 			{activeTabKey1 === "tab3" && (
					// 				<Flex vertical>
					// 					{packageItem.tripBenifit.map((benefit, index) => (
					// 						<Typography.Text level={5} key={index}>
					// 							{benefit}
					// 						</Typography.Text>
					// 					))}
					// 				</Flex>
					// 			)}
					// 		</Card>
					// 	</Flex>
					// 	<Card
					// 		header={false}
					// 		style={{
					// 			width: "40%",
					// 		}}
					// 		bordered={false}
					// 		tabList={tabList}
					// 		activeTabKey={activeTabKey1}
					// 		onTabChange={onTab1Change}
					// 	>
					// 		{activeTabKey1 === "tab1" && (
					// 			<Flex vertical>
					// 				{/* <Typography.Title level={5}>4N Kerla</Typography.Title> */}
					// 				<Typography.Text level={5}>
					// 					Total Duration - {packageItem.totalDuration}
					// 				</Typography.Text>
					// 				<Typography.Text level={5}>
					// 					Price with Flight - {packageItem.witheFlitePrice}
					// 				</Typography.Text>
					// 				<Typography.Text level={5}>
					// 					Price with Flight - {packageItem.withoutFlitePrice}
					// 				</Typography.Text>
					// 				<Typography.Text level={5}>
					// 					{packageItem.couponCode}
					// 				</Typography.Text>
					// 			</Flex>
					// 		)}
					// 		{activeTabKey1 === "tab2" && (
					// 			<Flex gap={50} justify="space-betwwen">
					// 				<Flex vertical>
					// 					<Typography.Title level={5}>
					// 						Hotel Name - {packageItem.hotelId.hotelName}
					// 					</Typography.Title>
					// 					<Flex vertical>
					// 						<Typography.Text level={5}>
					// 							Rating - {packageItem.hotelId.rating}
					// 						</Typography.Text>
					// 						<Typography.Text level={5}>
					// 							Address - {packageItem.hotelId.address}
					// 						</Typography.Text>
					// 					</Flex>
					// 				</Flex>
					// 				{/* <Typography.Text level={5}>Images</Typography.Text> */}
					// 				<Flex gap={10}>
					// 					<Image
					// 						width={150}
					// 						height={100}
					// 						src={packageItem.hotelId.image}
					// 					/>
					// 				</Flex>
					// 			</Flex>
					// 		)}
					// 		{activeTabKey1 === "tab3" && (
					// 			<Flex vertical>
					// 				{packageItem.tripBenifit.map((benefit, index) => (
					// 					<Typography.Text level={5} key={index}>
					// 						{benefit}
					// 					</Typography.Text>
					// 				))}
					// 			</Flex>
					// 		)}
					// 	</Card>
					// </Flex>
				))}
			</Carousel>
			{/* </Modal> */}
		</>
	);
};
export default App;
