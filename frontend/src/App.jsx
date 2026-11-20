
import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import MyBookings from './MyBookings'
import AdminDashboard from './AdminDashboard'
import './App.css'

function App() {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [showMyBookings, setShowMyBookings] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('access')
  )

  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem('username') || ''
  )

  // Flight Search
  const handleSearch = async (e) => {
    e.preventDefault()

    if (!departure || !destination || !travelDate) {
      alert('Please fill in all flight search details.')
      return
    }

    if (departure.toLowerCase() === destination.toLowerCase()) {
      alert('Departure and destination cannot be the same.')
      return
    }

    setLoading(true)
    setError('')
    setFlights([])

    try {
      const params = new URLSearchParams({
        departure,
        destination,
        date: travelDate,
      })

      const response = await fetch(
        `http://127.0.0.1:8000/api/flights/search/?${params}`
      )

      if (!response.ok) {
        throw new Error('Unable to fetch flights.')
      }

      const data = await response.json()

      setFlights(Array.isArray(data) ? data : data.results || [])

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Flight Booking
  const handleBooking = async (flightId) => {
    const token = localStorage.getItem('access')

    if (!token) {
      alert('Please login to book a flight.')
      setShowLogin(true)
      return
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/bookings/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flight: flightId,
            seats_booked: passengers,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(JSON.stringify(data))
        return
      }

      alert(`Booking successful! Your PNR is ${data.pnr}`)

    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')

    setIsLoggedIn(false)
    setLoggedInUser('')
    setShowAdminDashboard(false)
    setShowMyBookings(false)

    alert('Logged out successfully.')
  }

  return (
    <div className="app">

      {/* Navigation Bar */}

{/* PROFESSIONAL NAVIGATION BAR */}
<nav className="navbar professional-navbar">
  <a href="#home" className="logo">
    <span className="logo-icon">✈</span>
    <span className="logo-text">
      <strong>AirBooking</strong>
      <small>YOUR JOURNEY, OUR PRIORITY</small>
    </span>
  </a>

  <div className="nav-links">
    <a href="#home">Home</a>
    <a href="#search">Book Flights</a>
    <a href="#features">Why Us</a>
    <a href="#contact">Contact</a>
  </div>

  <div className="nav-buttons">
    {isLoggedIn ? (
      <>
        {loggedInUser === 'admin' && (
          <button
            className="nav-dashboard-btn"
            onClick={() => {
              setShowAdminDashboard(true)
              setShowMyBookings(false)
            }}
          >
            <span>▦</span> Admin Dashboard
          </button>
        )}

        {loggedInUser !== 'admin' && (
          <button
            className="nav-dashboard-btn"
            onClick={() => {
              setShowMyBookings(true)
              setShowAdminDashboard(false)
            }}
          >
            <span>✈</span> My Trips
          </button>
        )}

        <div className="nav-user">
          <span className="nav-user-avatar">
            {loggedInUser.charAt(0).toUpperCase()}
          </span>
          <span className="nav-user-name">{loggedInUser}</span>
        </div>

        <button className="nav-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </>
    ) : (
      <>
        <button
          className="nav-login-btn"
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>

        <button
          className="nav-register-btn"
          onClick={() => setShowRegister(true)}
        >
          Get Started
        </button>
      </>
    )}
  </div>
</nav>


      {/* Login */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLogin={(username) => {
            setIsLoggedIn(true)
            setLoggedInUser(username)
            setShowLogin(false)
          }}
        />
      )}

      {/* Registration */}
      {showRegister && (
        <Register onClose={() => setShowRegister(false)} />
      )}

      {/* My Trips */}
      {showMyBookings && isLoggedIn && (
        <MyBookings />
      )}

      {/* Admin Dashboard - Admin Only */}
      {showAdminDashboard &&
        isLoggedIn &&
        loggedInUser === 'admin' && (
          <AdminDashboard />
        )}

      {/* Hero Section */}
      <section className="hero-section" id="home">

        <div className="hero-content">
          <p className="hero-label">YOUR JOURNEY STARTS HERE</p>

          <h1>
            Explore the World,
            <br />
            <span>One Flight at a Time.</span>
          </h1>

          <p className="hero-description">
            Discover amazing destinations and book your flights
            easily with AirBooking. Your journey begins with us.
          </p>

          <a href="#search" className="hero-button">
            Book Your Flight →
          </a>
        </div>

        <div className="hero-decoration">
          <div className="plane-circle">✈</div>
          <p>Travel Beyond Boundaries</p>
        </div>

      </section>

      {/* Flight Search Section */}
      <section className="search-section" id="search">

        <div className="search-heading">
          <p>PLAN YOUR JOURNEY</p>
          <h2>Find Your Flight</h2>
        </div>

        <form className="search-form" onSubmit={handleSearch}>

          <div className="form-group">
            <label>From</label>
            <input
              type="text"
              placeholder="Departure city"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              placeholder="Destination city"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Travel Date</label>
            <input
              type="date"
              value={travelDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Passengers</label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              <option value={1}>1 Passenger</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4 Passengers</option>
              <option value={5}>5 Passengers</option>
            </select>
          </div>

          <button type="submit" className="search-button">
            Search Flights
          </button>

        </form>
      </section>

      {/* Flight Results Section */}
      {loading && <p>Searching for flights...</p>}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {!loading && flights.length > 0 && (
        <section className="flight-results">
          <h2>Available Flights</h2>

          {flights.map((flight) => (
            <div className="feature-card" key={flight.id}>

              <h3>
                {flight.airline} - {flight.flight_number}
              </h3>

              <p>
                {flight.departure_airport} → {flight.arrival_airport}
              </p>

              <p>Departure: {flight.departure_time}</p>
              <p>Arrival: {flight.arrival_time}</p>
              <p>Price: ₹{flight.price}</p>
              <p>Available Seats: {flight.available_seats}</p>
              <p>Status: {flight.status}</p>

              <button
                className="search-button"
                onClick={() => handleBooking(flight.id)}
              >
                Book Now
              </button>

            </div>
          ))}
        </section>
      )}

      {!loading && !error && flights.length === 0 && (
        <p>No flights found. Search to see available flights.</p>
      )}

      {/* Features Section */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <p>WHY CHOOSE US</p>
          <h2>Travel Made Simple</h2>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">✈</div>
            <h3>Easy Booking</h3>
            <p>
              Search and book your favourite flights
              through a simple booking process.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>
              Enjoy a simple and secure simulated
              payment experience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Easy Management</h3>
            <p>
              Manage your bookings and keep track
              of your flight details.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <h2>AirBooking ✈</h2>
        <p>Your journey, our priority.</p>
        <p>© 2026 AirBooking. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App
