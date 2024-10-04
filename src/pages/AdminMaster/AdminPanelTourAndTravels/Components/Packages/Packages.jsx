import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import {
	Flex,
	Typography,
	Card,
	Spin,
	Modal,
	Select,
	Table,
	Button,
} from "antd";
import { createStyles } from "antd-style";
const { Title } = Typography;
import { PlusOutlined } from "@ant-design/icons";
import PackageCard from "./Component/PackageCard/PackageCard";
import AddPackageForm from "./Component/PackageForm/AddPackageForm";

const useStyle = createStyles(({ css, token }) => {
	const { antCls } = token;
	return {
		customTable: css`
			${antCls}-table {
				${antCls}-table-container {
					${antCls}-table-body,
					${antCls}-table-content {
						scrollbar-width: thin;
						scrollbar-color: unset;
					}
				}
			}
		`,
	};
});

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
	const [destination, setDestination] = useState("");
	const { styles } = useStyle();
	const onDestinationChange = (value) => {
		setDestination(value);
	};

	useEffect(() => {
		const fetchAllPackages = async () => {
			setLoading(true);
			try {
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
				// console.log("itineryPlans", itineryPlans.data);
				setPackageData(itineryPlans.data);
				if (itineryPlans.data) {
					const categorized = itineryPlans.data.plans.reduce((acc, plan) => {
						// console.log("Processing plan:", plan);
						const destination = plan.destination;
						if (!acc[destination]) {
							acc[destination] = [];
						}
						acc[destination].push(plan);
						return acc;
					}, {});
					setCategorizedPackages(categorized);
				}
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchAllPackages();
	}, [openAddPackage]);

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

	const handleDestinationClick = (plan) => {
		setSelectedDestination(plan.destination);
		const selectedPackage = packageData.plans.find((p) => p._id === plan._id);
		setPackageDataForDestination(selectedPackage);
	};

	// const onChange = (value) => {
	// 	console.log(`selected ${value}`);
	// };
	const onSearch = (value) => {
		console.log("search:", value);
	};

	// categorizedPackages
	const options = [
		{ value: "All", label: "All" },
		...Object.keys(categorizedPackages).map((key) => ({
			value: key,
			label: key,
		})),
	];

	// Package table data
	const columns = [
		{
			title: "Sr. No.",
			dataIndex: "key",
			width: 150,
		},
		{
			title: "Package Name",
			dataIndex: "packageName",
			width: 150,
		},
		{
			title: "Destination",
			dataIndex: "destination",
			width: 150,
		},
		{
			title: "Total Duration",
			dataIndex: "totalDuration",
		},
		{
			title: "Hotel Type",
			dataIndex: "hotelType",
		},
		{
			title: "Price",
			dataIndex: "price",
		},
		{
			title: "Rating",
			dataIndex: "destinationRating",
		},
		{
			dataIndex: "action",
			key: "action",
			render: (text, record) => (
				<Button
					type="primary"
					onClick={() => handleDestinationClick(record.plan)}
				>
					Details
				</Button>
			),
		},
	];

	// console.log("packageData", packageData.plans);
	const data =
		packageData &&
		packageData.plans &&
		packageData.plans
			.filter((plan) =>
				destination
					? destination === "All"
						? true
						: plan.destination === destination
					: true
			)
			.map((plan, index) => ({
				key: index + 1,
				packageName: plan.packageId.name,
				destination: plan.destination,
				totalDuration: plan.packageId.totalDuration,
				hotelType: plan.room_name,
				price: plan.packageId.witheFlitePrice,
				destinationRating: plan.packageId.destinationID.rating,
				plan: plan,
			}));

	// console.log("data", data);

	return (
		<>
			<div
				style={{
					height: "700px",
					overflowY: "auto",
					scrollbarWidth: "none",
					"&::WebkitScrollbar": {
						display: "none",
					},
				}}
			>
				<Flex vertical gap={20}>
					<Title level={3}>Packages</Title>
					<Flex gap={20} vertical>
						<Flex gap={20}>
							{/* total packages */}
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
										{packageData.plans ? packageData.plans.length : "NA"}
									</Title>
								</Flex>
							</Card>
							{/* add package */}
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
							<Title level={3}>Plan your dream Vacation with our Custom Packages!</Title>
							{/* filter button for each destination */}
							<Select
								showSearch
								placeholder="Pick Your Dream Destination!"
								optionFilterProp="label"
								onChange={onDestinationChange}
								onSearch={onSearch}
								style={{ width: 300, boxShadow: "0 2px 10px #fff3e6" }}
							>
								{options.map((option, index) => (
									<Select.Option key={index} value={option.value}>
										{option.label}
									</Select.Option>
								))}
							</Select>
							{/* <Flex
								gap={20}
								style={{
									width: "100%",
									height: "160px",
									overflowX: "auto",
									scrollbarWidth: "none",
									"&::WebkitScrollbar": {
										display: "none",
									},
								}}
							>
								{packageData &&
									packageData.plans &&
									packageData.plans
										.filter((plan) =>
											destination
												? destination === "All"
													? true
													: plan.destination === destination
												: true
										)
										.map((plan, index) => (
											<Card
												key={index}
												style={{
													width: 140,
													height: 110,
													boxShadow: "0 2px 10px #fff3e6",
												}}
												onClick={() => handleDestinationClick(plan)}
											>
												<Flex vertical align="center">
													<Title
														level={5}
														style={{ textAlign: "center", width: "90px" }}
													>
														{plan.destination}
													</Title>
													<Title
														level={5}
														style={{
															// flex: 1,
															textAlign: "center",
															lineHeight: "30px",
															margin: "0",
															color: "#fd5901",
															fontWeight: "bold",
															// backgroundColor: "#fff3e6",
															// padding: "10px",
															width: "60px",
															height: "30px",
															borderRadius: "50%",
														}}
													>
														{plan && plan.packageId.totalDuration}
													</Title>
												</Flex>
											</Card>
										))}
							</Flex> */}
							<Table
								className={styles.customTable}
								columns={columns}
								dataSource={data}
								pagination={{
									pageSize: 50,
								}}
								scroll={{
									y: 55 * 5,
								}}
							/>
						</Flex>
					</Flex>
					{selectedDestination && (
						<PackageCard
							key={packageDataForDestination._id}
							destination={selectedDestination}
							packageData={packageDataForDestination}
							closePackage={setSelectedDestination}
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
							"&::WebkitScrollbar": {
								display: "none",
							},
						}}
					>
						<AddPackageForm closeForm={setOpenAddPackage} />
					</div>
				</Modal>
			</div>
		</>
	);
};

export default Packages;
