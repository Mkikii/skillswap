# SkillSwap 

SkillSwap is a full-stack web application that connects people who want to learn new skills with experts willing to teach them. Users can browse skill listings, book sessions, and exchange knowledge in a community-driven platform.

##  Live Deployment and Teacher Marking Guide

The application is fully deployed and accessible via the following links:

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend (Client)** | Netlify | **https://mkikiiskillswap.netlify.app/** |
| **Backend (Server) API** | Railway | **https://skillswap-production-0e78.up.railway.app/** |

###  Easy Guide for Cloning and Marking

To set up and run the project locally for a complete review:

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd skillswap
    ```

2.  **Use the Deployed Branch:**
    All working code, including the final merges, is on the **`dev` branch** (which was used for the live deployment).
    ```bash
    git checkout dev
    ```

3.  **Run Backend (Server):**
    ```bash
    cd server
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    python seed.py # Optional: Populates the database with test data
    python app.py  # Starts the API server (default: http://localhost:5555)
    ```

4.  **Run Frontend (Client):**
    * **Crucial Step for Local Testing:** The frontend needs to point to your **local backend URL** (`http://localhost:5555`). Update the **`VITE_API_URL`** in the `client/.env.development` file if it exists, or create one:
        ```
        # client/.env.development
        VITE_API_URL=http://localhost:5555
        ```
    ```bash
    cd ../client
    npm install
    npm run dev  # Starts the web app (default: http://localhost:5173)
    ```
    Open `http://localhost:5173` in your browser.

---

##  Team Contribution Summary

This project was developed by a team of three. Please see the table below for a summary of contributions, highlighting the final scope of work taken on by **Maureen**:

| Team Member | Role | Final Contribution Scope |
| :--- | :--- | :--- |
| **Maureen (Me)** | Auth & Project Structure | **Lead Developer** (Authentication, Project Structure, **Full Backend** development, Merging/Gitflow, and Deployment setup). |
| **Andrew** | Frontend | Core Frontend setup and initial features. |
| **Odour** | Backend | Initial contribution only. |

---

##  Features

-   **User Authentication**: Secure login and registration with JWT tokens
-   **Skill Listings**: Browse and create listings for skills you can teach
-   **Session Booking**: Schedule and manage learning sessions
-   **Reviews & Ratings**: Leave feedback for completed sessions

## Tech Stack

### Backend (Server)
-   **Flask**: Python web framework
-   **SQLAlchemy**: ORM for database management
-   **Flask-JWT-Extended**: JWT authentication
-   **PostgreSQL**: Database (used in production)

### Frontend (Client)
-   **React**: JavaScript library
-   **React Router**: Client-side routing
-   **Tailwind CSS**: Utility-first CSS framework
-   **Vite**: Build tool

---

## Testing

The project includes various test files in the `server/` directory:
-   Run all backend tests with: `python -m pytest server/`

---

##  Deployment Details

### Backend Deployment (Railway)
-   Uses the **`Dockerfile`** and **`Procfile`** provided in the `server/` directory.
-   The application runs using **Gunicorn** in the production environment.

### Frontend Deployment (Netlify)
-   Deployed from the **`dev` branch** to Netlify.
-   Build command: `npm run build`
-   Publish directory: `dist`
