# PitchBridge
**Bridging the Gap Between Rwandan Entrepreneurs and Investors.**

PitchBridge is a specialized fintech platform designed to empower local entrepreneurs by providing a high-visibility stage for their projects, while offering investors a streamlined, data-driven "Discovery Feed" to find their next high-impact investment in Rwanda.

---

## 🔗 Repository
**GitHub URL:** [https://github.com/NadiaTeta/PitchBridge.git]

---

## 📝 Description
PitchBridge solves the visibility gap in the Rwandan startup ecosystem. Entrepreneurs often lack access to professional investors, while investors struggle to find vetted, high-potential projects outside of their immediate networks. 

**Key Features:**
- **Dual-Persona Dashboards:** Specialized interfaces for Entrepreneurs (pitch creation) and Investors (discovery & portfolio).
- **Video Pitches:** Integrated 30-60 second video support to humanize the pitching process.
- **Smart Filtering:** Find projects by Rwandan Districts (Kigali, Rubavu, Musanze, etc.) and industry categories.
- **Real-time Interaction:** Direct chat interface for investor-founder communication.
- **Responsive Navigation:** A mobile-optimized experience with a unified top-bar and hamburger menu.

---

## ⚙️ Environment & Project Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: (Standard with Node)

### 2. Installation
Clone the repository and install the necessary dependencies:
```bash
# Clone the repo
git clone [https://github.com/NadiaTeta/PitchBridge.git]

# Enter the directory
cd PitchBridge

# Install dependencies
npm install
```
### 3. Environment configuration(optional)
Although the app currently runs with hardcoded mock data for the demo, the architecture is ready for backend integration. To set up the environment variables:

1. Create a .env file in the root directory.

2. Add the following line:
```sh
VITE_USE_MOCK_DATA=true
```

### 4. Running the App
Start the development server:
```sh
npm run dev
```
Open http://localhost:5173 in your browser.

## 🏗️ Technical Stack
Frontend: React + TypeScript

Styling: Tailwind CSS

State: React Context API (Auth & Data)

Routing: React Router DOM (Protected Layouts)

### Designs
1. App interfaces

![Onboarding Screen](./screenshots/onboarding.png)

![Discovery Feed](./screenshots/discoveryfeed.png)

![Add a Project](./screenshots/addproject1.png)
![Add a Project](./screenshots/addproject2.png)

![Project Details](./screenshots/projectdetail.png)

2. Database Schema
![Database Schema](./screenshots/PitchBridge%20Database%20Schema.png)

### 🚀 Deployment Plan

Phase 1: Frontend Hosting

The frontend is designed to be hosted on Vercel or Netlify.

Automatic deployments are triggered via the main branch.

Build Command: npm run build

Output Directory: dist

Phase 2: Media & Video Management

Video pitches are managed via Cloudinary. This ensures that high-resolution videos are optimized and served via CDN to users with varying internet speeds across Rwanda.

Phase 3: Backend & Database

The backend (Node.js/Express) will be deployed on Render or Heroku, connected to a PostgreSQL database for secure management of investment data and user profiles.

Phase 4: Domain & Security

Final deployment will involve a custom domain with SSL encryption (HTTPS) to ensure that all financial discussions and personal NID/RDB verification documents are handled securely.

### Video demo link
Video demo: [https://youtu.be/mD-5MNWpe-g]