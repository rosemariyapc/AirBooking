
import { useEffect, useState } from 'react'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('Loading bookings...')

  // Payment function
  const handlePayment = async (bookingId) => {
    const paymentMethod = window.prompt(
      'Choose payment method: upi, card, or netbanking'
    )

    if (!paymentMethod) return

    try {
      const token = localStorage.getItem('access')

      const response = await fetch(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/pay/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_method: paymentMethod.toLowerCase(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Payment failed.')
        return
      }

      alert('Payment successful!')
      window.location.reload()
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  // Cancel booking function
  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    )

    if (!confirmCancel) return

    try {
      const token = localStorage.getItem('access')

      const response = await fetch(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/cancel/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Unable to cancel booking.')
        return
      }

      alert('Booking cancelled successfully!')
      window.location.reload()
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access')

        const response = await fetch(
          'http://127.0.0.1:8000/api/bookings/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setMessage('Unable to load bookings.')
          return
        }

        setBookings(data)
        setMessage(
          data.length === 0 ? 'You have no bookings yet.' : ''
        )
      } catch (error) {
        setMessage('Unable to connect to the server.')
      }
    }

    fetchBookings()
  }, [])

  return (
    <div className="auth-container">
      <h2>My Trips</h2>

      {message && <p>{message}</p>}

      {bookings.map((booking) => (
        <div key={booking.id}>
          <h3>{booking.flight_details}</h3>

          <p>PNR: {booking.pnr}</p>
          <p>Seats: {booking.seats_booked}</p>
          <p>Total Price: ₹{booking.total_price}</p>
          <p>Booking Status: {booking.status}</p>
          <p>Payment Status: {booking.payment_status}</p>

          {booking.payment_status === 'pending' &&
            booking.status !== 'cancelled' && (
              <button
                className="search-button"
                onClick={() => handlePayment(booking.id)}
              >
                Pay Now
              </button>
            )}

          {booking.status !== 'cancelled' && (
            <button
              className="login-btn"
              onClick={() => handleCancel(booking.id)}
            >
              Cancel Booking
            </button>
          )}

          <hr />
        </div>
      ))}
    </div>
  )
}

export default MyBookings
