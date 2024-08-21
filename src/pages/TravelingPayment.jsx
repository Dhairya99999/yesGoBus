//import { useState, useEffect } from "react";
import { Button } from "../components";
// import { useNavigate,useParams } from "react-router-dom";
// import axios from "axios";

const TravelingPayment = () => {
  // const navigate = useNavigate()
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const {bookingId} = useParams();
  // const paymentVerify = new URLSearchParams(location.search).has(
  //   "paymentVerify"
  // );
  // console.log(paymentVerify)
  // const [bookingData, setBookingData] = useState({});
  // useEffect(() => {
  //   const getBooking = async () => {
  //     const res = await axios.post(
  //       "https://yesgobus-backend.onrender.com/booking/get_booking",
  //       {
  //         bookingId,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     setBookingData(res.data.data.booking);
  //     console.log(res.data.data.booking)
  //     if(res.data.data.booking.merchantTransactionId){
  //       const checkPaymentStatus = await axios.get(
  //         `${
  //           import.meta.env.VITE_BASE_URL
  //         }/api/payment/checkPaymentStatus/${res.data.data.booking.merchantTransactionId}`
  //       );
  //       if(checkPaymentStatus.data.code === "PAYMENT_SUCCESS"){
  //         await axios.post(
  //           `https://yesgobus-backend.onrender.com/booking/update_booking`,
  //           {
  //           bookingId,
  //           bookingStatus: "paid",
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         navigate(`/payment/successful?bookingId=${bookingId}`)
  //       }else{
  //         navigate("/payment/failure");
  //       }
  //     }
  //   };
  //   getBooking();
  // }, [paymentVerify]);
  // const handelPayment = async () => {
  //   console.log(bookingData?.totalBasicCost)
  //   const res =axios.post(
  //     `${import.meta.env.VITE_BASE_URL}/api/payment/initiatePayment`,
  //     {
  //       amount: bookingData?.totalBasicCost,
  //       redirectUrl: `https://yegobus-web.onrender.com/payment/${bookingId}?paymentVerify=1`,
  //     }
  //   );
  //   console.log(res)
  //   if (res.status === 200) {
  //    // update merchantTransactionId
  //     const updatePaymentDetails = await axios.post(
  //       `https://yesgobus-backend.onrender.com/booking/update_booking_payment`,
  //       {
  //       bookingId,
  //         merchantTransactionId: res.data.data.merchantTransactionId,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (updatePaymentDetails.status === 200) {
  //       window.open(
  //         res?.data?.data?.instrumentResponse?.redirectInfo.url,
  //         "_blank",
  //         "noopener noreferrer"
  //       );
  //     }
  //   }
  // };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onClicked={() => {}} text={"Proceed To Book Online"} />
    </div>
  );
};

export default TravelingPayment;
