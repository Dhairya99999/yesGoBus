import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import {
	Flex,
	Typography,
	Card,
	Spin,
	Modal,
	Checkbox,
	Form,
	Input,
	Button,
} from "antd";
const { Title } = Typography;
import { PlusOutlined } from "@ant-design/icons";
import PackageCard from "./PackageCard";

const Packages = () => {
	const [selectedDestination, setSelectedDestination] = useState(null);
	const [openAddPackage, setOpenAddPackage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [packageData, setPackageData] = useState({});
	const [categorizedPackages, setCategorizedPackages] = useState({});
	const [packageDataForDestination, setPackageDataForDestination] = useState(
		[]
	);

	useEffect(() => {
		const fetchAllPackages = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${baseUrl}/api/admin/packages/getAllPackages`,
					{
						headers: {
							Authorization: `Bearer ${token}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();
				const itineryPlansResponse = await fetch(
					`${baseUrl}/api/admin/itineraryPlans/getAllItineraryPlans`,
					{
						headers: {
							Authorization: `Bearer ${token}`, // Assuming token is the correct variable
							"Content-Type": "application/json",
						},
					}
				);
				const itineryPlans = await itineryPlansResponse.json();
				console.log("data2", itineryPlans.data);
				console.log("data1", data.data);
				setPackageData(data.data);
				if (data.data) {
					// console.log("data is available.");
					const categorized = data.data.packages.reduce((acc, packageItem) => {
						// console.log("Processing package item:", packageItem);
						const destination = packageItem.destinationID.destination;
						if (!acc[destination]) {
							acc[destination] = [];
						}
						acc[destination].push(packageItem);
						return acc;
					}, {});
					// console.log("Categorized packages:", categorized);
					setCategorizedPackages(categorized);
				}
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchAllPackages();
	}, []);
	// useEffect(() => {
	// 	const fetchAllItineraries = async () => {
	// 		setLoading(true);
	// try {
	// 	const response = await fetch(
	// 		`${baseUrl}/api/admin/itineraryPlans/getAllItineraryPlans`,
	// 		{
	// 			headers: {
	// 				Authorization: `Bearer ${token}`, // Assuming token is the correct variable
	// 				"Content-Type": "application/json",
	// 			},
	// 		}
	// 	);
	// 	const itineryPlans = await response.json();
	// 	console.log("data", itineryPlans.data);
	// 			// setPackageData(data.data);
	// 			// if (data.data) {
	// 			// 	// console.log("data is available.");
	// 			// 	const categorized = data.data.packages.reduce((acc, packageItem) => {
	// 			// 		// console.log("Processing package item:", packageItem);
	// 			// 		const destination = packageItem.destinationID.destination;
	// 			// 		if (!acc[destination]) {
	// 			// 			acc[destination] = [];
	// 			// 		}
	// 			// 		acc[destination].push(packageItem);
	// 			// 		return acc;
	// 			// 	}, {});
	// 			// 	// console.log("Categorized packages:", categorized);
	// 			// 	setCategorizedPackages(categorized);
	// 			// }
	// 			setLoading(false);
	// 		} catch (error) {
	// 			setError(error.message);
	// 			setLoading(false);
	// 		}
	// 	};
	// 	fetchAllItineraries();
	// }, []);

	// console.log("packageData", packageData);
	// console.log("categorizedPackages", categorizedPackages);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (loading) {
		return (
			<Flex justify="center" align="center" style={{ height: "100vh" }}>
				<Spin size="large" />
			</Flex>
		); // Render a loading indicator when loading is true
	}

	const addpackageok = () => {
		setOpenAddPackage(false);
	};

	const addpackagecancel = () => {
		setOpenAddPackage(false);
	};

	const handleDestinationClick = (destination) => {
		setSelectedDestination(destination);
		// setIsModalOpen(true);
		const packagesForDestination = categorizedPackages[destination];
		setPackageDataForDestination(packagesForDestination);
	};

	const onFinish = (values) => {
		console.log("Success:", values);
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<>
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
				{/* <span>hello</span> */}
				<Flex vertical gap={20}>
					<Title level={3}>Packages</Title>
					<Flex gap={20} vertical>
						<Flex gap={20}>
							<Card
								style={{
									width: 140,
									height: 110,
									boxShadow: "0 2px 10px #fff3e6",
								}}
							>
								<Flex vertical align="center">
									<Title level={5}>Total Packge</Title>
									<Title
										level={5}
										style={{
											// flex: 1,
											textAlign: "center",
											lineHeight: "30px",
											margin: "0",
											color: "#fd5901",
											fontWeight: "bold",
											backgroundColor: "#fff3e6",
											// padding: "10px",
											width: "30px",
											height: "30px",
											borderRadius: "50%",
										}}
									>
										{/* {packageData.packages ? packageData.packages.length : "NA"} */}
									</Title>
								</Flex>
							</Card>
							<Card
								style={{
									width: 150,
									height: 110,
									boxShadow: "0 2px 10px #fff3e6",
								}}
								hoverable
								onClick={() => setOpenAddPackage(true)}
							>
								<Flex vertical align="center">
									<Title level={5}>Add Package</Title>
									<Title
										level={5}
										style={{
											// flex: 1,
											textAlign: "center",
											lineHeight: "30px",
											margin: "0",
											color: "#fd5901",
											fontWeight: "bold",
											backgroundColor: "#fff3e6",
											width: "30px",
											height: "30px",
											borderRadius: "50%",
										}}
									>
										<PlusOutlined />
									</Title>
								</Flex>
							</Card>
						</Flex>
						<Flex gap={20} vertical>
							<Title level={3}>Destination</Title>
							<Flex gap={20} wrap="wrap">
								{Object.keys(categorizedPackages).map((destination, index) => (
									<Card
										key={index}
										style={{
											width: 140,
											height: 110,
											boxShadow: "0 2px 10px #fff3e6",
										}}
										onClick={() => handleDestinationClick(destination)}
									>
										<Flex vertical align="center">
											<Title level={5}>{destination}</Title>
											<Title
												level={5}
												style={{
													// flex: 1,
													textAlign: "center",
													lineHeight: "30px",
													margin: "0",
													color: "#fd5901",
													fontWeight: "bold",
													backgroundColor: "#fff3e6",
													// padding: "10px",
													width: "30px",
													height: "30px",
													borderRadius: "50%",
												}}
											>
												{categorizedPackages[destination] &&
													categorizedPackages[destination].length}
											</Title>
										</Flex>
									</Card>
								))}
							</Flex>
						</Flex>
					</Flex>
					{selectedDestination && (
						<PackageCard
							destination={selectedDestination}
							categorizedPackagesData={packageDataForDestination}
						/>
					)}
				</Flex>

				{/* Model for add new package*/}
				<Modal
					title="Add Package"
					open={openAddPackage}
					onOk={addpackageok}
					onCancel={addpackagecancel}
					centered={true}
					footer={false}
					width={700}
				>
					<div
						style={{
							height: "500px",
							overflowY: "auto",
							scrollbarWidth: "none",
							"&::-webkit-scrollbar": {
								display: "none",
							},
						}}
					>
						<Form
							name="basic"
							labelCol={{
								span: 8,
							}}
							wrapperCol={{
								span: 16,
							}}
							style={{
								maxWidth: 600,
							}}
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
						>
							<Flex vertical>
								<div>
									<Flex vertical>
										<Form.Item
											label="Package Name"
											name="name"
											rules={[
												{
													required: true,
													message: "Please input your package name!",
												},
											]}
											// colon={true}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Total Duration"
											name="totalDuration"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
											// colon={true}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Price With Filter"
											name="withfilterprice"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Price Without Filter"
											name="withoutfilterprice"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Destination"
											name="destination"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Image"
											name="image"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Destination Rating"
											name="destinationrating"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Duration"
											name="duration"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
									</Flex>
									<Flex vertical>
										<Form.Item
											label="Starting Price"
											name="startingprice"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Hotel Name"
											name="hotelname"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Hotel Rating"
											name="hotelrating"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Hotel Name"
											name="hotelname"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Hotel Image"
											name="hotelimage"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Hotel Address"
											name="hoteladdress"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Hotel Full Address"
											name="hotelfulladdress"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label="Trip Benifits"
											name="tripbenifits"
											rules={[
												{
													required: true,
													// message: "Please input your package name!",
												},
											]}
										>
											<Input />
										</Form.Item>
									</Flex>
								</div>
								<Form.Item
									wrapperCol={{
										offset: 8,
										span: 16,
									}}
								>
									<Button type="primary" htmlType="submit">
										Submit
									</Button>
								</Form.Item>
							</Flex>
						</Form>
					</div>
				</Modal>
			</div>
		</>
	);
};

export default Packages;
