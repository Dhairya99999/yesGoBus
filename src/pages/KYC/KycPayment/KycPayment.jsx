import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { netbanking, paytm, phonepe, upi } from "../../../assets/kycpayment";
import { Button } from "../../../components";
import "./KycPayment.scss";
//import axiosInstance from "../../../utils/service";
import { KycNavbar } from "../../../components";
import KycPaymentModal from "../KycPaymentModal/KycPaymentModal";
import KycAmount from "../KycAmount/KycAmount";
import KycPaymentCard from "../KycPaymentCard/KycPaymentCard";
import axios from "axios";

const KycPayments = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { driverId } = location.state || {
    driverId: searchParams.get("driverId"),
  };
  const token = localStorage.getItem("token")
  const paymentVerify = new URLSearchParams(location.search).has(
    "paymentVerify"
  );
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        ${import.meta.env.VITE_BASE_URL}/api/payment/initiatePayment,
        {
          amount: 2000,
          redirectUrl: https://yesgobus.com/cabs/kyc/payment?driverId=${driverId}&paymentVerify=1,
        },
        {
          headers: {
            Authorization: Bearer ${token},
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );
      if (response.status === 200) {
        const updatePaymentDetails = await axios.patch(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/driver/updateDriver/${driverId}`,
          {
            merchantTransactionId: response.data.data.merchantTransactionId,
            paymentAmount: 2000,
          },
          {
            headers: {
              Authorization: Bearer ${token},
              "Content-Type": "application/json", // Set the content type to JSON
            },
          }
        );
        if (updatePaymentDetails.status === 200) {
          window.open(
            response.data.data.instrumentResponse.redirectInfo.url,
            "_blank",
            "noopener noreferrer"
          );
        } else {
          alert("Something went wrong");
        }
      }
    } catch (error) {
      alert("Something went wrong");
      console.error("Something went wrong:", error);
    }
  };
  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
  
    const paymentVerification = async () => {
      try {
        const getDriverDetails = await axiosInstance.get(/api/driver/getDriverById/${driverId});
        if (getDriverDetails.status === 200) {
          const merchantTransactionId = getDriverDetails.data.data.merchantTransactionId;
          const checkPaymentStatus = await axiosInstance.get(/api/payment/checkPaymentStatus/${merchantTransactionId});
  
          if (checkPaymentStatus.data.code === "PAYMENT_SUCCESS") {
            if (isMounted) {
              const updatePaymentDetails = await axiosInstance.patch(/api/driver/updateDriver/${driverId}, {
                paymentStatus: "paid",
              });
  
              if (updatePaymentDetails.status === 200) {
                setShowPaymentModal(true);
              }
            }
          } else if (checkPaymentStatus.data.code === 'TRANSACTION_NOT_FOUND') {
            console.warn("Transaction not found:", checkPaymentStatus.data);
            // Handle transaction not found scenario, maybe stop further API calls
          } else if (checkPaymentStatus.data.code === 'PAYMENT_ERROR') {
            console.warn("Payment Error:", checkPaymentStatus.data);
            // Handle payment error, maybe notify the user and stop further API calls
          }
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        alert("An error occurred during payment verification. Please try again.");
      }
    };
  
    if (paymentVerify && driverId) {
      paymentVerification();
    }
  
    return () => {
      isMounted = false; // Cleanup when unmounting
    };
  }, [paymentVerify, driverId]);
  
  return (
    <div className="Payments">
      <KycNavbar />
      {showPaymentModal && (
        <KycPaymentModal onCancel={setShowPaymentModal} driverId={driverId} />
      )}
      <div className="container">
        <h1>Your KYC is completed</h1>
        <h4>Total Amount For Registeration</h4>
        <div className="wrapper">
          <div className="left">
            <div className="amounts">
              <KycAmount text={"Total Amount"} amt={"₹3000.00"} />
              <KycAmount text={"Discount"} amt={"-₹1000.00"} />
              <KycAmount text={"Tax"} amt={"Included"} />
              <KycAmount text={"Amount Payable"} amt={"₹2000.00"} />
            </div>
            <Button onClicked={() => handlePayment()} text={"Pay Now"} />
          </div>
          <div className="right">
            <div className="title">
              <p>All Payment Options</p>
              <hr />
            </div>
            <div className="payments">
              <KycPaymentCard
                image={paytm}
                title={"Paytm QR"}
                subtitle={"To use paytm qr for payment"}
              />
              <KycPaymentCard
                image={phonepe}
                title={"Phonepe QR"}
                subtitle={"To use phonepe qr for payment"}
              />
              <KycPaymentCard
                image={upi}
                title={"UPI"}
                subtitle={"To use phonepe qr for payment"}
              />
              <KycPaymentCard
                image={netbanking}
                title={"Net Banking"}
                subtitle={"To use phonepe qr for payment"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycPayments;
