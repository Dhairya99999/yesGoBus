// import axios from "axios";
import axios from "axios";
const user = localStorage.getItem("token");

export const googleLoginAPI = async (jwtToken) => {
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/googleSignIn`, { jwtToken },
    {
      headers: {
        Authorization: `Bearer ${user}`,
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
    return data;
  } catch (error) {
    console.error("Error logging in using google : ", error);
  }
};

export const facebookLoginAPI = async (fbResponse) => {
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/facebooksignin`, fbResponse,
    {
      headers: {
        Authorization: `Bearer ${user}`,
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
    return data;
  } catch (error) {
    console.error("Error logging in using facebook : ", error);
  }
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const cancelTicket = async (refundData, cancelTicketData, bookingId) => {
  try {
    const { data: cancelTicketResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/busBooking/cancelTicket`, cancelTicketData,
    {
      headers: {
        Authorization: `Bearer ${user}`,
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
    if (cancelTicketResponse.apiStatus?.success) {
      refundData.amount = parseFloat(cancelTicketResponse.totalRefundAmount);
      const { data: refundResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/refundPayment`, refundData,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });
      if (refundResponse) {
        const updateDetails = {
          bookingStatus: "cancelled",
          totalRefundAmount: cancelTicketResponse.totalRefundAmount,
          cancelChargesPercentage: cancelTicketResponse.cancelChargesPercentage,
          cancellationCharges: cancelTicketResponse.cancellationCharges,
        }
        const { data: updateBookingResponse } = await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/busBooking/updateBooking/${bookingId}`, updateDetails,
        {
          headers: {
            Authorization: `Bearer ${user}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        });
        // send mail
        const mailBody = {
          fullName: updateBookingResponse?.data.customerName,
          sourceCity: updateBookingResponse?.data.sourceCity,
          destinationCity: updateBookingResponse?.data.destinationCity,
          seats: updateBookingResponse?.data.selectedSeats,
          amount: updateBookingResponse?.data.totalAmount,
          pickUpLocation: updateBookingResponse?.data.boardingPoint.location,
          opPNR: updateBookingResponse?.data.opPNR,
          doj: formatDate(updateBookingResponse?.data.doj),
          to: updateBookingResponse?.data.customerEmail,
        }
        const sendMail = await axios.post(
          `${import.meta.env.VITE_BASE_URL
          }/api/busBooking/sendCancelTicketEmail`,
          mailBody,
          {
            headers: {
              Authorization: `Bearer ${user}`,
              "Content-Type": "application/json", // Set the content type to JSON
            },
          }
        );

        //send sms
        const messageBody = {
          fullName: updateBookingResponse?.data.customerName,
          sourceCity: updateBookingResponse?.data.sourceCity,
          destinationCity: updateBookingResponse?.data.destinationCity,
          seats: updateBookingResponse?.data.selectedSeats,
          amount: updateBookingResponse?.data.totalAmount,
          pickUpLocation: updateBookingResponse?.data.boardingPoint.location,
          opPNR: updateBookingResponse?.data.opPNR.split("/")[0],
          doj: formatDate(updateBookingResponse?.data.doj),
          to: updateBookingResponse?.data.customerPhone,
        }
        const sendMessage = await axios.post(
          `${import.meta.env.VITE_BASE_URL
          }/api/busBooking/sendCancelTicketMessage`,
          messageBody,
          {
            headers: {
              Authorization: `Bearer ${user}`,
              "Content-Type": "application/json", // Set the content type to JSON
            },
          }
        );

        return updateBookingResponse;
      }
    }
  } catch (error) {
    console.error("Error cancelling the ticket : ", error);
  }
};
