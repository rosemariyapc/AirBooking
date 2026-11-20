\# AirBooking – Flight Booking System



A full-stack flight booking platform developed using \*\*Django REST Framework\*\* and \*\*React\*\*. The application allows users to register, search for flights, book tickets, manage bookings, and make simulated payments. Administrators can manage users, flights, and bookings through an admin dashboard.



\## Features



\### User Features

\- User registration and login with JWT authentication.

\- Admin approval for newly registered users.

\- Search and view available flights.

\- Book flights and manage reservations.

\- View booking history under My Trips.

\- Simulated online payment functionality.

\- Cancel bookings.



\### Admin Features

\- Admin authentication.

\- Approve or reject registered users.

\- View registered users.

\- Add and manage flights.

\- Update flight status.

\- View and monitor bookings.

\- Dashboard statistics.



\## Technologies Used



\*\*Frontend\*\*

\- React.js

\- JavaScript

\- HTML5

\- CSS3



\*\*Backend\*\*

\- Python

\- Django

\- Django REST Framework

\- Simple JWT



\*\*Database\*\*

\- SQLite



\*\*Tools\*\*

\- Visual Studio Code

\- Git and GitHub

\- Postman



\## Project Structure



```text

AirBooking/

├── backend/

│   ├── accounts/

│   ├── bookings/

│   ├── flights/

│   ├── config/

│   ├── manage.py

│   └── requirements.txt

│

├── frontend/

│   ├── public/

│   ├── src/

│   ├── package.json

│   └── package-lock.json

│

└── README.md

```



\## Installation and Setup



\### Prerequisites

\- Python

\- Node.js and npm

\- Git



\### 1. Clone the Repository



```bash

git clone https://github.com/rosemariyapc/AirBooking.git

cd AirBooking

```



\### 2. Backend Setup



```bash

python -m venv venv

```



Activate the virtual environment on Windows:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



Install dependencies:



```bash

cd backend

pip install -r requirements.txt

```



Create a `.env` file inside the `backend` folder and add:



```env

DJANGO\_SECRET\_KEY=your-secret-key-here

```



Replace the placeholder with a newly generated Django secret key.



Run migrations:



```bash

python manage.py migrate

```



Create an administrator account:



```bash

python manage.py createsuperuser

```



Start the backend server:



```bash

python manage.py runserver

```



Backend URL: http://127.0.0.1:8000/



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Frontend URL: http://localhost:5173/



\## API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/auth/register/` | User registration |

| POST | `/api/auth/login/` | User login |

| POST | `/api/auth/token/refresh/` | Refresh JWT token |

| GET | `/api/flights/search/` | Search flights |

| GET | `/api/flights/{id}/` | View flight details |

| POST | `/api/bookings/` | Create a booking |

| GET | `/api/bookings/` | View user bookings |

| GET | `/api/admin/users/pending/` | View pending users |

| POST | `/api/admin/users/{id}/approve/` | Approve a user |

| GET | `/api/admin/bookings/` | View all bookings |



\## Payment Information



The application includes simulated payment functionality for demonstration purposes. It does not process real financial transactions.



\## Security



\- JWT-based authentication.

\- Password-based user authentication.

\- Environment variables for secret configuration.

\- Sensitive files and local database files are excluded using `.gitignore`.



\## Author



\*\*Rose Mariya P C\*\*



GitHub: https://github.com/rosemariyapc

