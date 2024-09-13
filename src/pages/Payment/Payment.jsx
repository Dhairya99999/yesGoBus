import "./Payment.scss";
import {
	Navbar,
	RoutesTitle,
	BusBookingCardInfo,
	SimpleCard,
	Input,
	Button,
} from "../../components";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Popover, Spin, Button as AntButton } from "antd";
import { Modal } from "antd";
import { vrlBlockSeat, vrlBookSeat } from "../../api/vrlBusesApis";
import { srsBlockSeat, srsConfirmBooking } from "../../api/srsBusesApis";
import { verifyAgentCode } from "../../api/admin";
import axios from "axios";
// import {offer} from
import PassengerInput from "../../components/PassengerInput/PassengerInput";

const Payment = () => {
	const [loading, setLoading] = useState(false);
	const [agentCodeVerified, setAgentCodeVerified] = useState(true);
	const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
	const token = localStorage.getItem("token");
	if (!loggedInUser) {
		return <Navigate to="/login" replace />;
	}

	const [firstName, lastName] = loggedInUser.fullName.split(" ");
	const [loadingModalVisible, setLoadingModalVisible] = useState(false);

	const [userData, setUserData] = useState({
		firstName_0: firstName || "",
		lastName_0: lastName || "",
		age_0: loggedInUser.age || "",
		email: loggedInUser.email || "",
		mobile: loggedInUser.phoneNumber || "",
		gender_0: "M",
		idType: "PAN",
		agentCode: "",
		offerCode: "",
	});

	const [countdown, setCountdown] = useState(10);
	const [startCountdown, setStartCountdown] = useState(false);

	const updateCountdown = () => {
		if (countdown > 0) {
			setCountdown(countdown - 1);
		}
	};

	// get booking history for privious travellers
	const [bookingHistory, setBookingHistory] = useState([]);
	useEffect(() => {
		const getBookingHistory = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem("token");
				const { data: getBookingHistory } = await axios.get(
					`${
						import.meta.env.VITE_BASE_URL
					}/api/bookingHistory/getBookingHistory/${loggedInUser._id}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json", // Set the content type to JSON
						},
					}
				);
				// console.log(getBookingHistory.data[0]);
				setBookingHistory(getBookingHistory.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		getBookingHistory();
	}, []);

	useEffect(() => {
		if (startCountdown) {
			const countdownTimer = setInterval(updateCountdown, 1000);
			return () => {
				clearInterval(countdownTimer);
			};
		}
	}, [startCountdown, countdown]);

	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate();
	const location = useLocation();
	const {
		tripId,
		sourceCity,
		sourceCityId,
		destinationCity,
		destinationCityId,
		doj,
		pickUpTime,
		reachTime,
		travelTime,
		busType,
		busName,
		bookingDetails,
		cancellationPolicy,
		isVrl,
		ReferenceNumber,
		isSrs,
		scheduleId,
	} = location.state || {};
	//const [executed, setExecuted] = useState(false);
	const urlSearchParams = new URLSearchParams(window.location.search);
	const blockTicketId = urlSearchParams.get("blockTicketId");
	const bookingId = urlSearchParams.get("bookingId");
	const [passenger, setPassenger] = useState([]);
	const [open, setOpen] = useState(false);
	const paymentVerify = new URLSearchParams(location.search).has(
		"paymentVerify"
	);

	useEffect(() => {
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	}, []);
	useEffect(() => {
		const getBookingDetails = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem("token");
				const { data: getBookingDetails } = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/api/busBooking/getAllBookings/${
						loggedInUser._id
					}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json", // Set the content type to JSON
						},
					}
				);
				setPassenger(
					getBookingDetails?.data
						?.map((item) => {
							if (item.reservationSchema.length > 0 && item.reservationSchema) {
								return item.reservationSchema[0].paxDetails;
							}
							return undefined; // Ensure undefined is explicitly returned
						})
						.filter((item) => item !== undefined)
						.flat()
				);
				// const currentDate = new Date();
				// currentDate.setHours(0, 0, 0, 0);
				// const upcomingBookings = [];
				// const completedBookings = [];
				// const cancelledBookings = [];
				// getBookingDetails.data.forEach(booking => {
				//   const doj = new Date(booking.doj);
				//   doj.setHours(0, 0, 0, 0);
				//   if (doj >= currentDate && booking.bookingStatus === "paid") {
				//     upcomingBookings.push(booking);
				//   } else if (doj < currentDate && booking.bookingStatus === "paid") {
				//     completedBookings.push(booking);
				//   } else if (booking.bookingStatus === "cancelled") {
				//     cancelledBookings.push(booking);
				//   }
				// });

				// setBookingHosiery({
				//   upcoming: upcomingBookings,
				//   completed: completedBookings,
				//   cancelled: cancelledBookings
				// });
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		getBookingDetails();
	}, []);
	function convertMinutesToTime(minutes) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		//const journeyDay = Math.floor(hours / 24);
		const hour = hours % 24;
		const ampm = hour < 12 ? "am" : "pm";
		const displayHour = hour > 12 ? hour - 12 : hour;
		const formattedTime = `${displayHour.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")} ${ampm}`;
		return formattedTime;
	}

	//verify payment and book ticket
	useEffect(() => {
		try {
			const paymentVerification = async () => {
				setLoading(true);
				// get bookings
				const getBookingDetails = await axios.get(
					`${
						import.meta.env.VITE_BASE_URL
					}/api/busBooking/getBookingById/${bookingId}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json", // Set the content type to JSON
						},
					}
				);
				if (getBookingDetails.status === 200) {
					const merchantTransactionId =
						getBookingDetails?.data?.data.merchantTransactionId;

					// check payment status
					const checkPaymentStatus = await axios.get(
						`${
							import.meta.env.VITE_BASE_URL
						}/api/payment/checkPaymentStatus/${merchantTransactionId}`,
						{},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);

					if (checkPaymentStatus.data.code === "PAYMENT_SUCCESS") {
						// console.log(`Block Ticket ID: ${blockTicketId}`);

						if (getBookingDetails?.data?.data.isVrl) {
							const requestbody = {
								...getBookingDetails?.data?.data.reservationSchema[0],
							};
							let { data: vrlBookSeatResponse } = await vrlBookSeat(
								requestbody
							);
							vrlBookSeatResponse = vrlBookSeatResponse[0];
							if (vrlBookSeatResponse.Status === 1) {
								const { data: updatePaymentDetails } = await axios.patch(
									`${
										import.meta.env.VITE_BASE_URL
									}/api/busBooking/updateBooking/${bookingId}`,
									{
										bookingStatus: "paid",
										opPNR: vrlBookSeatResponse?.PNRNO,
										buspnr: vrlBookSeatResponse?.PNRNO,
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
											"Content-Type": "application/json", // Set the content type to JSON
										},
									}
								);
								if (updatePaymentDetails) {
									const mailBody = {
										fullName: updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerEmail,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									const sendMail = await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationEmail`,
										mailBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
									const fullName =
										updatePaymentDetails.data.reservationSchema[0].paxDetails[0]
											.paxName;
									//send sms
									const messageBody = {
										fullName:
											fullName || updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerPhone,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									const sendMessage = await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationMessage`,
										messageBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
								}
								setLoading(false);
								navigate(`/busbooking/payment/success?bookingId=${bookingId}`);
							} else {
								setLoading(false);
								navigate("/busbooking/payment/failure");
							}
						} else if (getBookingDetails?.data?.data.isSrs) {
							let srsBookSeatResponse = await srsConfirmBooking(blockTicketId);

							if (srsBookSeatResponse.result) {
								const { data: updatePaymentDetails } = await axios.patch(
									`${
										import.meta.env.VITE_BASE_URL
									}/api/busBooking/updateBooking/${bookingId}`,
									{
										bookingStatus: "paid",
										opPNR:
											srsBookSeatResponse?.result.ticket_details.operator_pnr,
										buspnr:
											srsBookSeatResponse?.result.ticket_details
												.travel_operator_pnr,
										cancellationPolicy:
											srsBookSeatResponse?.result.ticket_details
												.ts_cancellation_policies,
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
											"Content-Type": "application/json", // Set the content type to JSON
										},
									}
								);
								if (updatePaymentDetails) {
									const mailBody = {
										fullName: updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerEmail,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationEmail`,
										mailBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
									const fullName =
										updatePaymentDetails?.data.srsBlockSeatDetails.book_ticket
											.seat_details.seat_detail[0].name;
									//send sms
									const messageBody = {
										fullName:
											fullName || updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerPhone,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationMessage`,
										messageBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
								}
								setLoading(false);
								navigate(`/busbooking/payment/success?bookingId=${bookingId}`);
							} else {
								setLoading(false);
								navigate("/busbooking/payment/failure");
							}
						}
					} else {
						navigate("/busbooking/payment/failure");
						setLoading(false);
						// alert("Payment Failed");
					}
				}
			};
			if (paymentVerify) {
				paymentVerification();
			}
		} catch (error) {
			console.log(error);
			navigate("/busbooking/payment/failure");
			setLoading(false);
		}
	}, [paymentVerify]);

	function formatDate(dateString) {
		const options = { year: "numeric", month: "2-digit", day: "2-digit" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	//handle payment
	const handlePayment = async () => {
		//validate agent code
		if (!agentCodeVerified && userData.agentCode) {
			alert("Agent Code is invalid");
			return;
		}

		//validate input
		const errors = validateUserData();
		if (errors.femaleReserved === true) {
			setErrorMessage("Seat is reserved for ladies");
			return;
		}
		const str = Object.values(errors).join(", ");
		if (str) {
			setErrorMessage(str);
			return;
		}
		// if (Object.keys(errors).length > 0) {
		// 	alert("Please fill in all the passenger details.");
		// 	return;
		// }
		// for(const key in errors) {
		// 	setErrorMessage(errors[key]);
		// 	return;
		// }

		setStartCountdown(true);
		setLoadingModalVisible(true);
		localStorage.removeItem("bookingDetails");
		//seats data
		if (isVrl) {
			try {
				const totalPassenger = bookingDetails?.selectedSeats?.length;

				const seatAndGenderArray = bookingDetails?.selectedSeats?.map(
					(seat, index) => `${seat},${userData[`gender_${index}`]}`
				);
				const resultSeatString = seatAndGenderArray.join("|");
				const seatDetailsWithName = bookingDetails?.selectedSeats?.map(
					(seat, index) =>
						`${seat},${userData[`firstName_${index}`]},${userData.mobile},${
							userData[`age_${index}`]
						}`
				);
				const resultseatDetailsWithNameString = seatDetailsWithName.join("|");

				const blockSeatRequestBody = {
					referenceNumber: ReferenceNumber,
					passengerName: userData[`firstName_0`],
					seatNames: resultSeatString,
					email: userData.email,
					phone: userData.mobile,
					pickupID: parseInt(bookingDetails?.boardingPoint?.bpId),
					payableAmount: bookingDetails?.totalFare - bookingDetails?.gst,
					totalPassengers: totalPassenger,
				};
				console.log(blockSeatRequestBody);
				let { data: vrlBlockSeatResponse } = await vrlBlockSeat(
					blockSeatRequestBody
				);
				vrlBlockSeatResponse = vrlBlockSeatResponse[0];

				const seatObjects = bookingDetails?.selectedSeats?.map(
					(seatId, index) => {
						const title = userData[`gender_${index}`] === "M" ? "M" : "F";
						return {
							seatName: seatId + "," + title,
							paxName:
								userData[`firstName_${index}`] +
								" " +
								userData[`lastName_${index}`],
							mobileNo: userData.mobile,
							paxAge: userData[`age_${index}`],
							baseFare: bookingDetails?.seatFares[index],
							gstFare: bookingDetails?.seatTaxes[index],
							totalFare: bookingDetails?.seatTotalFares[index],
							idProofId: 0,
							idProofDetails: "",
						};
					}
				);
				const bookingReservationDetails = {
					referenceNumber: ReferenceNumber,
					passengerName: userData[`firstName_0`],
					seatNames: resultSeatString,
					email: userData.email,
					phone: userData.mobile,
					pickUpID: bookingDetails?.boardingPoint?.bpId,
					dropID: bookingDetails?.droppingPoint?.bpId,
					payableAmount: bookingDetails?.totalFare - bookingDetails?.gst,
					totalPassengers: totalPassenger,
					seatDetails: resultseatDetailsWithNameString,
					discount: 0,
					paxDetails: seatObjects,
					gstState: 0,
					gstCompanyName: "",
					gstRegNo: "",
					apipnrNo: vrlBlockSeatResponse.BlockID,
				};

				if (vrlBlockSeatResponse.Status === 1) {
					const { data: bookResponse } = await axios.post(
						`${import.meta.env.VITE_BASE_URL}/api/busBooking/bookBus`,
						{
							reservationSchema: bookingReservationDetails,
							blockKey: vrlBlockSeatResponse.BlockID,
							userId: loggedInUser._id,
							totalAmount: bookingDetails?.totalFare,
							busOperator: busName,
							busType: busType,
							selectedSeats: bookingDetails.selectedSeats?.join(", "),
							pickUpTime: pickUpTime,
							reachTime: reachTime,
							cancellationPolicy: cancellationPolicy,
							sourceCity: sourceCity,
							destinationCity: destinationCity,
							doj: doj,
							customerName: firstName,
							customerLastName: lastName,
							customerEmail: userData.email,
							customerPhone: userData.mobile,
							customerAddress: userData.address,
							isVrl: isVrl,
							boardingPoint: bookingDetails?.boardingPoint?.bpName,
							droppingPoint: bookingDetails?.droppingPoint?.bpName,
							driverNumber: bookingDetails?.boardingPoint?.number,
							agentCode: userData.agentCode,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);

					const checkAgent = await axios.get(
						`${import.meta.env.VITE_BASE_URL}/api/agent/isAgent/${
							loggedInUser.userId
						}`,
						{},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);

					if (checkAgent.data.isAgent) {
						setLoadingModalVisible(false);
						setStartCountdown(false);
						setCountdown(10);
						if (!checkAgent.data.isBookable) {
							alert("Max Limit Exceeded, Come back tomorrow");
							return;
						}
						const isConfirmed = window.confirm(
							"Do you want to confirm the booking?"
						);
						if (!isConfirmed) {
							return;
						}
						setLoading(true);
						// get bookings
						const getBookingDetails = await axios.get(
							`${import.meta.env.VITE_BASE_URL}/api/busBooking/getBookingById/${
								bookResponse.data._id
							}`,
							{},
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json", // Set the content type to JSON
								},
							}
						);
						if (getBookingDetails?.data?.data.isVrl) {
							const requestbody = {
								...getBookingDetails?.data?.data.reservationSchema[0],
							};
							let { data: vrlBookSeatResponse } = await vrlBookSeat(
								requestbody
							);
							vrlBookSeatResponse = vrlBookSeatResponse[0];
							if (vrlBookSeatResponse.Status === 1) {
								const { data: updatePaymentDetails } = await axios.patch(
									`${
										import.meta.env.VITE_BASE_URL
									}/api/busBooking/updateBooking/${bookResponse.data._id}`,
									{
										bookingStatus: "paid",
										opPNR: vrlBookSeatResponse?.PNRNO,
										buspnr: vrlBookSeatResponse?.PNRNO,
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
											"Content-Type": "application/json", // Set the content type to JSON
										},
									}
								);
								if (updatePaymentDetails) {
									const mailBody = {
										fullName: updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerEmail,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationEmail`,
										mailBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
									const fullName =
										updatePaymentDetails.data.reservationSchema[0].paxDetails[0]
											.paxName;
									//send sms
									const messageBody = {
										fullName:
											fullName || updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerPhone,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationMessage`,
										messageBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
								}
								setLoading(false);
								navigate(
									`/busbooking/payment/success?bookingId=${bookResponse.data._id}`
								);
							} else {
								setLoading(false);
								navigate("/busbooking/payment/failure");
							}
						}
						return;
					}

					const response = await axios.post(
						`${import.meta.env.VITE_BASE_URL}/api/payment/initiatePayment`,
						{
							amount: bookingDetails?.totalFare,
							redirectUrl: `https://yesgobus.com/busbooking/payment?blockTicketId=${vrlBlockSeatResponse.BlockID}&bookingId=${bookResponse.data._id}&paymentVerify=1`,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);

					if (response.status === 200) {
						// update merchantTransactionId
						const updatePaymentDetails = await axios.patch(
							`${import.meta.env.VITE_BASE_URL}/api/busBooking/updateBooking/${
								bookResponse.data._id
							}`,
							{
								merchantTransactionId: response.data.data.merchantTransactionId,
							},
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json", // Set the content type to JSON
								},
							}
						);
						if (updatePaymentDetails.status === 200) {
							setLoadingModalVisible(false);
							setStartCountdown(false);
							setCountdown(10);
							window.open(
								response.data.data.instrumentResponse.redirectInfo.url,
								"_blank",
								"noopener noreferrer"
							);
						}
					} else {
						setLoading(false);
						setStartCountdown(false);
						setCountdown(10);
						setErrorMessage("Please try with other seat or bus.");
					}
				} else {
					setLoadingModalVisible(false);
					setStartCountdown(false);
					setCountdown(10);
					setErrorMessage(vrlBlockSeatResponse.Message);
				}
			} catch (error) {
				setLoadingModalVisible(false);
				console.log(error);
				console.error("Something went wrong:", error);
			}
		}
		if (isSrs) {
			try {
				const seatObjects = bookingDetails?.selectedSeats?.map(
					(seatId, index) => {
						const isPrimary = index === 0;
						const title = userData[`gender_${index}`] === "M" ? "Mr" : "Ms";
						return {
							seat_number: seatId,
							fare: bookingDetails?.seatFares[index],
							title: title,
							name:
								userData[`firstName_${index}`] +
								" " +
								userData[`lastName_${index}`],
							age: userData[`age_${index}`],
							sex: userData[`gender_${index}`],
							is_primary: isPrimary,
							id_card_type: "1",
							id_card_number: "111111111",
							id_card_issued_by: "oneone",
						};
					}
				);

				const srsBlockSeatBody = {
					book_ticket: {
						seat_details: {
							seat_detail: seatObjects,
						},
						contact_detail: {
							mobile_number: userData.mobile,
							emergency_name: userData[`firstName_0`],
							email: userData.email,
						},
					},
					origin_id: sourceCityId,
					destination_id: destinationCityId,
					boarding_at: bookingDetails?.boardingPoint?.bpId,
					drop_of: bookingDetails?.droppingPoint?.bpId,
					no_of_seats: bookingDetails?.selectedSeats?.length,
					travel_date: doj,
					customer_company_gst: {
						name: "Yesgobus",
						gst_id: "T123DT",
						address: "Test",
					},
				};

				let srsBlockSeatResponse = await srsBlockSeat(
					scheduleId,
					srsBlockSeatBody
				);
				if (srsBlockSeatResponse.result) {
					const srsResponse = srsBlockSeatResponse.result.ticket_details;

					const { data: bookResponse } = await axios.post(
						`${import.meta.env.VITE_BASE_URL}/api/busBooking/bookBus`,
						{
							srsBlockSeatDetails: srsBlockSeatBody,
							blockKey: srsResponse.pnr_number,
							userId: loggedInUser._id,
							totalAmount: bookingDetails?.totalFare,
							busOperator: busName,
							busType: busType,
							selectedSeats: bookingDetails.selectedSeats?.join(", "),
							pickUpTime: pickUpTime,
							reachTime: reachTime,
							cancellationPolicy: cancellationPolicy,
							sourceCity: sourceCity,
							destinationCity: destinationCity,
							doj: doj,
							customerName: firstName,
							customerLastName: lastName,
							customerEmail: userData.email,
							customerPhone: userData.mobile,
							customerAddress: userData.address,
							isSrs: isSrs,
							boardingPoint: bookingDetails?.boardingPoint?.bpName,
							droppingPoint: bookingDetails?.droppingPoint?.bpName,
							driverNumber: bookingDetails?.boardingPoint?.number,
							agentCode: userData.agentCode,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);
					const checkAgent = await axios.get(
						`${import.meta.env.VITE_BASE_URL}/api/agent/isAgent/${
							loggedInUser.userId
						}`,
						{},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);

					if (checkAgent.data.isAgent) {
						setLoadingModalVisible(false);
						setStartCountdown(false);
						setCountdown(10);
						if (!checkAgent.data.isBookable) {
							alert("Max Limit Exceeded, Come back tomorrow");
							return;
						}
						const isConfirmed = window.confirm(
							"Do you want to confirm the booking?"
						);
						if (!isConfirmed) {
							return;
						}
						setLoading(true);
						// get bookings
						const getBookingDetails = await axios.get(
							`${import.meta.env.VITE_BASE_URL}/api/busBooking/getBookingById/${
								bookResponse.data._id
							}`,
							{},
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json", // Set the content type to JSON
								},
							}
						);
						if (getBookingDetails?.data?.data.isSrs) {
							let srsBookSeatResponse = await srsConfirmBooking(
								srsResponse.pnr_number
							);

							if (srsBookSeatResponse.result) {
								const { data: updatePaymentDetails } = await axios.patch(
									`${
										import.meta.env.VITE_BASE_URL
									}/api/busBooking/updateBooking/${bookResponse.data._id}`,
									{
										bookingStatus: "paid",
										opPNR:
											srsBookSeatResponse?.result.ticket_details.operator_pnr,
										buspnr:
											srsBookSeatResponse?.result.ticket_details
												.travel_operator_pnr,
										cancellationPolicy:
											srsBookSeatResponse?.result.ticket_details
												.ts_cancellation_policies,
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
											"Content-Type": "application/json", // Set the content type to JSON
										},
									}
								);
								if (updatePaymentDetails) {
									const mailBody = {
										fullName: updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerEmail,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationEmail`,
										mailBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);

									const fullName =
										updatePaymentDetails?.data.srsBlockSeatDetails.book_ticket
											.seat_details.seat_detail[0].name;

									//send sms
									const messageBody = {
										fullName:
											fullName || updatePaymentDetails?.data.customerName,
										sourceCity: updatePaymentDetails?.data.sourceCity,
										destinationCity: updatePaymentDetails?.data.destinationCity,
										seats: updatePaymentDetails?.data.selectedSeats,
										amount: updatePaymentDetails?.data.totalAmount,
										pickUpLocation: updatePaymentDetails?.data.boardingPoint,
										opPNR: updatePaymentDetails?.data.opPNR,
										doj:
											formatDate(updatePaymentDetails?.data.doj) +
											" " +
											updatePaymentDetails?.data.pickUpTime,
										to: updatePaymentDetails?.data.customerPhone,
										contact: updatePaymentDetails?.data?.driverNumber,
									};
									await axios.post(
										`${
											import.meta.env.VITE_BASE_URL
										}/api/busBooking/sendBookingConfirmationMessage`,
										messageBody,
										{
											headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json", // Set the content type to JSON
											},
										}
									);
								}
								setLoading(false);
								navigate(
									`/busbooking/payment/success?bookingId=${bookResponse.data._id}`
								);
							} else {
								setLoading(false);
								navigate("/busbooking/payment/failure");
							}
						}
						return;
					}

					const response = await axios.post(
						`${import.meta.env.VITE_BASE_URL}/api/payment/initiatePayment`,
						{
							amount: bookingDetails?.totalFare,
							redirectUrl: `https://yesgobus.com/busbooking/payment?blockTicketId=${srsResponse.pnr_number}&bookingId=${bookResponse.data._id}&paymentVerify=1`,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json", // Set the content type to JSON
							},
						}
					);

					if (response.status === 200) {
						// update merchantTransactionId
						const updatePaymentDetails = await axios.patch(
							`${import.meta.env.VITE_BASE_URL}/api/busBooking/updateBooking/${
								bookResponse.data._id
							}`,
							{
								merchantTransactionId: response.data.data.merchantTransactionId,
							},
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json", // Set the content type to JSON
								},
							}
						);
						if (updatePaymentDetails.status === 200) {
							setLoadingModalVisible(false);
							setStartCountdown(false);
							setCountdown(10);
							window.open(
								response.data.data.instrumentResponse.redirectInfo.url,
								"_blank",
								"noopener noreferrer"
							);
						}
					} else {
						setLoading(false);
						setStartCountdown(false);
						setCountdown(10);
						setErrorMessage("Please try with other seat or bus.");
					}
				} else {
					setLoadingModalVisible(false);
					setStartCountdown(false);
					setCountdown(10);
					setErrorMessage(srsBlockSeatResponse.response.message);
				}
			} catch (error) {
				setLoadingModalVisible(false);
				console.log(error);
				console.error("Something went wrong:", error);
			}
		} else if (!isSrs && !isVrl) {
			setLoadingModalVisible(false);
			setStartCountdown(false);
			setCountdown(10);
			setErrorMessage("Under Development...");
		}
	};

	const handleInputChange = (e) => {
		setOpen(true);
		setUserData((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	//validation
	const validateUserData = () => {
		const numberOfTravelers = bookingDetails?.selectedSeats?.length;
		const errors = {};
		for (let index = 0; index < numberOfTravelers; index++) {
			const firstNameKey = `firstName_${index}`;
			const lastNameKey = `lastName_${index}`;
			const ageKey = `age_${index}`;
			const genderKey = `gender_${index}`;

			if (!userData[firstNameKey]?.trim()) {
				errors[firstNameKey] = `First name for passenger ${
					index + 1
				} is required`;
			}
			if (!userData[lastNameKey]?.trim()) {
				errors[lastNameKey] = `Last name for passenger ${
					index + 1
				} is required`;
			}

			if (!userData[ageKey]?.toString().trim()) {
				errors[ageKey] = `Age for passenger ${index + 1} is required`;
			}
			if (!userData[genderKey]?.trim()) {
				errors[genderKey] = `Gender for passenger ${index + 1} is required`;
			}
			if (
				bookingDetails.ladiesSeat[index] === true &&
				userData[genderKey] === "M"
			) {
				errors.femaleReserved = true;
			}
			console.log("errors", errors);
		}

		if (!userData.email?.trim()) {
			errors.email = "Email is required";
		}

		if (!userData.mobile?.trim()) {
			errors.mobile = "Mobile is required";
		}
		// if (!userData.address?.trim()) {
		// 	errors.address = "Address is required";
		// }
		return errors;
	};

	const handleAgentCodeVerify = async () => {
		if (userData.agentCode === "") {
			setAgentCodeVerified(true);
			return;
		}
		try {
			console.log(userData.agentCode);
			const response = await verifyAgentCode(userData.agentCode);
			if (response.status === 200) {
				setAgentCodeVerified(true);
				alert("Agent code Verified");
			} else {
				setAgentCodeVerified(false);
				alert("Agent Code not found or Agent's Today's Max Limit Exceeded");
			}
		} catch (error) {
			console.error("Error", error);
		}
	};

	// function to handle checkbox change
	const handleTravellerSelect = (e, booking, index) => {
		const isChecked = e.target.checked;
		const travellerIndex = index;

		if (isChecked) {
			setUserData((prevUserData) => {
				const updatedData = {
					...prevUserData,
					[`firstName_${travellerIndex}`]:
						booking.travellerName.split(" ")[0] || "",
					[`lastName_${travellerIndex}`]:
						booking.travellerName.split(" ")[1] || "",
					[`age_${travellerIndex}`]: booking.travellerAge || "",
					[`gender_${travellerIndex}`]: booking.travellerGender || "",
				};
				console.log("Updated userData:", updatedData);
				return updatedData;
			});
		} else {
			setUserData((prevUserData) => ({
				...prevUserData,
				[`firstName_${travellerIndex}`]: "",
				[`lastName_${travellerIndex}`]: "",
				[`age_${travellerIndex}`]: "",
				[`gender_${travellerIndex}`]: "",
			}));
		}
	};

	return (
		<div className="Payment">
			<Navbar />
			{/* <BusRoute
        locationOne={sourceCity}
        locationTwo={destinationCity}
        departureDate={doj}
        returnDate={"- - -"}
      /> <hr />*/}

			<div className="payment-container">
				<div className="containerleft">
					<h5>Passenger Information</h5>

					<div className="reviewsCard">
						<div className="review-top">
							<div className="heading">
								<div className="review-heading">
									<div className="title">{busName}</div>
									<div className="ratings-container">
										<div className="rating-bar">
											<span className="rating">
												★ {(Math.random() * 1 + 4).toFixed(1)}
											</span>
											<span className="count">
												{Math.floor(Math.random() * 101) + 37} Reviews
											</span>
										</div>
									</div>
								</div>

								<div className="bus-details">{busType}</div>
							</div>
						</div>
						<div className="review-bottom">
							<div className="review-left">
								<div className="time-duration">
									<h4>{pickUpTime}</h4>
									<span>-</span>
									<h4>{reachTime}</h4>
								</div>
								<div className="from-duration-to">
									<h4>{sourceCity}</h4>
									<h4>{travelTime}</h4>
									<h4>{destinationCity}</h4>
								</div>
							</div>
							<div className="review-right" style={{ display: "flex" }}>
								<span>
									Seat Selected:
									{bookingDetails?.selectedSeats?.length}
								</span>
								<span>Seat No:{bookingDetails?.selectedSeats?.join(", ")}</span>
							</div>
						</div>
					</div>
					{/* 
					<div className="destinations">
						<SimpleCard
							text={"Boarding Pass Details"}
							date={
								isVrl
									? bookingDetails?.boardingPoint?.time
									: isSrs
									? bookingDetails?.boardingPoint?.time
									: convertMinutesToTime(bookingDetails?.boardingPoint?.time)
							}
							// locationOne={bookingDetails.boardingPoint.location}
							locationTwo={bookingDetails?.boardingPoint?.bpName}
						/>
						<SimpleCard
							text={"Drop Point Details"}
							date={
								isVrl
									? bookingDetails?.droppingPoint?.time
									: isSrs
									? bookingDetails?.droppingPoint?.time
									: convertMinutesToTime(bookingDetails?.droppingPoint?.time)
							}
							// locationOne={bookingDetails.droppingPoint.location}
							locationTwo={bookingDetails?.droppingPoint?.bpName}
						/>
					</div> */}

					<div className="contact-details">
						<div className="contact-heading">
							<h4>Contact Details</h4>
							<span>Your ticket and bus details will sent here</span>
						</div>
						<div className="contact-input">
							<input
								type="email"
								placeholder="Enter Email"
								name=""
								id=""
								className="email"
								value={userData.email || ""}
							/>

							<div className="input-container">
								<span>+91</span>
								<input
									type="number"
									placeholder="Mobile Number"
									name=""
									id=""
									className="number"
									value={userData.mobile || ""}
								/>
							</div>
							{/* <div className="input-container">
								<span>+91</span>
								<input
									type="number"
									placeholder="Alternate Number"
									name=""
									id=""
									className="number"
								/>
							</div> */}

							<div className="checkbox-container">
								<input type="checkbox" name="" id="" />
								<span>Send me the booking details on Whatsapp</span>
							</div>
						</div>
					</div>

					{/* Previous Travellers */}
					<div className="previousTravellersDetails">
						<h4>Booking for Previous Passengers</h4>
						<ul className="previousTravellers">
							{bookingHistory?.map((booking, index) => (
								<li key={booking._id} className="traveller">
									<input
										className="checkbox"
										type="checkbox"
										onChange={(e) => handleTravellerSelect(e, booking, index)}
									/>
									<table>
										<tbody>
											<tr>
												<td>{booking.travellerName}</td>
											</tr>
											{/* <tr>
												<td>{booking.travellerEmail}</td>
											</tr> */}
											<tr>
												<td>{booking.travellerPhoneNumber}</td>
											</tr>
										</tbody>
									</table>
								</li>
							))}
						</ul>
					</div>

					{/* Traveller details */}
					<div className="TravelerDetails">
						<h4>Add Passengers</h4>
						{bookingDetails?.selectedSeats?.map((seat, index) => (
							<div key={index} className="traveler-Details">
								<span>Passenger {index + 1}</span>
								<div className="detailsContainer">
									<Input
										className="input-element"
										title={"First Name *"}
										type={"text"}
										placeholder={"First name"}
										onChanged={(e) =>
											handleInputChange(e, `firstName_${index}`)
										}
										givenName={`firstName_${index}`}
										value={userData[`firstName_${index}`] || ""}
										required
									/>
									{userData[`firstName_${index}`] === "" && (
										<div style={{ color: "red" }}>First name is required</div>
									)}
									<Input
										className="input-element"
										title={"Last Name *"}
										type={"text"}
										placeholder={"Last name"}
										onChanged={(e) => handleInputChange(e, `lastName_${index}`)}
										givenName={`lastName_${index}`}
										value={userData[`lastName_${index}`] || ""}
										required
									/>
									{userData[`lastName_${index}`] === "" && (
										<div style={{ color: "red" }}>Last name is required</div>
									)}
									<div className="age-gender">
										<div className="ageContainer">
											<Input
												className="input-element"
												title={"Age *"}
												type={"number"}
												placeholder={"Enter Age"}
												onChanged={(e) => handleInputChange(e, `age_${index}`)}
												givenName={`age_${index}`}
												value={userData[`age_${index}`] || ""}
												required
											/>
											{userData[`age_${index}`] === "" && (
												<div style={{ color: "red" }}>Age is required</div>
											)}
										</div>
										<div className="genderContainer">
											<select
												name={`gender_${index}`}
												id={`gender_${index}`}
												value={userData[`gender_${index}`] || ""}
												onChange={(e) =>
													handleInputChange(e, `gender_${index}`)
												}
												required
											>
												<option value="">Gender</option>
												<option value="M">Male</option>
												<option value="F">Female</option>
											</select>
											{userData[`gender_${index}`] === "" && (
												<div style={{ color: "red" }}>Gender is required</div>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					{/* <div className="TravelerDetails">
						<h4>Add Passengers</h4>
						{bookingDetails?.selectedSeats?.map((seat, index) => (
							<div key={index} className="traveler-Details">
								<span>Passenger {index + 1}</span>
								<div className="detailsContainer">
									<Input
										className="input-element"
										title={"First Name *"}
										type={"text"}
										placeholder={"First name"}
										onChanged={(e) =>
											handleInputChange(e, `firstName_${index}`)
										}
										givenName={`firstName_${index}`}
										value={userData[`firstName_${index}`] || ""}
									/>
									<Input
										className="input-element"
										title={"Last Name *"}
										type={"text"}
										placeholder={"Last name"}
										onChanged={(e) => handleInputChange(e, `lastName_${index}`)}
										givenName={`lastName_${index}`}
										value={userData[`lastName_${index}`] || ""}
									/>
									<div className="age-gender">
										<Input
											className="input-element"
											title={"Age *"}
											type={"number"}
											placeholder={"Enter Age"}
											onChanged={(e) => handleInputChange(e, `age_${index}`)}
											givenName={`age_${index}`}
											value={userData[`age_${index}`] || ""}
										/>
										<div className="genderContainer">
											<select
												name={`gender_${index}`}
												id={`gender_${index}`}
												value={userData[`gender_${index}`] || ""}
												onChange={(e) =>
													handleInputChange(e, `gender_${index}`)
												}
											>
												<option value="">Gender</option>
												<option value="M">Male</option>
												<option value="F">Female</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						))}
					</div> */}

					{/* Traveller details */}
					{/* < className="details">
						<h4>Enter Traveller Details:</h4>
						{bookingDetails?.selectedSeats?.map((seat, index) => (
							<div key={index} className="travelerDetails">
								<h3 style={{ textAlign: "center" }}>
									Traveler {index + 1} | Seat {seat}
								</h3>
								<br />
								<div className="detailsContainer">
									<PassengerInput
										title="First Name *"
										suggestions={passenger}
										value={userData[`firstName_${index}`] || ""}
										loading={loading}
										userData={userData}
										//setLocationQuery={setLocationOneQuery}
										setUserData={setUserData}
										name1={`firstName_${index}`}
										name2={`lastName_${index}`}
										age={`age_${index}`}
										gender={`gender_${index}`}
									/>
									<Input
										title={"Last Name *"}
										type={"text"}
										placeholder={"Last name"}
										onChanged={(e) => handleInputChange(e, `lastName_${index}`)}
										givenName={`lastName_${index}`}
										value={userData[`lastName_${index}`] || ""}
									/>
									<Input
										title={"Age *"}
										type={"number"}
										placeholder={"Enter Age"}
										onChanged={(e) => handleInputChange(e, `age_${index}`)}
										givenName={`age_${index}`}
										value={userData[`age_${index}`] || ""}
									/>
									<div className="genderContainer">
										<label htmlFor={`gender_${index}`}>Gender *</label>
										<select
											name={`gender_${index}`}
											id={`gender_${index}`}
											value={userData[`gender_${index}`] || ""}
											onChange={(e) => handleInputChange(e, `gender_${index}`)}
										>
											<option value="">Select Gender</option>
											<option value="M">Male</option>
											<option value="F">Female</option>
											{/* <option value="O">Other</option> */}
					{/* </select>
									</div>
								</div>
							</div>
						))}
					</div>  */}

					{/* Agent Details */}
					{!loggedInUser.isAgent && (
						<div className="agent-details">
							<h4>Enter Agent Code (Optional)</h4>
							<div className="detailsContainer">
								<Input
									title={"Agent Code"}
									type={"text"}
									placeholder={"ys2tx7"}
									onChanged={handleInputChange}
									givenName={"agentCode"}
									value={userData.agentCode}
								/>
								{/* <Button
									text={`Verify`}
									onClicked={handleAgentCodeVerify}
									style={{ height: "40px" }}
								/> */}
								<button onClick={handleAgentCodeVerify}>Verify</button>
							</div>
						</div>
					)}

					{/* Offer Code */}
					<div className="agent-details">
						<h4>Enter Offer Code (Optional)</h4>
						<div className="detailsContainer">
							<Input
								title={"Offer Code"}
								type={"text"}
								placeholder={"YGBNEW"}
								onChanged={handleInputChange}
								givenName={"offerCode"}
								value={userData.offerCode}
							/>
							<button>Verify</button>
						</div>
					</div>

					{/* Picode Details */}
					{/* <div className="details">
            <div class="label-container">
              <span>Enter ID Proof</span>
              <label className="optional">*optional</label>
            </div>
            <div className="detailsContainer">
              <div className="genderContainer">
                <label htmlFor="gender">ID Type</label>
                <select
                  name="idType"
                  id="idType"
                  value={userData.idType}
                  onChange={handleInputChange}
                >
                  <option value="PAN">Pan</option>
                  <option value="AADHAAR">Aadhaar</option>
                </select>
              </div>
              <Input
                title={"ID Number"}
                type={"text"}
                placeholder={"ID Number"}
                onChanged={handleInputChange}
                givenName={"idNumber"}
              />
            </div>
          </div> */}

					{/* Trip Type */}
					{/* <div className="tripType">
            <span>Trip Type</span>
            <hr />
            <div className="checks">
              <div>
                <input
                  className="checkbox-round"
                  type="checkbox"
                  id="checkOne"
                />
                <label htmlFor="checkOne">Personal</label>
              </div>
              <div>
                <input
                  className="checkbox-round"
                  type="checkbox"
                  id="checkTwo"
                />
                <label htmlFor="checkTwo">Business</label>
              </div>
            </div>
          </div> */}
				</div>

				{/* Payment section */}
				<div className="containerright">
					<div className="paymentCard">
						<h2>Price</h2>

						<div className="prices">
							<div className="price">
								<p>Total:</p>
								<p>₹{parseFloat(bookingDetails?.totalFare).toFixed(2)}</p>
							</div>
							<div className="fare-breakdown">
								<Popover
									content={() => {
										return (
											<>
												<div className="price flex items-center justify-between">
													<p>Total Basefare</p>
													<p>
														{"₹" + parseFloat(bookingDetails?.fare).toFixed(2)}
													</p>
												</div>
												<hr className="border-none h-[1px] bg-[#dadada]" />
												{bookingDetails?.serviceTax !== 0 && (
													<>
														<div className="price flex items-center justify-between">
															<p>Service Tax</p>
															<p>
																₹
																{parseFloat(bookingDetails?.serviceTax).toFixed(
																	2
																)}
															</p>
														</div>
														<hr className="border-none h-[1px] bg-[#dadada]" />
													</>
												)}

												{bookingDetails?.operatorTax !== 0 && (
													<>
														<div className="price flex items-center justify-between">
															<p>Operator Tax</p>
															<p>
																₹
																{parseFloat(
																	bookingDetails?.operatorTax
																).toFixed(2)}
															</p>
														</div>
														<hr className="border-none h-[1px] bg-[#dadada]" />
													</>
												)}

												<div className="price flex items-center justify-between">
													<p>Total</p>
													<p>
														₹{parseFloat(bookingDetails?.totalFare).toFixed(2)}
													</p>
												</div>
												<hr className="border-none h-[1px] bg-[#dadada]" />
											</>
										);
									}}
									title="Fare Breakdown"
									trigger="click"
									overlayStyle={{
										minWidth: "250px",
									}}
									placement="bottom"
								>
									<AntButton type="link" style={{ paddingInline: "0" }}>
										<span className="text-primary hover:underline">
											Show Fare Breakdown
										</span>
									</AntButton>
								</Popover>
							</div>
						</div>
					</div>

					{/* <div className="price">
							<p>Total Basefare</p>
							<p>{"₹" + parseFloat(bookingDetails?.fare).toFixed(2)}</p>
						</div>
						<hr /> */}

					{/* {bookingDetails?.serviceTax !== 0 && (
							<>
								<div className="price">
									<p>Service Tax</p>
									<p>₹{parseFloat(bookingDetails?.serviceTax).toFixed(2)}</p>
								</div>
								<hr />
							</>
						)} */}

					{/* {bookingDetails?.operatorTax !== 0 && (
							<>
								<div className="price">
									<p>Operator Tax</p>
									<p>₹{parseFloat(bookingDetails?.operatorTax).toFixed(2)}</p>
								</div>
								<hr />
							</>
						)} */}

					{/* GST */}
					{/* <div className="price">
							<p>GST</p>
							<p>₹{parseFloat(bookingDetails?.gst).toFixed(2)}</p>
						</div> */}
					{/* </div> */}
					<Button
						text={`Pay Amount ₹${parseFloat(bookingDetails?.totalFare).toFixed(
							2
						)}`}
						onClicked={handlePayment}
						style={{ height: "50px", width: "100%", borderRadius: "0" }}
					/>
				</div>
			</div>

			{/* <div className="paymentCard">
					<h2>OFFERS</h2>
					<div className="promo">
						<div className="heading">
							<img src={offer} alt="" />
							<p>Enter Promo Code</p>
						</div>
						<hr />
						<input type="text" name="" id="" placeholder="Enter your code" />
					</div>
				</div> */}
			{/* <div className="popularBusRoutes">
				<Title title={"Popular Bus Routes"} subtitle={"View More"} />

				<div className="popularBusRoutesContainer">
					<PopularRoutes busname={"Mumbai Bus"} to={"Goa, Pune, Bangalore"} />
					<PopularRoutes
						busname={"Hyderabad Bus"}
						to={"Ananthapur, Kurnool, Shadnagar"}
					/>
					<PopularRoutes
						busname={"Chennai Bus"}
						to={"Bangarapet, Jolarpettai, Katpadi"}
					/>
					<PopularRoutes
						busname={"Trivandrum Bus"}
						to={"Salem, Coimbatore, Kochi"}
					/>
					<PopularRoutes
						busname={"Mangalore Bus"}
						to={"Kunigal, Hassan, Sakaleshpura"}
					/>
				</div>
			</div> */}

			{loading ? (
				<div className="loading-spinner">
					<Spin size="large" />
				</div>
			) : null}
			<Modal
				open={loadingModalVisible}
				closable={false}
				footer={null}
				centered
				maskClosable={false}
				className="loading-modal"
			>
				<p className="loading-message">
					Loading... Taking you to the payment page in {countdown} seconds.
				</p>
			</Modal>
			{errorMessage && (
				<div className="modal" onClick={() => setErrorMessage("")}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<p className="error-message">{errorMessage}</p>
						<span className="close" onClick={() => setErrorMessage("")}>
							Close
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Payment;
