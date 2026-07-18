# SagarVK18 Streaming Platform

A premium, full-stack video streaming platform (similar to Netflix/Prime Video) built with a Spring Boot backend and a React + Vite frontend.

## 🚀 Key Features

*   **Authentication & Security**: Secure user registration and login with stateless **JWT tokens** and robust **Spring Security** filters.
*   **Multi-Profile Management**: Supports multiple sub-profiles (e.g., standard/kids profiles) under a single user account context.
*   **Dynamic Landing & Home Dashboard**: Interactive featured banners and touch-enabled, swipable content rows powered by **Swiper**.
*   **Media Playback**: Custom-controlled media player supporting playback states, volume adjustment, and full-screen modes using **React Player**.
*   **Content Catalog & Search**: Advanced search and categorization filtering movies and series by genres.
*   **Watchlists & History**: Real-time management of user watchlists and automatic watch history tracking per profile.
*   **Subscription & Account Management**: Simulated billing, payment processing, and subscription plan management.
*   **Admin Dashboard**: Dedicated management portal to add/modify movies, seasons, episodes, view user accounts, and track metrics.

---

## 🛠️ Tech Stack

### Backend
*   **Framework**: Spring Boot 3.2.0 (Spring Web, Spring Security, Spring Data JPA)
*   **Security**: JSON Web Tokens (JWT) for stateless authentication
*   **Database**: MySQL (default configuration), support for PostgreSQL
*   **ORM / Mapping**: Hibernate / JPA
*   **Build Tool**: Maven

### Frontend
*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Routing**: React Router DOM v6
*   **Animations**: Framer Motion
*   **Carousels & UI Elements**: Swiper, React Icons, React Hot Toast
*   **Media Player**: React Player
*   **HTTP Client**: Axios (with custom auth interceptors)

---

## 💻 Getting Started

### Prerequisites
*   Java Development Kit (JDK) 17+
*   Node.js (v18+) & npm
*   MySQL Server (running locally or remotely)

---

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a MySQL database named `sagarvk18_streaming`:
   ```sql
   CREATE DATABASE database_name;
   ```

3. Update the database credentials in `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/sagarvk18_streaming?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: <your-mysql-username>
       password: <your-mysql-password>
   ```

4. Build and run the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
   *Note: On the first run, the database tables will be created automatically, and `DataSeeder.java` will insert sample content.*

---

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🐳 Docker Deployment

The backend contains a multi-stage Dockerfile for containerized deployment.

1. Build the Docker image:
   ```bash
   docker build -t streaming-backend ./backend
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:mysql://<host>:<port>/sagarvk18_streaming -e SPRING_DATASOURCE_USERNAME=<user> -e SPRING_DATASOURCE_PASSWORD=<password> streaming-backend
   ```

---

## 📂 Project Structure

```text
├── backend
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/sagarvk18/streaming
│       ├── config/         # Security configs, JWT filters, data seeding
│       ├── controller/     # REST Controllers
│       ├── dto/            # Data Transfer Objects (Requests/Responses)
│       ├── entity/         # JPA Entities (User, Content, Rating, etc.)
│       ├── repository/     # JPA Repositories
│       ├── service/        # Business Logic Services
│       └── util/           # Utility helpers (JwtUtil)
│
└── frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/            # API endpoints & Axios configuration
        ├── components/     # Reusable UI elements (Navbar, Cards, Player)
        ├── context/        # React Contexts (Auth and Profile context)
        ├── pages/          # Page Views (Home, Landing, Admin, etc.)
        └── styles/         # CSS Styling
```
