import { useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import "./PackageCard.scss";
import {
	Flex,
	Form,
	Input,
	Button,
	Typography,
	Space,
	Image,
	message,
	Upload,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

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
					hotelName: values.hotelType,
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
					withoutFlitePrice: values.witoutFlitePrice,
					hotelId: values.hotelId,
					tripBenifit:
						(values.tripBenifit && values.tripBenifit.map((item) => item)) ||
						[],
					couponCode: values.couponCode,
				},
				Itinerary: {
					_id: values._id,
					destination: values.destination,
					checkIn: values.checkIn,
					checkOut: values.checkOut,
					room_name: values.roomName,
					end_of_day_info: values.end_of_day_info,
					additional_info: values.additionalInfo,
					hotelId: values.hotelId,
					packageId: values.packageId,
					plans: values.plans.map((plan) => ({
						title: plan.title,
						plan: plan.plan,
						activities: plan.activities,
						activitiesAddress: plan.activitiesAddress,
						activitiesHoure: plan.activitiesHoure,
						image: plan.image?.file?.thumbUrl,
						end_of_day_info: plan.end_of_day_info,
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
							<Form.Item
								name="end_of_day_info"
								label={"End of Day Info"}
								labelFontSize={16}
								initialValue={`${packageData.end_of_day_info}`}
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
							<Form.List
								name="tripBenifit"
								initialValue={packageData.packageId.tripBenifit}
							>
								{(fields, { add, remove }) => (
									<>
										{fields.map((field, index) => (
											<Form.Item key={index}>
												<Flex align="center">
													<Form.Item {...field} noStyle>
														<Input
															disabled={!isEditable}
															style={isEditable ? styleEnable : styleDisable}
															placeholder="Enter Trip Benifit"
														/>
													</Form.Item>
													{fields.length > 1 &&
														(isEditable ? (
															<MinusCircleOutlined
																className="ml-2"
																onClick={() => remove(field.name)}
															/>
														) : null)}
												</Flex>
											</Form.Item>
										))}
										{isEditable && (
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
										)}
									</>
								)}
							</Form.List>
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
							{/* {packageData.plans.map((plan, planIndex) => ( */}
							<Form.List name="plans" initialValue={packageData.plans}>
								{(fields, { add, remove }) => (
									<>
										{fields.map((field, index) => (
											<div className="plans" key={field.key}>
												<div className="plan-title">
													<Title level={4}>Day {index + 1}</Title>
												</div>
												{/* plans */}
												<div className="plan-body">
													<div className="left">
														{/* title */}
														<Form.Item
															name={[field.name, "title"]}
															label={"Title"}
															// initialValue={plan.title}
															style={{ marginBottom: "0" }}
														>
															<Input
																disabled={!isEditable}
																style={isEditable ? styleEnable : styleDisable}
																textarea={{
																	autoSize: { minRows: 1, maxRows: 3 },
																}}
															/>
														</Form.Item>
														{/* plan */}
														<Form.Item
															name={[field.name, "plan"]}
															label={"Plan"}
															// initialValue={plan.plan}
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
														{/* activities */}
														<Form.Item
															name={[field.name, "activities"]}
															label={"Activities"}
															style={{ marginBottom: "0" }}
														>
															<Input
																disabled={!isEditable}
																style={isEditable ? styleEnable : styleDisable}
															/>
														</Form.Item>
														{/* activity duration */}
														<Form.Item
															name={[field.name, "activitiesHoure"]}
															label={"Activity duration"}
															// initialValue={plan.activitiesHoure}
															style={{ marginBottom: "0" }}
														>
															<Input
																disabled={!isEditable}
																style={isEditable ? styleEnable : styleDisable}
															/>
														</Form.Item>
														{/* activity address */}
														<Form.Item
															name={[field.name, "activitiesAddress"]}
															label={"Activity Address"}
															// initialValue={plan.activitiesAddress}
															style={{ marginBottom: "0" }}
														>
															<Input
																disabled={!isEditable}
																style={isEditable ? styleEnable : styleDisable}
															/>
														</Form.Item>
														{/* end of day info */}
														<Form.Item
															name={[field.name, "end_of_day_info"]}
															label={"End Of Day Info"}
															// initialValue={plan.end_of_day_info}
															style={{ marginBottom: "0" }}
														>
															<Input
																disabled={!isEditable}
																style={isEditable ? styleEnable : styleDisable}
															/>
														</Form.Item>
													</div>
													{/* remove button */}
													{fields.length > 1 && isEditable && (
														<Button
															type="link"
															onClick={() => remove(field.name)}
															icon={<MinusCircleOutlined />}
														>
															Remove Plan
														</Button>
													)}
													{/* image */}
													{/* <Image width={300} height={200} src={plan.image} /> */}
													<Form.Item name={[field.name, "image"]}>
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
																// <img
																// 	src={field.image[0].thumbUrl}
																// 	alt="avatar"
																// 	style={{ width: "100%" }}
																// />
																<Image
																	width={300}
																	height={200}
																	src={field.image[0].thumbUrl || field.image}
																/>
															) : (
																isEditable && (
																	<div style={{ width: "50%", height: "50%" }}>
																		<PlusOutlined />
																		<div style={{ marginTop: 8 }}>Upload</div>
																	</div>
																)
															)}
														</Upload>
													</Form.Item>
													{/* <Form.Item name={[field.name, "image"]}>
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
															{field.image ? (
																<Image
																	width={300}
																	height={200}
																	src={field.image.file.thumbUrl || field.image}
																/>
															) : (
																isEditable && (
																	<div style={{ width: "50%", height: "50%" }}>
																		<PlusOutlined />
																		<div style={{ marginTop: 8 }}>Upload</div>
																	</div>
																)
															)}
														</Upload>
													</Form.Item> */}
												</div>
											</div>
										))}
										{/* add button */}
										{isEditable && (
											<Form.Item
												style={{
													marginBottom: "0",
													marginTop: "10px",
													width: "50%",
												}}
											>
												<Button
													type="dashed"
													onClick={() => add()}
													icon={<PlusOutlined />}
													block
												>
													Add Plan
												</Button>
											</Form.Item>
										)}
									</>
								)}
							</Form.List>
							{/* ))} */}
						</div>
					</div>
				</div>
			</Form>
		</div>
	);
};

export default PackageCard;
