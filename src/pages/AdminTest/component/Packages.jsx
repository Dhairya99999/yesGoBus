import { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
import { Flex, Typography, Card, Spin, Modal } from "antd";
const { Title } = Typography;
import { PlusOutlined } from "@ant-design/icons";
import PackageCard from "./PackageCard";
import AddPackageForm from "./AddPackageForm";

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
	const [isEditing, setIsEditing] = useState(false);

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

	const handleDestinationClick = (destination) => {
		setSelectedDestination(destination);
		const packagesForDestination = categorizedPackages[destination];
		setPackageDataForDestination(packagesForDestination);
	};

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
							"&::-webkit-scrollbar": {
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
