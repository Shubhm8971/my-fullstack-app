
# SYSTEM_CORE_V3.0 - Project Blueprint

## 1. Project Overview

SYSTEM_CORE_V3.0 is a secure, React-based monitoring dashboard designed for system administrators. It provides real-time insights into system health, log analysis, and administrative controls through a clean, dark-themed interface.

---

## 2. Core Features (As of Day 35)

*   **Authentication:** Secure user Login/Registration using local JWT authentication. The app features a split-entry point (`main.jsx`) to prevent rendering flickers during auth state verification.
*   **State Management:** Utilizes React's Context API (`SystemContext`) to provide shared state (theme, auth status, etc.) throughout the application.
*   **System Health Monitoring:** A `Navbar` component displays the live status of the server (`ONLINE`/`OFFLINE`), which is polled every 10 seconds.
*   **Data Visualization:** A `Dashboard` component renders a bar chart of system log events using the Recharts library, providing a quick visual summary of system activity.
*   **Log Management:**
    *   **Filtering:** Users can filter system logs by a specific date range.
    *   **Data Portability:** Functionality to export the currently filtered logs to a CSV file.
    *   **Administration:** A feature to purge all system logs from the database (restricted to admin-level users).
*   **Theming:** Supports toggling between `DARK` and `LIGHT` themes.
*   **Code Structure:** Refactored `App.jsx` into smaller, reusable components (`SystemLayout`, `Navbar`, `Dashboard`) located in the `src/components` directory for improved maintainability.

---

## 3. Core Features (As of Day 36) - Real-Time System Alerts

This feature transforms the dashboard from a passive monitoring tool into an active one, automatically notifying administrators of critical events.

*   **Backend (Node.js/Express):**
    *   **Alerts API:** New API endpoints (`/api/alerts`) for creating, retrieving, and deleting alert rules.
    *   **Server-Sent Events (SSE):** An SSE endpoint (`/api/events`) pushes real-time notifications to the client.
    *   **Alerting Engine:** Server-side logic (`server/alerting.js`) periodically checks system metrics (like log count) against defined alert rules and triggers events.
    *   **Modular Routing:** Server routes are now modular, managed through `server/routes/index.js` for better organization.

*   **Frontend (React):**
    *   **Alerts Manager:** A new `AlertsManager.jsx` component provides a UI for users to define and manage alert rules (e.g., "trigger if log count is above 100").
    *   **Real-Time Notifications:** A `Notifications.jsx` component displays incoming alerts as non-intrusive toast messages, ensuring administrators are immediately aware of important system events.

---

## 4. Plan for Future Development

*   **Expand Alerting Metrics:** Add more metrics for alerting, such as CPU usage, memory usage, and API response times.
*   **User-Specific Dashboards:** Allow users to customize their dashboard layout and the data they see.
*   **Advanced User Roles:** Implement more granular user roles and permissions.
*   **UI/UX Polish:** Further refine the user interface for a more polished and intuitive experience.
