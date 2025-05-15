# Club-Membership

A full-stack club membership management platform with authentication, session booking, payments, and more.

For Live build go to: -Honours-Project-Club-Enrolment-Portal.vercel.app
GitHub: https://github.com/d-g-Szabo/-Honours-Project-Club-Enrolment-Portal

## Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- **PostgreSQL** (or Supabase, if using Supabase)
- (Optional) **Docker** for running databases locally

## Project Structure

```
Club-Membership/
  backend/      # NestJS API (sessions, auth, payments, etc.)
  frontend/     # Next.js app (user dashboard, login, etc.)
```

---

## 1. Backend Setup

### 1.1. Install dependencies
```bash
cd backend
npm install
```

### 1.2. Environment variables
Rename `.env.example` to `.env` and fill in your database and Supabase credentials:
This should already have my credentials but if you want yours you will need:
	- SUPABASE database
	- Paypal developer account for dev sandbox
	- Frontend url by default should be http://localhost:3000


### 1.3. Database setup
- Make sure your PostgreSQL/Supabase instance is running.
- Run migrations if needed (see below for steps).

#### Running Migrations

##### If you are using **Supabase**:
1. Install the Supabase CLI (if not already):
   ```bash
   npm install -g supabase
   ```
2. Login to Supabase:
   ```bash
   supabase login
   ```
3. Initialize Supabase (if not already):
   ```bash
   supabase init
   ```
4. Apply migrations to your local database:
   ```bash
   supabase db push
   ```
5. To apply migrations to your remote Supabase project:
   ```bash
   supabase db push --project-ref <your-project-ref>
   ```
   (Find your project ref in the Supabase dashboard URL)
6. To create a new migration:
   ```bash
   supabase migration new <migration-name>
   ```
   (Edit the generated SQL file in `supabase/migrations/`)

##### If you are using a Node.js migration tool:

- **TypeORM**
  - Generate a migration:
    ```bash
    npm run typeorm migration:generate -- -n MigrationName
    ```
  - Run migrations:
    ```bash
    npm run typeorm migration:run
    ```
- **Prisma**
  - Generate migration:
    ```bash
    npx prisma migrate dev --name init
    ```
  - Deploy migration to production:
    ```bash
    npx prisma migrate deploy
    ```
- **Knex**
  - Run migrations:
    ```bash
    npx knex migrate:latest
    ```

- You have SQL files in db/migrations, you can also do it manually, connect to your database and run the scripts using the SQL editor.
- Set the messages table to Realtime on.

### 1.4. Start the backend server
```bash
npm run start:dev
```
The backend will run on `http://localhost:3001` by default.

---

### 1.5. Install ngrok https://ngrok.com/downloads/windows or:
```bash
npm install ngrok -g
```

### 1.6. Start ngrok
```bash
ngrok http 3001
```

- Copy ngrok "Forwarding" address
- In Paypal (to make payment work in localhost) go to Sandbox accounts
- Select account
- Select Default application (or any other named app)
- Sandbox Webhooks at the bottom, add webhook
- Paste the copied url and select in "Payments & Payouts" the "Payment capture completed"
- Click on Save



## 2. Frontend Setup

### 2.1. Install dependencies
```bash
cd ../frontend
npm install
```

### 2.2. Environment variables
Rename `.env.example` to `.env` and set the Supabase keys. (Again, this should be done, but if you want to use your own database do it again.)

### 2.3. Start the frontend app
```bash
npm run dev
```
The frontend will run on `http://localhost:3000` by default.

---

## 3. Useful Commands

### Backend
- `npm run start:dev` — Start backend in development mode
- `npm run build` — Build backend
- `npm run test` — Run backend tests

### Frontend
- `npm run dev` — Start frontend in development mode
- `npm run build` — Build frontend
- `npm run start` — Start production frontend

---

## 4. Notes
- Make sure both backend and frontend `.env` files are configured correctly.
- The backend uses Supabase/PostgreSQL for data storage.
- The frontend uses Next.js (React) and expects the backend to be running.
- For production, set proper CORS, secrets, and environment variables.

---

## 5. Troubleshooting
- If you see connection errors, check your `.env` files and database status.
- For Supabase, ensure your tables and policies are set up as expected.
- For further help, check the code comments or open an issue.

---

## 6. License
MIT 