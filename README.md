# DataSea

DataSea is a full-stack analytics dashboard for turning structured data files into private visual reports.

Users can upload CSV, JSON, or XLSX files, generate automatic analysis, review charts and summary statistics, and save reports inside a private authenticated workspace.

The main purpose of DataSea is to help users understand datasets quickly without manually reading every row in a spreadsheet or raw data file.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Main Features](#main-features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Database Design](#database-design)
* [API Routes](#api-routes)
* [Environment Variables](#environment-variables)
* [Installation and Setup](#installation-and-setup)
* [Running the Project](#running-the-project)
* [Usage Flow](#usage-flow)
* [Supported File Types](#supported-file-types)
* [Security Features](#security-features)
* [Current MVP Limitations](#current-mvp-limitations)
* [Build and Syntax Checks](#build-and-syntax-checks)
* [Demo Checklist](#demo-checklist)

---

## Project Overview

DataSea is designed for users who want to upload structured data and receive an understandable report without manually inspecting the file.

After uploading a dataset, DataSea generates:

* row count
* column count
* detected columns
* detected data types
* missing value analysis
* duplicate row count
* numeric statistics
* categorical frequencies
* outlier detection
* textual insights
* automatic chart data
* visual charts
* table preview

Reports are private. A user can only see their own uploaded reports after logging in.

The project follows a professional full-stack architecture with a React frontend, an Express backend, and MongoDB Atlas as the database.

---

## Main Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected frontend routes
* Protected backend routes
* Session restoration with `/api/auth/me`
* Logout and session clearing

### File Upload and Analysis

* Upload CSV files
* Upload JSON files
* Upload XLSX files
* Validate file type
* Validate file size
* Parse uploaded files on the backend
* Generate analysis before saving
* Show analysis preview to the user
* Let the user confirm or rename the suggested report title before saving

### Report Management

* Save generated reports
* View saved report history
* Open report detail pages
* Rename reports
* Add tags
* Set report category
* Soft-delete reports from history
* Keep reports private per user

### Visual Analysis

* Bar charts
* Pie charts
* Line charts
* Histograms
* Table preview
* Responsive chart layout
* Automatic chart rendering from backend-generated chart data

### User Interface

* Dashboard page
* Upload page
* Report history page
* Report detail page
* Profile page
* Settings page
* Login page
* Register page
* Protected layout with navbar and sidebar
* Loading states
* Error states
* Empty states
* Responsive design

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* Context API
* Redux Toolkit
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Multer
* Joi
* Helmet
* express-rate-limit
* dotenv

### Development Tools

* VS Code
* REST Client extension
* MongoDB Compass
* PowerShell
* Git

---

## Project Structure

```txt
DataSea
├── client
│   ├── src
│   │   ├── components
│   │   │   ├── common
│   │   │   ├── layout
│   │   │   ├── reports
│   │   │   └── upload
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── store
│   │   │   └── slices
│   │   ├── utils
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── utils
│   ├── validation
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   └── server.js
│
├── rest-client
│   └── sample-files
│
├── README.md
└── package.json
```

---

## Database Design

DataSea uses MongoDB with Mongoose models.

### User Collection

The `User` collection stores registered users.

Main fields:

* `name`
* `email`
* `password`
* `role`
* `createdAt`
* `updatedAt`

Passwords are hashed before being stored.

### AnalysisReport Collection

The `AnalysisReport` collection stores saved report data.

Main fields:

* `owner`
* `title`
* `tags`
* `descriptionCategory`
* `originalFileName`
* `storedFileName`
* `storedFilePath`
* `mimeType`
* `fileType`
* `fileSize`
* `fileRetentionExpiresAt`
* `isOriginalFileAvailable`
* `rowCount`
* `columnCount`
* `columns`
* `summaryStatistics`
* `missingValues`
* `duplicateRowCount`
* `outlierSummary`
* `textualInsights`
* `chartData`
* `tablePreview`
* `isDeleted`
* `deletedAt`
* `createdAt`
* `updatedAt`

The original uploaded file is retained temporarily. The generated report remains saved after the original file retention period.

---

## API Routes

Base URL:

```txt
http://localhost:5000/api
```

### Health Route

```http
GET /api/health
```

Checks whether the backend API is running.

---

### Auth Routes

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

#### Register

```http
POST /api/auth/register
```

Creates a new user account.

Expected body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
```

Logs in an existing user.

Expected body:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Current User

```http
GET /api/auth/me
```

Returns the currently authenticated user.

Requires:

```http
Authorization: Bearer <token>
```

---

### Report Routes

All report routes require authentication.

Required header:

```http
Authorization: Bearer <token>
```

#### Get Reports

```http
GET /api/reports
```

Returns the logged-in user's saved reports.

Optional query parameters:

```txt
page
limit
```

Example:

```http
GET /api/reports?page=1&limit=10
```

#### Get Report by ID

```http
GET /api/reports/:id
```

Returns one saved report if it belongs to the logged-in user.

#### Upload Dataset

```http
POST /api/reports/upload
```

Uploads and analyzes a dataset before saving it as a report.

Expected form-data field:

```txt
dataset
```

Supported file extensions:

```txt
.csv
.json
.xlsx
```

#### Save Report

```http
POST /api/reports
```

Saves a generated report after the user confirms or renames the report title.

#### Update Report

```http
PUT /api/reports/:id
```

Updates report metadata such as title, tags, or category.

#### Delete Report

```http
DELETE /api/reports/:id
```

Soft-deletes a report from the user's history.

The report document remains in MongoDB with `isDeleted: true`.

---

## Environment Variables

Environment variables are required for both the backend and frontend.

Never commit real `.env` files.

---

### Server Environment

Create this file:

```txt
server/.env
```

Use this shape:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/datasea?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=20
```

The matching example file should be:

```txt
server/.env.example
```

It must not contain real secrets.

---

### Client Environment

Create this file:

```txt
client/.env
```

Use:

```env
VITE_API_URL=http://localhost:5000/api
```

The matching example file should be:

```txt
client/.env.example
```

---

## Installation and Setup

### 1. Open the project

```powershell
cd H:\DataSea
```

### 2. Install backend dependencies

```powershell
cd H:\DataSea\server
npm install
```

### 3. Install frontend dependencies

```powershell
cd H:\DataSea\client
npm install
```

### 4. Configure backend environment

Create:

```txt
H:\DataSea\server\.env
```

Add the required server environment variables.

Make sure:

* MongoDB Atlas connection string is valid
* MongoDB Atlas network access allows your current IP
* `JWT_SECRET` is long and private
* `CLIENT_URL` matches the frontend URL

### 5. Configure frontend environment

Create:

```txt
H:\DataSea\client\.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Project

### Start the backend

```powershell
cd H:\DataSea\server
npm run dev
```

Expected output:

```txt
MongoDB connected
DataSea API running in development mode on port 5000
```

Backend URL:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

---

### Start the frontend

Open another terminal:

```powershell
cd H:\DataSea\client
npm run dev
```

Expected output:

```txt
Local: http://localhost:5173/
```

Frontend URL:

```txt
http://localhost:5173
```

---

## Usage Flow

1. Open the frontend at `http://localhost:5173`.
2. Register a new user.
3. Log in.
4. Open the dashboard.
5. Go to the Upload page.
6. Select a CSV, JSON, or XLSX file.
7. Click upload and analyze.
8. Review the generated analysis preview.
9. Review the summary cards, charts, insights, and table preview.
10. Click save report.
11. Confirm or rename the suggested report title.
12. Open the Reports page.
13. Click a saved report.
14. Review the report detail page.
15. Update metadata if needed.
16. Delete the report from history if needed.

---

## Supported File Types

The MVP supports:

```txt
.csv
.json
.xlsx
```

PDF table extraction is intentionally outside the current MVP.

---

## Security Features

DataSea includes the following security measures:

* JWT authentication
* bcrypt password hashing
* protected backend routes
* protected frontend routes
* owner-scoped report queries
* soft delete for reports
* Helmet security headers
* CORS restricted to the frontend URL
* general API rate limiting
* stricter authentication rate limiting
* file type validation
* file size validation
* environment variables for secrets
* `.env` files ignored by Git

---

## Privacy Rules

* Users must log in to access reports.
* Users can only access their own reports.
* Reports are not public.
* Reports are not shared by URL.
* Original uploaded files are retained temporarily.
* Saved analysis reports remain available after original file retention expires.

---

## Current MVP Limitations

The following features are not part of the current MVP:

* PDF table extraction
* public report sharing
* custom user-built charts
* admin dashboard
* file export/download
* scheduled analysis
* team workspaces
* advanced role management
* permanent original-file storage

These can be added in later versions.

---

## Build and Syntax Checks

### Frontend build

```powershell
cd H:\DataSea\client
npm run build
```

Expected result:

```txt
built in ...
```

### Backend syntax checks

```powershell
cd H:\DataSea\server
node -c app.js
node -c server.js
node -c routes\authRoutes.js
node -c routes\reportRoutes.js
node -c controllers\reportController.js
node -c middleware\authMiddleware.js
node -c middleware\errorHandler.js
node -c middleware\authRateLimiter.js
```

Expected result:

```txt
No output
```

No output means the files passed syntax checking.

---

## REST Client Testing

The project can be tested with the VS Code REST Client extension.

Suggested test order:

1. Health check
2. Register user
3. Login user
4. Get current user
5. Upload dataset
6. Save report
7. Get report list
8. Get report detail
9. Update report
10. Delete report

Sample files can be stored in:

```txt
H:\DataSea\rest-client\sample-files
```

---

## Demo Checklist

Before presenting the project, verify:

* Backend starts successfully.
* MongoDB Atlas connects.
* Frontend starts successfully.
* Register works.
* Login works.
* Protected routes redirect when logged out.
* Dashboard loads after login.
* Upload page accepts CSV, JSON, and XLSX.
* Invalid file types are rejected.
* Upload analysis preview appears.
* Charts render.
* Insights render.
* Table preview renders.
* Report save works.
* Report history loads.
* Report detail opens.
* Metadata update works.
* Soft delete works.
* Deleted report disappears from the report list.
* Deleted report remains in MongoDB with `isDeleted: true`.
* Frontend production build succeeds.
* Backend syntax checks pass.

---

## Recommended Git Ignore Rules

Root `.gitignore` should include:

```gitignore
node_modules
.env
.env.local
dist
build
coverage
uploads
.DS_Store
```

Server `.gitignore` should include:

```gitignore
node_modules
.env
uploads
coverage
dist
.DS_Store
```

Client `.gitignore` should include:

```gitignore
node_modules
.env
.env.local
dist
coverage
.DS_Store
```

---

## Future Improvements

Possible future improvements include:

* PDF table extraction
* report export to PDF
* report export to CSV
* downloadable original file during retention period
* custom chart builder
* saved chart preferences
* admin dashboard
* user profile editing
* advanced settings
* report search and filtering
* report sorting
* cloud deployment
* automated file cleanup job
* stronger production logging
* test suite with Jest or Vitest

---

## Author

DataSea was built as a full-stack final project using React, Node.js, Express, and MongoDB.

The project focuses on practical data analysis, private report management, and a polished dashboard user experience.
