import { useState } from "react";
import "./PackageCard.scss";
import {
	Form,
	Input,
	Select,
	Space,
	Typography,
	Switch,
	Image,
	Carousel,
	DatePicker,
	Card,
	Button,
	Menu,
} from "antd";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const App = ({ destination, categorizedPackagesData, closePackage }) => {
	const [form] = Form.useForm();
	const [isEnabled, setIsEnabled] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const onFinish = (values) => {
		// setFormData(values);
		console.log("Form values:", values);
		// setIsEditable(false);
	};

	const toggleEnabled = (checked) => {
		setIsEnabled(!checked);
		// if (!checked) {
		// 	form.resetFields();
		// }
	};

	const onChange = (currentSlide) => {
		console.log(currentSlide);
	};

	return (
		<>
			<Carousel afterChange={onChange} dotPosition={"top"}>
				{categorizedPackagesData.map((packageItem, index) => (
					<div key={index} className="package-card-container">
						<Form form={form} onFinish={onFinish}>
							<div className="card-header">
								<div className="card-header-title">
									<Title level={3}>{destination}</Title>
									<Title level={3}>
										Package Name :- {packageItem.packageId.name}
									</Title>
									<Form.Item
										name={["packages", index, "packageName"]}
										label={"Package Name"}
										initialValue={`${packageItem.packageId.name}`}
									>
										<Input disabled={true} />
									</Form.Item>
								</div>
								<Space>
									<span>Update</span>
									<Switch checked={isEnabled} onChange={toggleEnabled} />
									<Button type="primary" onClick={() => closePackage(null)}>
										Close
									</Button>
								</Space>
							</div>
							<div className="package-card-body">
								<div className="body-top">
									<div className="description">
										<Title level={4}>Description</Title>

										<Text>
											Additional Info :- {packageItem.end_of_day_info}
										</Text>
										<Text>Hotel Type :- {packageItem.room_name}</Text>
										<Text>
											Coupon Code :- {packageItem.packageId.couponCode}
										</Text>
										<Text>
											Total Duration :- {packageItem.packageId.totalDuration}
										</Text>
										<Text>
											Destination Rating :-{" "}
											{packageItem.packageId.destinationID.rating}
										</Text>
										<Text>
											Starting Price :-{" "}
											{packageItem.packageId.destinationID.startingPrice}
										</Text>
										<Text>{packageItem.packageId.destinationID.tagline}</Text>
									</div>
									<div>
										<Image
											width={300}
											height={200}
											src={packageItem.packageId.image}
										/>
									</div>
								</div>
								<div className="body-main">
									<div className="hotel-details">
										<div className="left">
											<Title level={3}>Hotel Details</Title>
											<Text>Room Name :- {packageItem.hotelId.hotelName}</Text>
											<Text>Check In :- {packageItem.checkIn}</Text>
											<Text>Check Out :- {packageItem.checkOut}</Text>
											<Text>Address :- {packageItem.hotelId.address}</Text>
											<Text>
												Full Address :- {packageItem.hotelId.fullAddress}
											</Text>
											<Text>Rating :- {packageItem.hotelId.rating}</Text>{" "}
										</div>
										<div className="right">
											<Image
												width={300}
												height={200}
												src={packageItem.hotelId.image}
											/>
										</div>
									</div>
									<div className="plans-container">
										{packageItem.plans.map((plan, index) => (
											<div className="plans" key={index}>
												<div className="plan-title">
													<Title level={4}>Day {index + 1}</Title>
												</div>
												<div className="plan-body">
													<div className="left">
														<Title level={4}>{plan.title}</Title>
														<Text>Plan :- {plan.plan}</Text>
														<Text>Activity :- {plan.activities}</Text>
														<Text>
															Activity duration :- {plan.activitiesHoure}
														</Text>
														<Text>Day End With :- {plan.end_of_day_info}</Text>
													</div>
													<Image width={300} height={200} src={plan.image} />
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</Form>
					</div>
				))}
			</Carousel>
		</>
	);
};

export default App;

// import { useState } from "react";
// import "./PackageCard.scss";
// import { Form, Input, Space, Image, Carousel, Button } from "antd";

// const { TextArea } = Input;

// export default function Component({
// 	destination,
// 	categorizedPackagesData,
// 	closePackage,
// }) {
// 	const [form] = Form.useForm();
// 	const [isEditable, setIsEditable] = useState(false);
// 	const [formData, setFormData] = useState({});

// 	const toggleEditable = () => {
// 		setIsEditable(!isEditable);
// 		if (isEditable) {
// 			form.resetFields();
// 		} else {
// 			form.validateFields(); // validate fields when saving
// 		}
// 	};

// 	const onChange = (currentSlide) => {
// 		console.log(currentSlide);
// 	};

// const onFinish = (values) => {
// 	setFormData(values);
// 	console.log("Form values:", values);
// 	setIsEditable(false);
// };

// 	const inputStyle = {
// 		fontSize: "16px",
// 		fontWeight: 700,
// 	};

// 	return (
// 		<Form form={form} onFinish={onFinish}>
// 			<Carousel afterChange={onChange} dotPosition="top">
// 				{categorizedPackagesData.map((packageItem, index) => (
// 					<div key={index} className="package-card-container">
// 						<div className="card-header">
// 							<div className="card-header-title">
// 								<Form.Item
// 									name={["packages", index, "destination"]}
// 									initialValue={destination}
// 								>
// 									<Input style={inputStyle} />
// 								</Form.Item>
// <Form.Item
// 	name={["packages", index, "packageName"]}
// 	initialValue={`Package Name: ${packageItem.packageId.name}`}
// >
// 	<Input style={inputStyle} disabled={!isEditable} />
// </Form.Item>
// 							</div>
// 							<Space>
// 								<Button type="primary" onClick={toggleEditable}>
// 									{isEditable ? "Save" : "Update"}
// 								</Button>
// 								<Button type="primary" onClick={() => closePackage(null)}>
// 									Close
// 								</Button>
// 							</Space>
// 						</div>
// 						<div className="package-card-body">
// 							<div className="body-top">
// 								<div className="description">
// 									<Form.Item
// 										name={["packages", index, "additionalInfo"]}
// 										initialValue={`Additional Info: ${packageItem.end_of_day_info}`}
// 									>
// 										<TextArea style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 									<Form.Item
// 										name={["packages", index, "hotelType"]}
// 										initialValue={`Hotel Type: ${packageItem.room_name}`}
// 									>
// 										<Input style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 									<Form.Item
// 										name={["packages", index, "couponCode"]}
// 										initialValue={`Coupon Code: ${packageItem.packageId.couponCode}`}
// 									>
// 										<Input style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 									<Form.Item
// 										name={["packages", index, "totalDuration"]}
// 										initialValue={`Total Duration: ${packageItem.packageId.totalDuration}`}
// 									>
// 										<Input style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 									<Form.Item
// 										name={["packages", index, "destinationRating"]}
// 										initialValue={`Destination Rating: ${packageItem.packageId.destinationID.rating}`}
// 									>
// 										<Input style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 									<Form.Item
// 										name={["packages", index, "startingPrice"]}
// 										initialValue={`Starting Price: ${packageItem.packageId.destinationID.startingPrice}`}
// 									>
// 										<Input style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 									<Form.Item
// 										name={["packages", index, "tagline"]}
// 										initialValue={packageItem.packageId.destinationID.tagline}
// 									>
// 										<Input style={inputStyle} disabled={!isEditable} />
// 									</Form.Item>
// 								</div>
// 								<div>
// 									<Image
// 										width={300}
// 										height={200}
// 										src={packageItem.packageId.image}
// 									/>
// 								</div>
// 							</div>
// 							<div className="body-main">
// 								<div className="hotel-details">
// 									<div className="left">
// 										<Form.Item
// 											name={["packages", index, "roomName"]}
// 											initialValue={`Room Name: ${packageItem.hotelId.hotelName}`}
// 										>
// 											<Input style={inputStyle} disabled={!isEditable} />
// 										</Form.Item>
// 										<Form.Item
// 											name={["packages", index, "checkIn"]}
// 											initialValue={`Check In: ${packageItem.checkIn}`}
// 										>
// 											<Input style={inputStyle} disabled={!isEditable} />
// 										</Form.Item>
// 										<Form.Item
// 											name={["packages", index, "checkOut"]}
// 											initialValue={`Check Out: ${packageItem.checkOut}`}
// 										>
// 											<Input style={inputStyle} disabled={!isEditable} />
// 										</Form.Item>
// 										<Form.Item
// 											name={["packages", index, "address"]}
// 											initialValue={`Address: ${packageItem.hotelId.address}`}
// 										>
// 											<Input style={inputStyle} disabled={!isEditable} />
// 										</Form.Item>
// 										<Form.Item
// 											name={["packages", index, "fullAddress"]}
// 											initialValue={`Full Address: ${packageItem.hotelId.fullAddress}`}
// 										>
// 											<Input style={inputStyle} disabled={!isEditable} />
// 										</Form.Item>
// 										<Form.Item
// 											name={["packages", index, "rating"]}
// 											initialValue={`Rating: ${packageItem.hotelId.rating}`}
// 										>
// 											<Input style={inputStyle} disabled={!isEditable} />
// 										</Form.Item>
// 									</div>
// 									<div className="right">
// 										<Image
// 											width={300}
// 											height={200}
// 											src={packageItem.hotelId.image}
// 										/>
// 									</div>
// 								</div>
// 								<div className="plans-container">
// 									{packageItem.plans.map((plan, planIndex) => (
// 										<div className="plans" key={planIndex}>
// 											<div className="plan-title">
// 												<Form.Item
// 													name={["packages", index, "plans", planIndex, "day"]}
// 													initialValue={`Day ${planIndex + 1}`}
// 												>
// 													<Input style={inputStyle} disabled={!isEditable} />
// 												</Form.Item>
// 											</div>
// 											<div className="plan-body">
// 												<div className="left">
// 													<Form.Item
// 														name={[
// 															"packages",
// 															index,
// 															"plans",
// 															planIndex,
// 															"title",
// 														]}
// 														initialValue={plan.title}
// 													>
// 														<Input style={inputStyle} disabled={!isEditable} />
// 													</Form.Item>
// 													<Form.Item
// 														name={[
// 															"packages",
// 															index,
// 															"plans",
// 															planIndex,
// 															"plan",
// 														]}
// 														initialValue={`Plan: ${plan.plan}`}
// 													>
// 														<Input style={inputStyle} disabled={!isEditable} />
// 													</Form.Item>
// 													<Form.Item
// 														name={[
// 															"packages",
// 															index,
// 															"plans",
// 															planIndex,
// 															"activity",
// 														]}
// 														initialValue={`Activity: ${plan.activities}`}
// 													>
// 														<Input style={inputStyle} disabled={!isEditable} />
// 													</Form.Item>
// 													<Form.Item
// 														name={[
// 															"packages",
// 															index,
// 															"plans",
// 															planIndex,
// 															"activityDuration",
// 														]}
// 														initialValue={`Activity duration: ${plan.activitiesHoure}`}
// 													>
// 														<Input style={inputStyle} disabled={!isEditable} />
// 													</Form.Item>
// 													<Form.Item
// 														name={[
// 															"packages",
// 															index,
// 															"plans",
// 															planIndex,
// 															"dayEndInfo",
// 														]}
// 														initialValue={`Day End With: ${plan.end_of_day_info}`}
// 													>
// 														<Input style={inputStyle} disabled={!isEditable} />
// 													</Form.Item>
// 												</div>
// 												<Image width={300} height={200} src={plan.image} />
// 											</div>
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				))}
// 			</Carousel>
// 			<Form.Item>
// 				<Button type="primary" htmlType="submit" disabled={!isEditable}>
// 					Submit
// 				</Button>
// 			</Form.Item>
// 		</Form>
// 	);
// }
