# Low-Level Design (LLD) - HAL: Intelligent Agriculture

## 1. Project Overview
**HAL** is an AI-driven platform designed to empower farmers by providing actionable insights to improve crop yield, detect diseases early, and optimize irrigation schedules. The solution bridges the gap between complex agricultural data and practical farming decisions through an intuitive user interface and a robust backend engine.

### Problem Statement
Create AI solutions to help farmers:
*   **Improve Crop Yield**: Through data-driven insights and forecasting.
*   **Detect Diseases**: Early identification of crop pathogens using visual analysis.
*   **Optimize Irrigation**: Intelligent scheduling based on weather and soil data.

---

## 2. System Architecture

### 2.1 Frontend Architecture (React + Vite)
The frontend is built for performance and a premium user experience.

*   **Framework**: React 18 with Vite for fast builds and HMR.
*   **State Management**: `Zustand` for lightweight, scalable global state (handling user auth, UI states).
*   **Data Fetching**: `@tanstack/react-query` for synchronized server state and caching.
*   **Styling**: Tailwind CSS for utility-first styling, using a custom "Nurture Green" design system defined in `index.css`.
*   **UI Components**: `Shadcn UI` (Radix UI primitives) for accessible, consistent elements.
*   **Animations**: `Framer Motion` for page transitions and micro-interactions.

#### Key Modules:
1.  **Dashboard/Landing**: High-level overview of agricultural health.
2.  **Crop Disease Analyzer**: Interface for uploading crop images and viewing AI-generated diagnosis.
3.  **Irrigation Forecast**: Visual charts (via `Recharts`) showing recommended watering schedules based on real-time weather.
4.  **HAL AI (Floating Bot)**: A conversational assistant providing on-demand agricultural advice.

### 2.2 Backend Architecture (FastAPI)
A high-performance asynchronous API layer handling business logic and AI integrations.

*   **Framework**: FastAPI (Python) for rapid API development.
*   **Database**: PostgreSQL (hosted on Neon DB) for relational data persistence.
*   **ORM**: SQLAlchemy for database abstraction.
*   **Authentication**: JWT-based secure authentication.

#### Key Services:
1.  **Forecast Engine (`forecast_engine.py`)**: Processes soil type, crop type, and weather data to generate a 30-day irrigation calendar.
2.  **Weather Service (`weather_service.py`)**: Integrates with external APIs to fetch localized weather data.
3.  **Analysis Service**: Handles image processing for disease detection (planned/integrated).

---

## 3. Data Models (Low-Level)

### 3.1 User Model (`models/user.py`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Unique identifier |
| `email` | String | User's unique email |
| `hashed_password` | String | Encrypted password |
| `full_name` | String | User's name |

### 3.2 Crop Model (`models/crop.py`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Unique identifier |
| `name` | String | Name of the crop (e.g., Rice, Wheat) |
| `type` | String | Category of the crop |
| `user_id` | Integer (FK) | Owner of the crop record |

---

## 4. API Endpoints

### 4.1 Irrigation API
*   **POST** `/api/irrigation/forecast`
    *   **Input**: `lat`, `lon`, `crop_type`, `soil_type`, `field_area`.
    *   **Logic**: Calls `forecast_engine`, merges weather data, returns a day-by-day irrigation schedule.

### 4.2 Crop Management API
*   **GET** `/api/crops`: List all registered crops for a user.
*   **POST** `/api/crops/detect`: Upload image for disease detection.

---

## 5. Implementation Workflow

1.  **Data Input**: User provides parameters (location, crop type, soil moisture).
2.  **Processing**: The backend fetches external weather data and runs the Forecast Engine.
3.  **Visualization**: The frontend converts the JSON response into interactive Recharts and scheduling cards.
4.  **Action**: The farmer receives precise notifications on when and how much to irrigate.

---

## 6. Design Constraints & Future Scope
*   **Connectivity**: Offline-first capabilities for farmers in low-bandwidth areas (Future).
*   **Scalability**: Microservices architecture for handling high-volume image analysis.
*   **Edge AI**: Moving some disease detection logic to the client-side using TensorFlow.js for zero-latency results.
