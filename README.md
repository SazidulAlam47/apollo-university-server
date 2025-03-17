# Apollo University Backend

This project is a backend service for managing university operations, written in TypeScript.

## Features

- User authentication and authorization
- Student management
- Course management
- Faculty management
- Enrollment system
- Grading system
- Timetable management

## Technologies Used

- TypeScript
- Node.js
- Express.js
- MongoDB or any other database you're using
- JWT for authentication

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB (or your chosen database)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SazidulAlam47/university-management-backend.git
    cd university-management-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory and add your variables:
    ```env
    PORT=3000
    DB_URI=your_database_uri
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

To build and start the production server:

```bash
npm run build
npm start
```

# API Usage

## Authentication Endpoints

### Register a new user

**POST** `/api/auth/register`

### Login a user

**POST** `/api/auth/login`

## Student Endpoints

### Get all students

**GET** `/api/students`

### Add a new student

**POST** `/api/students`

## Course Endpoints

### Get all courses

**GET** `/api/courses`

### Add a new course

**POST** `/api/courses`

## Faculty Endpoints

### Get all faculty members

**GET** `/api/faculty`

### Add a new faculty member

**POST** `/api/faculty`

More endpoints can be added as per your application needs.
