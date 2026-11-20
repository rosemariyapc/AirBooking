
import { useEffect, useState } from 'react'
import './AdminDashboard.css'

// Get the user's approval status even if the API uses a different field name.
const getApprovalStatus = (user) => {
  const status =
    user.approval_status ??
    user.approvalStatus ??
    user.status

  if (status) {
    return String(status).toLowerCase()
  }

  if (user.is_approved === true) {
    return 'approved'
  }

  if (user.is_approved === false) {
    return 'pending'
  }

  // Default to pending when the API does not provide a status.
  return 'pending'
}

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])

  const [stats, setStats] = useState({
    total_users: 0,
    pending_users: 0,
    total_flights: 0,
    total_bookings: 0,
  })

  const [message, setMessage] = useState('Loading users...')
  const [flightMessage, setFlightMessage] = useState('Loading flights...')
  const [bookingMessage, setBookingMessage] = useState('Loading bookings...')

  const [activeTab, setActiveTab] = useState('Overview')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const [showFlightForm, setShowFlightForm] = useState(false)
  const [editingFlight, setEditingFlight] = useState(null)

  const emptyFlightForm = {
    airline: '',
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
    departure_date: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    total_seats: '',
    available_seats: '',
    status: 'on_time',
  }

  const [flightForm, setFlightForm] = useState(emptyFlightForm)

  const getToken = () => localStorage.getItem('access')

  // Handle both normal and paginated API responses.
  const getList = (data, key) => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.results)) return data.results
    if (Array.isArray(data?.[key])) return data[key]
    return []
  }

  // LOAD DASHBOARD STATISTICS
  const fetchStats = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/admin/dashboard/stats/',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Unable to load statistics:', error)
    }
  }

  // LOAD ALL USERS
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/admin/users/',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.detail || 'Unable to load users.')
        return
      }

      const userList = getList(data, 'users')

      setUsers(userList)
      setMessage(
        userList.length === 0 ? 'No registered users found.' : ''
      )
    } catch (error) {
      setMessage('Unable to connect to the server.')
    }
  }

  // LOAD ALL FLIGHTS
  const fetchFlights = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/flights/admin/',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setFlightMessage('Unable to load flights.')
        return
      }

      const flightList = getList(data, 'flights')

      setFlights(flightList)
      setFlightMessage(
        flightList.length === 0 ? 'No flights available.' : ''
      )
    } catch (error) {
      setFlightMessage('Unable to connect to the server.')
    }
  }

  // LOAD ALL BOOKINGS FOR ADMIN
  const fetchBookings = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/admin/bookings/',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setBookingMessage(
          data.detail || 'Unable to load bookings. Check the admin API.'
        )
        return
      }

      const bookingList = getList(data, 'bookings')

      setBookings(bookingList)
      setBookingMessage(
        bookingList.length === 0 ? 'No bookings found.' : ''
      )
    } catch (error) {
      setBookingMessage('Unable to connect to the server.')
    }
  }

  // LOAD DASHBOARD DATA
  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchFlights()
    fetchBookings()
  }, [])

  // APPROVE OR REJECT USERS
  const handleApproval = async (userId, action) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${userId}/${action}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || 'Action failed.')
        return
      }

      alert(data.message || `User ${action}d successfully!`)

      fetchUsers()
      fetchStats()
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  // HANDLE FLIGHT FORM INPUTS
  const handleFlightChange = (e) => {
    setFlightForm({
      ...flightForm,
      [e.target.name]: e.target.value,
    })
  }

  // ADD OR UPDATE FLIGHT
  const handleFlightSubmit = async (e) => {
    e.preventDefault()

    if (
      Number(flightForm.available_seats) >
      Number(flightForm.total_seats)
    ) {
      alert('Available seats cannot be greater than total seats.')
      return
    }

    try {
      const url = editingFlight
        ? `http://127.0.0.1:8000/api/flights/admin/${editingFlight.id}/`
        : 'http://127.0.0.1:8000/api/flights/admin/'

      const response = await fetch(url, {
        method: editingFlight ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...flightForm,
          price: Number(flightForm.price),
          total_seats: Number(flightForm.total_seats),
          available_seats: Number(flightForm.available_seats),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(JSON.stringify(data))
        return
      }

      alert(
        editingFlight
          ? 'Flight updated successfully!'
          : 'Flight added successfully!'
      )

      setShowFlightForm(false)
      setEditingFlight(null)
      setFlightForm(emptyFlightForm)

      fetchFlights()
      fetchStats()
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  // OPEN FLIGHT FORM FOR EDITING
  const handleEditFlight = (flight) => {
    setEditingFlight(flight)

    setFlightForm({
      airline: flight.airline || '',
      flight_number: flight.flight_number || '',
      departure_airport: flight.departure_airport || '',
      arrival_airport: flight.arrival_airport || '',
      departure_date: flight.departure_date || '',
      departure_time: flight.departure_time || '',
      arrival_time: flight.arrival_time || '',
      price: flight.price || '',
      total_seats: flight.total_seats || '',
      available_seats: flight.available_seats || '',
      status: flight.status || 'on_time',
    })

    setShowFlightForm(true)
  }

  // DELETE FLIGHT
  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) {
      return
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/flights/admin/${flightId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        alert(data.detail || 'Unable to delete flight.')
        return
      }

      alert('Flight deleted successfully!')

      fetchFlights()
      fetchStats()
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  // FILTER USERS
  const filteredUsers = users.filter((user) => {
    const username = (user.username || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    const searchText = search.toLowerCase()
    const approvalStatus = getApprovalStatus(user)

    const matchesSearch =
      username.includes(searchText) || email.includes(searchText)

    const matchesFilter =
      filter === 'all' || approvalStatus === filter

    return matchesSearch && matchesFilter
  })

  const menuItems = [
    { name: 'Overview', icon: '◫' },
    { name: 'Users', icon: '♙' },
    { name: 'Flights', icon: '✈' },
    { name: 'Bookings', icon: '▣' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-icon">✈</span>
          <span>AirBooking</span>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`sidebar-link ${
              activeTab === item.name ? 'active' : ''
            }`}
            onClick={() => setActiveTab(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}

        <div className="sidebar-footer">
          <span>ADMIN PANEL</span>
          <p>AirBooking Management</p>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h2>{activeTab}</h2>
            <p>AirBooking / {activeTab}</p>
          </div>

          <div className="admin-profile">
            <span className="profile-avatar">A</span>
            <span>Administrator</span>
          </div>
        </header>

        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <>
            <section className="admin-welcome">
              <h1>Welcome to Admin Dashboard</h1>
              <p>
                Monitor and manage your flight booking platform.
              </p>
            </section>

            <section className="admin-stats">
              <div className="admin-stat-card">
                <span className="stat-icon blue">♙</span>
                <p>Total Users</p>
                <h2>{stats.total_users ?? 0}</h2>
                <small>Registered users</small>
              </div>

              <div className="admin-stat-card">
                <span className="stat-icon orange">◷</span>
                <p>Pending Approvals</p>
                <h2>{stats.pending_users ?? 0}</h2>
                <small>Awaiting approval</small>
              </div>

              <div className="admin-stat-card">
                <span className="stat-icon purple">✈</span>
                <p>Total Flights</p>
                <h2>{stats.total_flights ?? 0}</h2>
                <small>Flight records</small>
              </div>

              <div className="admin-stat-card">
                <span className="stat-icon green">▣</span>
                <p>Total Bookings</p>
                <h2>{stats.total_bookings ?? 0}</h2>
                <small>Booking records</small>
              </div>
            </section>
          </>
        )}

        {/* USER MANAGEMENT */}
        {activeTab === 'Users' && (
          <section className="admin-content-card">
            <div className="section-heading">
              <div>
                <h2>User Management</h2>
                <p>View and manage registered accounts.</p>
              </div>
              <span className="user-count">{users.length} Users</span>
            </div>

            <div className="user-tools">
              <input
                type="text"
                placeholder="Search username or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {message && <p>{message}</p>}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>USERNAME</th>
                    <th>EMAIL ADDRESS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const approvalStatus = getApprovalStatus(user)

                    return (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.username || '—'}</strong>
                        </td>

                        <td>{user.email || '—'}</td>

                        <td>
                          <span
                            className={`status-badge ${approvalStatus}`}
                          >
                            {approvalStatus}
                          </span>
                        </td>

                        <td>
                          {approvalStatus === 'pending' ? (
                            <div className="action-buttons">
                              <button
                                className="approve-btn"
                                onClick={() =>
                                  handleApproval(user.id, 'approve')
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={() =>
                                  handleApproval(user.id, 'reject')
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {!message && filteredUsers.length === 0 && (
                <p className="empty-users">No matching users found.</p>
              )}
            </div>
          </section>
        )}

        {/* FLIGHT MANAGEMENT */}
        {activeTab === 'Flights' && (
          <section className="admin-content-card">
            <div className="section-heading">
              <div>
                <h2>Flight Management</h2>
                <p>Add, view, edit and delete flight records.</p>
              </div>

              <button
                className="approve-btn"
                onClick={() => {
                  if (showFlightForm) {
                    setShowFlightForm(false)
                    setEditingFlight(null)
                    setFlightForm(emptyFlightForm)
                  } else {
                    setEditingFlight(null)
                    setFlightForm(emptyFlightForm)
                    setShowFlightForm(true)
                  }
                }}
              >
                {showFlightForm ? 'Close Form' : '+ Add Flight'}
              </button>
            </div>

            {showFlightForm && (
              <form
                className="flight-form"
                onSubmit={handleFlightSubmit}
              >
                <h3>
                  {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                </h3>

                <div className="flight-form-grid">
                  <label>
                    Airline
                    <input
                      name="airline"
                      placeholder="e.g. IndiGo"
                      value={flightForm.airline}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Flight Number
                    <input
                      name="flight_number"
                      placeholder="e.g. 6E301"
                      value={flightForm.flight_number}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Departure Airport
                    <input
                      name="departure_airport"
                      placeholder="e.g. Kochi"
                      value={flightForm.departure_airport}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Arrival Airport
                    <input
                      name="arrival_airport"
                      placeholder="e.g. Mumbai"
                      value={flightForm.arrival_airport}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Departure Date
                    <input
                      type="date"
                      name="departure_date"
                      value={flightForm.departure_date}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Departure Time
                    <input
                      type="time"
                      name="departure_time"
                      value={flightForm.departure_time}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Arrival Time
                    <input
                      type="time"
                      name="arrival_time"
                      value={flightForm.arrival_time}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Ticket Price (₹)
                    <input
                      type="number"
                      name="price"
                      placeholder="Enter ticket price"
                      min="0"
                      step="0.01"
                      value={flightForm.price}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Total Seats
                    <input
                      type="number"
                      name="total_seats"
                      placeholder="Maximum seats"
                      min="1"
                      value={flightForm.total_seats}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Available Seats
                    <input
                      type="number"
                      name="available_seats"
                      placeholder="Remaining seats"
                      min="0"
                      value={flightForm.available_seats}
                      onChange={handleFlightChange}
                      required
                    />
                  </label>

                  <label>
                    Flight Status
                    <select
                      name="status"
                      value={flightForm.status}
                      onChange={handleFlightChange}
                    >
                      <option value="on_time">On Time</option>
                      <option value="delayed">Delayed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>
                </div>

                <div className="action-buttons">
                  <button type="submit" className="approve-btn">
                    {editingFlight ? 'Update Flight' : 'Save Flight'}
                  </button>

                  <button
                    type="button"
                    className="reject-btn"
                    onClick={() => {
                      setShowFlightForm(false)
                      setEditingFlight(null)
                      setFlightForm(emptyFlightForm)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {flightMessage && <p>{flightMessage}</p>}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>FLIGHT</th>
                    <th>ROUTE</th>
                    <th>DATE</th>
                    <th>PRICE</th>
                    <th>SEATS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id}>
                      <td>
                        <strong>{flight.airline}</strong>
                        <br />
                        {flight.flight_number}
                      </td>

                      <td>
                        {flight.departure_airport} → {flight.arrival_airport}
                      </td>

                      <td>{flight.departure_date}</td>

                      <td>₹{flight.price}</td>

                      <td>
                        {flight.available_seats}/{flight.total_seats}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${flight.status || ''}`}
                        >
                          {(flight.status || 'unknown').replace('_', ' ')}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => handleEditFlight(flight)}
                          >
                            Edit
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() => handleDeleteFlight(flight.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* BOOKING MANAGEMENT */}
        {activeTab === 'Bookings' && (
          <section className="admin-content-card">
            <div className="section-heading">
              <div>
                <h2>Booking Management</h2>
                <p>View passenger bookings and payment details.</p>
              </div>

              <span className="user-count">
                {bookings.length} Bookings
              </span>
            </div>

            {bookingMessage && <p>{bookingMessage}</p>}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>PNR</th>
                    <th>PASSENGER</th>
                    <th>FLIGHT</th>
                    <th>ROUTE</th>
                    <th>SEATS</th>
                    <th>AMOUNT</th>
                    <th>BOOKING STATUS</th>
                    <th>PAYMENT</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.pnr || '—'}</strong>
                      </td>

                      <td>
                        {booking.user_name || `User ${booking.user || ''}`}
                      </td>

                      <td>
                        {booking.flight_number ||
                          booking.flight_details ||
                          '—'}
                      </td>

                      <td>
                        {booking.departure_airport &&
                        booking.arrival_airport
                          ? `${booking.departure_airport} → ${booking.arrival_airport}`
                          : '—'}
                      </td>

                      <td>{booking.seats_booked ?? '—'}</td>

                      <td>₹{booking.total_price ?? '—'}</td>

                      <td>
                        <span
                          className={`status-badge ${booking.status || ''}`}
                        >
                          {booking.status || '—'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            booking.payment_status || ''
                          }`}
                        >
                          {booking.payment_status || '—'}
                        </span>
                        <br />
                        <small>
                          {booking.payment_method || 'Not selected'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
