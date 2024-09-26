import React, { useState, useEffect } from 'react';
import './QueryForm.scss';
import Navbar from '../Navbar/Navbar';

const QueryForm = () => {
  const [bookings, setBookings] = useState([]);
  const [busBookings, setBusBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    agentId: '',
    subject: '',
    description: '',
    bookingId: '',
    busBookingId: '',
    bookingType: 'busBookingId',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        setFormData((prev) => ({ ...prev, userId: loggedInUser._id }));

        // Fetch bus bookings
        const busResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/busBooking/getAllBookings/${loggedInUser._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const busData = await busResponse.json();
        console.log("Bus Data:", busData.data);

        // Fetch user bookings
        const bookingResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/booking/get_user_booking`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!bookingResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const bookingData = await bookingResponse.json();
        console.log("Booking Data:", bookingData.data.bookingData);

        const bookings = bookingData.data.bookingData || [];
        const busBookings = busData.data || [];

        setBookings(bookings);
        setBusBookings(busBookings);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { userId, agentId, subject, description, bookingId, busBookingId } = formData;

      const payload = {
        userId,
        agentId,
        subject,
        description,
        ...(bookingId && { bookingId }),
        ...(busBookingId && { busBookingId }),
      };

      console.log("Payload:", payload);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/query/createQuery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit the query');
      }

      const result = await response.json();
      console.log("Query submitted successfully:", result);

      setSuccessMessage("Your query has been raised successfully!");

      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      setFormData({
        userId: loggedInUser._id,
        agentId: '',
        subject: '',
        description: '',
        bookingId: '',
        busBookingId: '',
        bookingType: 'busBookingId',
      });

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.log("Submission error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="query-form">
      <Navbar />
      <h1>Raise a Query</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Agent ID:
          <input
            type="text"
            name="agentId"
            value={formData.agentId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Booking Type:
          <select
            name="bookingType"
            value={formData.bookingType}
            onChange={handleChange}
          >
            <option value="busBookingId">Bus Bookings</option>
            <option value="bookingId">Tour Bookings</option>
          </select>
        </label>
        {formData.bookingType === 'busBookingId' && (
          <label>
            Bookings:
            <select
              name="busBookingId"
              value={formData.busBookingId}
              onChange={handleChange}
              required
            >
              <option value="">Select a booking</option>
              {busBookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {`${booking.sourceCity} ${booking.destinationCity} --- ${booking.doj}`}
                </option>
              ))}
            </select>
          </label>
        )}
        {formData.bookingType === 'bookingId' && (
          <label>
            Bookings:
            <select
              name="bookingId"
              value={formData.bookingId}
              onChange={handleChange}
              required
            >
              <option value="">Select a booking</option>
              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="submit">Submit</button>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>} {/* Render success message in red */}
      </form>
    </div>
  );
};

export default QueryForm;
