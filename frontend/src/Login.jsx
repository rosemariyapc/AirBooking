
import { useState } from 'react'

function Login({ onClose, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.detail || 'Login failed. Check your details or approval status.'
        )
        return
      }

      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
        localStorage.setItem('username', username)
        onLogin(username)

      setMessage(`Welcome, ${username}!`)

    } catch (error) {
      setMessage('Unable to connect to the server.')
    }
  }

  return (
    <div className="auth-container">
      <h2>Login to AirBooking</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

export default Login
