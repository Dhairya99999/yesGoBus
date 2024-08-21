import axios from "axios";
const user = localStorage.getItem("token");

export const getVrlBuses = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getVrlBusDetails`,
      args,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const getVrlBusFilters = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getVrlFilters`,
      args,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const getVrlSeatLayout = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/sendVrlRequest/GetSeatArrangementDetailsV3`,
      args,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const vrlBlockSeat = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/sendVrlRequest/BlockSeatV2`,
      args,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const vrlBookSeat = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/sendVrlRequest/BookSeatV3`,
      args,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const vrlCancelDetails = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/sendVrlRequest/CancelDetails`,
      args,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const vrlConfirmCancel = async (cancelData, refundData, bookingId, isAgent) => {
  try {
    let cancelTicketResponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/sendVrlRequest/ConfirmCancellation`,
      cancelData,
      {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    if (cancelTicketResponse.data.data[0].Status === 2) {
      return cancelTicketResponse.data;
    } else if (cancelTicketResponse.data.data[0].Status === 1) {
      cancelTicketResponse = cancelTicketResponse.data.data[0];
      refundData.amount = parseFloat(cancelTicketResponse.RefundAmount);
      if (!isAgent) {
        const { data: refundResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/refundPayment`, refundData,
        {
          headers: {
            Authorization: `Bearer ${user}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        });
      }
      // if (refundResponse) {
      const updateDetails = {
        bookingStatus: "cancelled",
        totalRefundAmount: cancelTicketResponse.RefundAmount,
        // cancelChargesPercentage: cancelTicketResponse.cancelChargesPercentage,
        cancellationCharges: cancelTicketResponse.TotalFare - cancelTicketResponse.RefundAmount,
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
        pickUpLocation: updateBookingResponse?.data.boardingPoint,
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
        pickUpLocation: updateBookingResponse?.data.boardingPoint,
        opPNR: updateBookingResponse?.data.opPNR,
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
      // }
    }
  } catch (error) {
    throw error.message;
  }
};
