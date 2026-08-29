# Joineazy

A full-stack educational management platform streamlining the workflow between professors and students.

## UI and UX Design Overview

The design of Joineazy prioritizes a modern, engaging, and frictionless user experience. We have adopted a "Glassmorphism" aesthetic throughout the application, characterized by semi-transparent frosted glass panels, vibrant gradient backgrounds, and soft drop shadows. 

**Key Design Choices and Reasoning:**
- **Glassmorphism Aesthetic:** By using frosted glass cards (`glass-panel`, `glass-card`), the interface feels lightweight and deeply integrated with its vibrant backgrounds. This reduces visual clutter and provides a premium, modern feel that keeps students engaged.
- **Role-Based Interfaces:** Professors and students have entirely distinct dashboard experiences. The student dashboard focuses on urgent tasks, active coursework, and group collaboration. The professor dashboard focuses on high-level analytics, assignment creation, and grading overviews.
- **Collapsible Navigation:** The main sidebar navigation is collapsible to maximize screen real estate, especially crucial when students are viewing complex assignments or professors are reviewing detailed grading rubrics.
- **Dynamic Micro-Interactions:** Hover effects, smooth transitions, and subtle animations (like the pop-in effects on submissions) provide immediate visual feedback, making the application feel responsive and alive.
- **Contextual Progress Tracking:** Complex workflows, such as Group Assignments, feature built-in progress bars that aggregate sub-task completion. This visual indicator immediately communicates the status of group work to both the students and the overseeing professor without requiring deep investigation.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

### 1. Database Configuration
Create a local PostgreSQL database named `joineazy`.
Navigate to the `Backend` directory and create a `.env` file based on your local setup:
```env
PORT=5000
DB_NAME=joineazy
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### 2. Running the Backend
Open a terminal and navigate to the `Backend` directory:
```bash
cd Backend
npm install
npm run dev
```
The backend uses Sequelize to automatically synchronize and build the database schema on startup.

### 3. Running the Frontend
Open a separate terminal and navigate to the `Fronend/joineazy` directory:
```bash
cd Fronend/joineazy
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## UI Flow Demonstrations

*Note: Replace the placeholder image paths with actual screenshots of your application.*

### Landing Page & Authentication
Users are greeted with a vibrant hero section outlining the platform's value. From here, they can navigate to a clean, centralized login portal that automatically directs them to the correct dashboard based on their role.
![Landing Page](Fronend/joineazy/public/heroimg.png)

### Student Dashboard & Coursework
Students view their active courses and upcoming deadlines. Clicking into a course filters their assignments specifically for that subject.


### Assignment Management & Work Distribution
In group assignments, team leaders can assign specific sub-tasks to members. A progress bar updates in real-time as tasks are completed, syncing visibility between the team and the professor.

## Component Architecture

Joineazy utilizes a modular, decoupled architecture leveraging React for the frontend and Express.js for the backend.

### Frontend Structure
- **Context Providers:** Global state like authentication (`AuthContext`) is wrapped at the root level to provide secure, role-based routing throughout the component tree.
- **Layout Wrappers:** Components like `DashboardLayout` and `Sidebar` act as structural shells. They manage responsive behaviors (like the collapsible sidebar) and render nested route components via React Router's `<Outlet />`.
- **UI Components (`/src/components/ui`):** Reusable, atomic design components (Buttons, Inputs, Badges, Progress Bars) ensure strict design consistency.
- **Custom Hooks (`/src/hooks`):** Business logic and API calls are abstracted into custom hooks (e.g., `useSubmissions`, `useGroups`). This keeps presentation components clean and focused purely on rendering UI state.

### Backend Structure
- **Middleware Pipeline:** Incoming requests are routed through security headers, JWT authentication, role authorization, and validation middleware before reaching the controller.
- **Controllers & Models:** Controllers handle the core business logic, utilizing Sequelize ORM models to interact with the PostgreSQL database. Relationships (One-to-Many, Many-to-Many) are strictly defined in the models to ensure data integrity for complex features like Group Memberships and Task Distribution.