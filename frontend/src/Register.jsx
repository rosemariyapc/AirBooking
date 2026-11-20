
import { useState } from 'react'

function Register({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')

    if (formData.password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/register/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(JSON.stringify(data))
        return
      }

      setMessage(data.message)

    } catch (error) {
      setMessage('Unable to connect to the server.')
    }
  }

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>

      <form onSubmit={handleRegister}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}

      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

export default Register
