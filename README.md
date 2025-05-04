# CrediKhaata - Shopkeeper Credit Management System

A RESTful backend service that enables small shopkeepers to manage customer credit accounts, track loans, record repayments, and receive payment reminders.

## Features

- 🔐 **User Authentication**: Secure JWT-based registration and login
- 👥 **Customer Management**: Create and manage customer profiles with trust scores
- 💰 **Loan Tracking**: Record credit sales with due dates and status tracking
- ✔️ **Repayment System**: Track partial and full repayments
- ⏰ **Overdue Alerts**: Automatic overdue loan detection and reminders
- 📊 **Financial Summary**: Dashboard with key metrics and analytics
- 📱 **Notification System**: (Mock) SMS/WhatsApp payment reminders

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Date Handling**: Moment.js
- **Validation**: Validator.js

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite3

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dhruvjaiswal2981/credikhaata.git
   cd credikhaata
   ```


2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
- Create a .env file in the root directory with the following content:

    ```bash
    PORT=3000
    JWT_SECRET=your_strong_secret_here
    JWT_EXPIRES_IN=2d
    ```

4. Initialize the database:
```bash
npm run migrate
```

5. Running the Application
- Development mode (with nodemon):
```bash
node app.js
```
- The server will start on http://localhost:3000 by default.

## API Documentation

### Authentication

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/api/v1/auth/register` | POST | Register a new shopkeeper | `{name, email, phone, password, shopName}` |
| `/api/v1/auth/login` | POST | Login existing user | `{email, password}` |

### Customers

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/v1/customers` | GET | Get all customers | |
| `/api/v1/customers` | POST | Create new customer | `{name, phone, address, trustScore, notes}` |
| `/api/v1/customers/:id` | GET | Get single customer | |
| `/api/v1/customers/:id` | PATCH | Update customer | `{name, phone, address, trustScore, notes}` |
| `/api/v1/customers/:id` | DELETE | Delete customer | |

### Loans

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/v1/loans` | GET | Get all loans | `?status=[pending|paid|overdue]` |
| `/api/v1/loans` | POST | Create new loan | `{customerId, amount, dueDate, description}` |
| `/api/v1/loans/:id` | GET | Get single loan | |
| `/api/v1/loans/:id` | PATCH | Update loan | `{amount, dueDate, description}` |
| `/api/v1/loans/:id` | DELETE | Delete loan | |
| `/api/v1/loans/summary` | GET | Get loan summary | |
| `/api/v1/loans/overdue` | GET | Get overdue loans | |
| `/api/v1/loans/overdue/send-reminders` | POST | Send overdue reminders | |

### Repayments

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/v1/repayments` | POST | Record repayment | `{loanId, amount, notes}` |
| `/api/v1/repayments/loan/:loanId` | GET | Get loan repayments | |

## Request/Response Examples

### User Registration
    ```json
    POST /api/v1/auth/register
    {
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "phone": "+919876543210",
    "password": "securepassword123",
    "shopName": "Ramesh General Store"
    }
    ```

- Response:
    ```json
    {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "user": {
        "id": 1,
        "name": "Ramesh Kumar",
        "email": "ramesh@example.com",
        "phone": "+919876543210",
        "shopName": "Ramesh General Store",
        "createdAt": "2023-07-20T12:00:00.000Z"
        }
    }
    }
    ```

### Creating a Loan
    ```json
        POST /api/v1/loans
        Headers: Authorization: Bearer <token>
        {
        "customerId": 1,
        "amount": 1500.50,
        "dueDate": "2023-08-20",
        "description": "Monthly groceries"
        }
    ```
- Response:
```json
    {
    "status": "success",
    "data": {
        "loan": {
        "id": 1,
        "customerId": 1,
        "amount": 1500.50,
        "remainingAmount": 1500.50,
        "dueDate": "2023-08-20T00:00:00.000Z",
        "status": "pending",
        "description": "Monthly groceries",
        "createdAt": "2023-07-20T12:05:00.000Z"
        }
    }
    }
```

## 🚀 Deployment

- Live Demo: The application is hosted on Render
- Access it here: https://credikhaata-a3su.onrender.com

## Google Drive Upload 

- Access it here: 

## 👨‍💻 Author
- 💡 Developed by Dhruv Jaiswal
- 📧 Contact: dhruvujjain@gmail.com
