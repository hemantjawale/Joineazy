# Joineazy Technical Documentation

**Live Application:** [https://joineazy-1.onrender.com](https://joineazy-1.onrender.com)

## 1. Overview of Implementation

Joineazy is a full-stack educational management platform designed to streamline the workflow between professors and students. It facilitates assignment distribution, group formation, task delegation, internal group communication, and submission grading.

The system enforces strict role-based access control (RBAC), ensuring that professors have administrative oversight over assignments and group analytics, while students are empowered to form collaborative teams, manage internal task boards, and submit proof of work. 

The application is built using a modern decoupled architecture:
- **Frontend**: React.js with Vite, leveraging Tailwind CSS for a responsive, modular design system, and React Router for client-side navigation.
- **Backend**: Express.js REST API providing secure, stateless communication.
- **Database**: PostgreSQL with Sequelize ORM for structured data persistence and complex relational mapping.
- **Real-time Communication**: Socket.io for live group chat features.

---

## 2. Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL (v14 or higher recommended)
- Docker (optional, if running via containerization)

### Database Configuration
1. Create a local PostgreSQL database named `joineazy`.
2. Navigate to the `Backend` directory and configure the environment variables:
   Create a `.env` file with the following variables:
   ```env
   PORT=5000
   DB_NAME=joineazy
   DB_USER=postgres
   DB_PASS=your_password
   DB_HOST=localhost
   JWT_SECRET=your_secure_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Backend
```bash
cd Backend
npm install
npm run dev
```
*Note: The backend utilizes Sequelize's `alter: true` synchronization on startup to ensure the database schema matches the models without dropping tables.*

### Running the Frontend
```bash
cd Fronend/joineazy
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### Running via Docker (Optional)
Ensure you have a `docker-compose.yml` configured for PostgreSQL, the Node.js backend, and the React frontend.
```bash
docker-compose up --build
```

---

## 3. Database Schema & Relationships

The database is highly relational, utilizing UUIDs for primary keys to ensure security against enumeration attacks.

<img src = "Fronend\joineazy\public\document.png">

## 4. API Endpoint Details

All endpoints (except Authentication) require a valid JWT Bearer token.

### Authentication (`/api/auth`)
- `POST /register`: Registers a new user. Returns JWT and user context.
- `POST /login`: Authenticates user credentials. Returns JWT.
- `GET /me`: Validates current token and returns user profile.

### Assignments (`/api/assignments`)
- `GET /`: Retrieves assignments relevant to the user's role.
- `GET /:id`: Retrieves specific assignment details.
- `POST /`: Creates an assignment *(Professor only)*.

### Groups & Invitations (`/api/groups`)
- `GET /`: Retrieves all active groups for the authenticated student.
- `GET /invitations`: Retrieves pending group invitations.
- `POST /`: Creates a new group and assigns the creator as the active `leader`.
- `POST /:id/members`: Invites a student to the group via email (creates a `pending` membership).
- `POST /:id/invitations/accept`: Accepts a pending invitation.
- `POST /:id/invitations/reject`: Declines a pending invitation.
- `DELETE /:id/members/:userId`: Removes a member *(Group leader only)*.

### Submissions & Grading (`/api/submissions`)
- `POST /confirm`: Submits or confirms an assignment (accepts `proofText`).
- `POST /grade/:id`: Grades a submission (accepts `grade` and `feedback`) *(Professor only)*.
- `GET /assignment/:id`: Retrieves all submissions for a specific assignment *(Professor only)*.
- `GET /mine`: Retrieves the authenticated student's submissions.

### Tasks (`/api/tasks`)
- `GET /group/:groupId`: Retrieves all tasks for a specific group.
- `POST /group/:groupId`: Creates a new task and assigns it to a group member.
- `PUT /:taskId/status`: Updates a task's progress state (`todo`, `in_progress`, `done`).

---

## 5. Architecture Overview

Joineazy employs a client-server architecture. 

### Frontend Flow
The React frontend utilizes a centralized `AuthContext` to manage the JWT token lifecycle and role-based routing. The application uses `react-router-dom` layout wrappers (`RequireAuth` and `RequireGuest`) to secure protected routes. Axios interceptors automatically attach the Authorization header to all outgoing requests.

State management is handled via custom React hooks (e.g., `useGroups`, `useSubmissions`) that abstract the API interactions and manage local loading/error states, promoting component reusability.

### Backend Flow
The Express.js backend follows a standard Controller-Route pattern. Incoming HTTP requests pass through the following middleware pipeline:
1. **Security & Parsing**: `helmet`, `cors`, and `express.json()`.
2. **Authentication**: `auth.js` verifies the JWT and attaches the user payload to the request object.
3. **Authorization**: `authorize.js` ensures the user possesses the required role (Student or Professor).
4. **Validation**: `express-validator` middleware sanitizes and validates the request body.
5. **Controller**: Executes the business logic using Sequelize ORM to query/mutate the PostgreSQL database.
6. **Error Handling**: Centralized error middleware catches unhandled exceptions to prevent stack trace leaks.

### Real-time Flow
Socket.io is initialized on the main HTTP server instance. When a user navigates to a group detail page, the client establishes a WebSocket connection and emits a `join_group` event, subscribing them to a specific room. When messages are created, they are saved to PostgreSQL via the REST API, and broadcasted to the group's specific Socket.io room for instant client updates.

---

## 6. Key Design and Deployment Decisions

1. **Invitation-Based Group Joining**: To prevent unauthorized or accidental group modifications, the system utilizes a strict invitation workflow. Adding a member does not grant them immediate access; it creates a `pending` membership that the invited student must explicitly accept.
2. **Two-Step Submission Workflow**: Submissions use a state machine (`pending` -> `confirmed` -> `graded`). This allows students to indicate intent to submit (Step 1) and subsequently provide final proof of work (Step 2) before it reaches the professor for grading.
3. **Soft-Grading String Design**: The `grade` field in the database is defined as a String rather than an Integer. This allows professors flexibility in grading criteria (e.g., "Correct", "A+", "85/100") without forcing the system into a rigid point-based structure.
4. **Environment Abstraction via Vite**: The frontend uses Vite for rapid HMR (Hot Module Replacement) and relies on `.env` configuration for API endpoints. This ensures seamless transitions between local development and production environments.
5. **Database Synchronization**: The application uses Sequelize's `sync({ alter: true })`. This allows the database schema to evolve non-destructively alongside the codebase during development, avoiding the need for complex manual migrations until the application reaches production maturity.
