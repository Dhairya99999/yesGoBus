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
					<div key={index} className="package-card-container">
						<div className="card-header">
							<div className="card-header-title">
								<Title level={3}>{destination}</Title>
								<Title level={3}>
									Package Name :- {packageItem.packageId.name}
								</Title>
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

									<Text>Additional Info :- {packageItem.end_of_day_info}</Text>
									<Text>Hotel Type :- {packageItem.room_name}</Text>
									<Text>Coupon Code :- {packageItem.packageId.couponCode}</Text>
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
					</div>
				))}
			</Carousel>
		</>
	);
};

export default App;
