import { useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import "./PackageCard.scss";
import { Form, Input, Button, Typography, Space, Image } from "antd";

const { Title } = Typography;

const PackageCard = ({ destination, packageData, closePackage }) => {
	// console.log("packageData", packageData);
	const [form] = Form.useForm();
	const [isEditable, setIsEditable] = useState(false);

	const toggleEditable = () => {
		if (isEditable) {
			const values = form.getFieldsValue();
			console.log("values", values);

			const formData = {
				Hotel: {
					_id: values.hotelId,
					hotelName: values.roomName,
					rating: values.rating,
					// image: values.roomName,
					address: values.address,
					fullAddress: values.fullAddress,
					destination: values.destination,
				},
				Package: {
					_id: values.packageId,
					hotelName: values.roomName,
					// image: values.image,
					destinationId: values.destinationId,
					destination: values.destination,
					duration: values.duration,
					totalDuration: values.totalDuration,
					witheFlitePrice: values.witheFlitePrice,
					withoutFlitePrice: values.withoutFlitePrice,
					hotelId: values.hotelId,
					tripBenifits:
						(values.tripBenifits &&
							values.tripBenifits.map((item) => [item])) ||
						[],
					couponCode: values.couponCode,
				},
				Itinerary: {
					_id: values._id,
					destination: values.destination,
					checkIn: values.checkIn,
					checkOut: values.checkOut,
					room_name: values.checkIn,
					end_of_day_info: values.checkIn,
					additional_info: values.checkIn,
					hotelId: values.hotelId,
					packageId: values.packageId,
					plans: values.plans.map((plan) => ({
						title: plan.title,
						plan: plan.plan,
						activities: plan.activities,
						activitiesAddress: plan.activitiesAddress,
						activitiesHour: plan.activitiesHour,
						image: plan.image?.[0]?.thumbUrl,
						endOfDayInfo: plan.endOfDayInfo,
					})),
				},
			};
			console.log("formData", formData);
			updateItinerary(formData);
		}
		setIsEditable(!isEditable);
	};

	const updateItinerary = async (formData) => {
		// console.log(formData);
		// make an API call to update user on /api/user/updateProfile:userId

		try {
			const { data: itineraryPlans } = await axios.post(
				`${baseUrl}/api/admin/itineraryPlans/updateItineraryPlanHotelAndPackage`,
				{
					formData,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (itineraryPlans.status === 200) {
				JSON.stringify(itineraryPlans?.data);
				// alert("Profile Updated");
				console.log("itineraryPlans", itineraryPlans.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const styleEnable = {
		backgroundColor: "white",
		borderTop: "none",
		borderRight: "none",
		borderLeft: "none",
		borderBottom: "1px solid green",
		color: "grey",
	};

	const styleDisable = {
		backgroundColor: "white",
		borderTop: "none",
		borderRight: "none",
		borderLeft: "none",
		borderBottom: "none",
		color: "black",
	};

	return (
		<div className="package-card-container">
			<Form form={form}>
				<div className="card-header">
					<div className="card-header-title">
						<Title level={3}>{destination}</Title>
						<Form.Item
							name="packageName"
							label="Package Name"
							labelFontSize={18}
							initialValue={packageData.packageId.name}
						>
							<Input
								disabled={!isEditable}
								style={isEditable ? styleEnable : styleDisable}
							/>
						</Form.Item>
						<Form.Item
							name="packageId"
							initialValue={packageData.packageId._id}
							hidden={true}
						>
							<Input />
						</Form.Item>
						<Form.Item name="_id" initialValue={packageData._id} hidden={true}>
							<Input />
						</Form.Item>
						<Form.Item
							name="hotelId"
							initialValue={packageData.hotelId._id}
							hidden={true}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="destinationId"
							initialValue={packageData.packageId.destinationID._id}
							hidden={true}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="destination"
							initialValue={packageData.packageId.destination}
							hidden={true}
						>
							<Input />
						</Form.Item>
					</div>
					<Space>
						<Button type="primary" onClick={() => toggleEditable()}>
							{isEditable ? "Save" : "Update"}
						</Button>
						<Button type="primary" onClick={() => closePackage(null)}>
							Close
						</Button>
					</Space>
				</div>
				<div className="package-card-body">
					<div className="body-top">
						<div className="description">
							<Title level={4}>Description</Title>
							<Form.Item
								name="additionalInfo"
								label={"Additional Info"}
								labelFontSize={16}
								initialValue={`${packageData.end_of_day_info}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>
							<Form.Item
								name="hotelType"
								label={"Hotel Type"}
								labelFontSize={16}
								initialValue={`${packageData.room_name}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>
							<Form.Item
								name="couponCode"
								label={"Coupon Code"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.couponCode}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>

							<Form.Item
								name="totalDuration"
								label={"Total Duration"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.totalDuration}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>

							<Form.Item
								name="destinationRating"
								label={"Destination Rating"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.destinationID.rating}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>

							<Form.Item
								name="startingPrice"
								label={"Starting Price"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.destinationID.startingPrice}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>

							<Form.Item
								name="tagLine"
								label={"tag Line"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.destinationID.tagline}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>
							<Form.Item
								name="duration"
								label={"Duration"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.duration}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>
							<Form.Item
								name="witheFlitePrice"
								label={"With Flight Price"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.witheFlitePrice}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>
							<Form.Item
								name="witoutFlitePrice"
								label={"Without Flight Price"}
								labelFontSize={16}
								initialValue={`${packageData.packageId.withoutFlitePrice}`}
								style={{ marginBottom: "0" }}
							>
								<Input
									disabled={!isEditable}
									style={isEditable ? styleEnable : styleDisable}
								/>
							</Form.Item>
						</div>
						<div>
							<Title level={5}>Trip Benifit</Title>
							{packageData.packageId.tripBenifit.map((item, benefitIndex) => (
								<div key={benefitIndex}>
									<Form.Item
										name={["tripBenifits", benefitIndex, "benifit"]}
										initialValue={item}
										key={`tripBenifit-${benefitIndex}`} // Add a unique fieldKey
										style={{ marginBottom: "0" }}
									>
										<Input
											disabled={!isEditable}
											style={isEditable ? styleEnable : styleDisable}
										/>
									</Form.Item>
								</div>
							))}
						</div>
						<div>
							<Image
								width={300}
								height={200}
								src={packageData.packageId.image}
							/>
						</div>
					</div>
					<div className="body-main">
						<div className="hotel-details">
							<div className="left">
								<Title level={3}>Hotel Details</Title>

								<Form.Item
									name="roomName"
									label={"Room Name"}
									initialValue={packageData.hotelId.hotelName}
									style={{ marginBottom: "0" }}
								>
									<Input
										disabled={!isEditable}
										style={isEditable ? styleEnable : styleDisable}
									/>
								</Form.Item>
								<Form.Item
									name="checkIn"
									label={"Check In"}
									initialValue={packageData.checkIn}
									style={{ marginBottom: "0" }}
								>
									<Input
										disabled={!isEditable}
										style={isEditable ? styleEnable : styleDisable}
									/>
								</Form.Item>

								<Form.Item
									name="checkOut"
									label={"Check Out"}
									initialValue={packageData.checkOut}
									style={{ marginBottom: "0" }}
								>
									<Input
										disabled={!isEditable}
										style={isEditable ? styleEnable : styleDisable}
									/>
								</Form.Item>

								<Form.Item
									name="address"
									label={"Address"}
									initialValue={packageData.hotelId.address}
									style={{ marginBottom: "0" }}
								>
									<Input
										disabled={!isEditable}
										style={isEditable ? styleEnable : styleDisable}
									/>
								</Form.Item>

								<Form.Item
									name="fullAddress"
									label={"Full Address"}
									initialValue={packageData.hotelId.fullAddress}
									style={{ marginBottom: "0" }}
								>
									<Input
										disabled={!isEditable}
										style={isEditable ? styleEnable : styleDisable}
									/>
								</Form.Item>

								<Form.Item
									name="rating"
									label={"Rating"}
									initialValue={packageData.hotelId.rating}
									style={{ marginBottom: "0" }}
								>
									<Input
										disabled={!isEditable}
										style={isEditable ? styleEnable : styleDisable}
									/>
								</Form.Item>
							</div>
							<div className="right">
								<Image
									width={300}
									height={200}
									src={packageData.hotelId.image}
								/>
							</div>
						</div>
						<div className="plans-container">
							{packageData.plans.map((plan, planIndex) => (
								<div className="plans" key={planIndex}>
									<div className="plan-title">
										<Title level={4}>Day {planIndex + 1}</Title>
									</div>
									<div className="plan-body">
										<div className="left">
											<Title level={4}>{plan.title}</Title>
											<Form.Item
												name={["plans", planIndex, "plan"]}
												label={"Plan"}
												initialValue={plan.plan}
												style={{ marginBottom: "0" }}
											>
												<Input.TextArea
													disabled={!isEditable}
													style={isEditable ? styleEnable : styleDisable}
													textarea={{
														autoSize: { minRows: 1, maxRows: 3 },
													}}
												/>
											</Form.Item>
											<Form.Item
												name={["plans", planIndex, "activity"]}
												label={"Activity"}
												initialValue={plan.activities}
												style={{ marginBottom: "0" }}
											>
												<Input
													disabled={!isEditable}
													style={isEditable ? styleEnable : styleDisable}
												/>
											</Form.Item>
											<Form.Item
												name={["plans", planIndex, "activityDuration"]}
												label={"Activity duration"}
												initialValue={plan.activitiesHoure}
												style={{ marginBottom: "0" }}
											>
												<Input
													disabled={!isEditable}
													style={isEditable ? styleEnable : styleDisable}
												/>
											</Form.Item>
											<Form.Item
												name={["plans", planIndex, "dayEndWith"]}
												label={"Day End With"}
												initialValue={plan.end_of_day_info}
												style={{ marginBottom: "0" }}
											>
												<Input
													disabled={!isEditable}
													style={isEditable ? styleEnable : styleDisable}
												/>
											</Form.Item>
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
	);
};

export default PackageCard;
