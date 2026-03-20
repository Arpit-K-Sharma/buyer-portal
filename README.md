# Buyer Portal

A full-stack real estate Buyer Portal built with Node.js, Express, PostgreSQL, and React.

## How to Run the App

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally on port 5432)

### 1. Start the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Open `backend/.env` and ensure `DATABASE_URL` contains your correct PostgreSQL password. Example:
   ```env
   DATABASE_URL=postgres://postgres:your_password@localhost:5432/buyer_portal
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```
   *Note: The backend will automatically detect that the database doesn't exist, create it, create all tables, and seed the sample property data.*

### 2. Start the Frontend
1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the app:
   ```bash
   npm install
   npm run dev
   ```
3. Open **http://localhost:5173** in your browser.

---

## Example User Flow

1. **Sign Up**: Navigate to `http://localhost:5173`. Click the link to create a new account. Enter your name, email, and a secure password.
2. **Browse Properties**: Upon signing up, you are automatically logged in and redirected to the Dashboard where you can view all available seeded properties.
3. **Add a Favourite**: Click the heart icon (🤍) on any property card to save it to your favourites.
4. **View Favourites**: Click the "Favourites" link in the navigation bar to see a dedicated list of all properties you have saved.
5. **Manage Profile**: Click the "Profile" link to update your personal information, securely change your password with current-password confirmation, or delete your account.
