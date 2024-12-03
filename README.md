# Tech Blog

![Go Version](https://img.shields.io/badge/go-v1.20-blue)  
![React](https://img.shields.io/badge/react-v18.2.0-blue)  
![License](https://img.shields.io/badge/license-MIT-yellow)

## Description

**Tech Blog** is a full-stack blogging platform that allows users to create, read, update, and delete posts and comments. It features a React frontend and a Gin-based Go backend. The app uses PostgreSQL for data storage and manages user authentication with cookies.

---

## Table of Contents

- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Features](#features)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Known Issues and Future Enhancements](#known-issues-and-future-enhancements)
- [Contributions](#contributions)
- [License](#license)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

---

## Installation

To run this project, set up the frontend and backend environments as described below.

---

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. To create a production build:
   ```bash
   npm run build
   ```

---

## Backend Setup

1. Navigate to the project root.
2. Create a `.env` file with the following content:
   ```env
   USER=<Your-Postgres-Username>
   PASS=<Your-Postgres-Password>
   DBNAME=<Your-Database-Name>
   PORT=8005
   ```
3. Install dependencies:
   ```bash
   go mod tidy
   ```
4. Start the backend server:
   ```bash
   go run main.go
   ```
5. Ensure your PostgreSQL database is running and matches the credentials in the `.env` file.

---

## Features

- **User Authentication**: Secure login and signup using cookies.
- **CRUD Operations**:
    - Create, Read, Update, and Delete posts.
    - Add, Edit, and Delete comments.
- **Responsive Design**: Optimized for various screen sizes using Vite and React.
- **Session Management**: Authentication with cookies and session expiration handling.

---

## Usage

### Running the App

1. Start the backend server.
2. Start the frontend development server.
3. Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

### Environment Requirements

- **Node.js**: v16.x or later
- **Go**: v1.20 or later
- **PostgreSQL**: v13 or later

---

## API Endpoints

### Authentication
- `POST /api/login`: User login
- `POST /api/signup`: User registration
- `GET /api/logout`: User logout

### Posts
- `GET /api/posts`: Fetch all posts
- `GET /api/posts/:id`: Fetch a single post by ID
- `POST /api/posts`: Create a new post
- `PUT /api/posts/:id`: Update a post
- `DELETE /api/posts/:id`: Delete a post

### Comments
- `POST /api/comments`: Add a new comment
- `PUT /api/comments/:id`: Update a comment
- `DELETE /api/comments/:id`: Delete a comment

---

## Known Issues and Future Enhancements

### Known Issues
- **Session Expiry**: Sessions are not currently refreshed automatically.
- **Error Handling**: Detailed error messages for API failures need improvement.

### Future Enhancements
1. **Search and Filter Posts**: Add functionality to search and filter posts based on keywords or categories.
2. **User Profiles**: Allow users to update and view profiles.
3. **Post Likes and Comment Counts**: Display likes and comment counts for each post.
4. **Image Uploads**: Add support for uploading images to posts.
5. **Pagination**: Improve performance by paginating posts and comments.
6. **Test Suite**: Add unit and integration tests for the backend and frontend.

---

## Contributions

Contributions, bug reports, and feature requests are welcome!

To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/my-feature
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## Authors

- **Omar X**: Full-stack developer and project maintainer.
- Contributions by the open-source community.

---

## Acknowledgments

Special thanks to the developers who created libraries and tools used in this project:
- **Gin**: Web framework for the backend.
- **Vite.js**: Lightning-fast frontend development.
- **SweetAlert2**: Elegant notifications.

--- 
