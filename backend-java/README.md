# CarePulse Hospital Management System — Java Spring Boot Backend

Enterprise RESTful API backend for CarePulse Hospital & Medical Center, designed to integrate seamlessly with the modern HTML5, CSS3, JavaScript, and React 19 Frontend.

---

## 🛠️ Technology Stack
- **Language**: Java 17+
- **Framework**: Spring Boot 3.2.x (Spring MVC, Bean Validation, Jackson JSON)
- **Architecture**: Domain-Driven Layered Architecture (Controller -> Service -> Model & DTOs)
- **Cross-Origin**: CORS enabled for `http://localhost:5173` (React Vite) & `http://localhost:3000` (Node/Express)

---

## 🚀 Running the Java Backend

### Prerequisites
- JDK 17 or higher (`java -version`)
- Apache Maven (`mvn -version`)

### Commands
```bash
# 1. Navigate to the backend directory
cd backend-java

# 2. Build and run
mvn clean spring-boot:run
```
The server will start at: `http://localhost:8080`

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/doctors` | Get roster of all active specialist doctors |
| `GET` | `/api/doctors/{id}` | Get specific doctor profile by ID |
| `POST` | `/api/doctors` | Add a new doctor (Admin role) |
| `GET` | `/api/patients` | List all registered patients |
| `GET` | `/api/patients/{id}` | Get patient medical EMR file |
| `POST` | `/api/patients` | Register a new patient |
| `GET` | `/api/appointments` | Get appointments queue |
| `POST` | `/api/appointments` | Book new doctor appointment & auto-invoice |
| `PUT` | `/api/appointments/{id}/status` | Update status (`confirmed`, `completed`, `cancelled`) |
| `PUT` | `/api/appointments/{id}/prescription` | Save prescription and medicine regimen |
| `GET` | `/api/invoices` | List all hospital billing invoices |
| `POST` | `/api/invoices` | Generate new POS billing invoice |
| `PUT` | `/api/invoices/{id}/payment` | Record payment (`paid`, `partial`, `bKash`, `card`, `cash`) |
| `GET` | `/api/hospital/beds` | Real-time bed status (ICU, CCU, Ward, Cabin) |
| `PUT` | `/api/hospital/beds/{id}` | Update bed occupancy count (+1 / -1) |
| `GET` | `/api/hospital/settings` | Get hospital white-label settings |
| `PUT` | `/api/hospital/settings` | Update hospital branding & contact information |
| `GET` | `/api/hospital/stats` | Hospital overview KPIs (revenue, beds, patients) |
| `POST` | `/api/ai/chat` | AI Medical Triage Assistant (Bengali & English) |

---

## 🔗 How Frontend (HTML/CSS/JS/React) Connects to Java

In the React frontend (`src/App.tsx` or `vite.config.ts`), you can proxy `/api` requests directly to `http://localhost:8080`:

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});
```
Or use the provided Express/TypeScript server `server.ts` which proxies or handles client calls seamlessly.
