# 🧑‍🌾 FreshFarms – Digital Dairy Management System

**FreshFarms** is a full-stack dairy management platform that digitizes farm transactions, customer interactions, and real-time updates. Built with a modular architecture using React, Node.js, and OAuth2 authentication, the system helps dairy cooperatives and farmers streamline their operations.

> ⚡ Built using a multi-service architecture (frontend, API, and OAuth server), with extensible features like geolocation, charts, and real-time WebSocket updates.

---

## 🗂️ Repository Structure

| Repo | Description |
|------|-------------|
| [freshfarms-react-app](https://github.com/tsabudh/freshfarms-react-app) | Frontend built with React |
| [freshfarms-express-server](https://github.com/tsabudh/freshfarms-express-server) | REST API (product, customer, transaction management) |
| [freshfarms-oauth-server](https://github.com/tsabudh/freshfarms-oauth-server) | OAuth2 Authorization Code Flow with PKCE and JWT |

---
## Features

-   **Digital Logging**: Easy and accurate logging of daily product purchases, sales, and inventory.
-   **User Authentication**: Secure login system for staff and administrators.
-   **Data Analytics**: Visualize data through charts and graphs to monitor trends and performance.
-   **Inventory Management**: Track inventory levels, manage stock, and reduce waste.

## Technologies Used

-   **Frontend**: React, Context API, SCSS Modules, Leaflet.js
-   **Backend**: Node.js, Express, Mongoose, WebSocket
-   **Database**: MongoDB,
-   **Authentication**: JWT (JSON Web Tokens), OAuth2 Authorization Server
-   **Charting**: Chart.js
-   **Styling**: CSS, SCSS

## Infrastructure & Dev Tools
- ESLint, Prettier, Husky
- GitHub Actions (CI-ready)
- Postman (API docs)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/tsabudh/freshfarms-react-app
    cd freshfarms-react-app
    ```
2. **Install the dependencies**:
    ```
    npm install
    ```
3. **Run the application**:
    ```
    npm run dev
    ```
