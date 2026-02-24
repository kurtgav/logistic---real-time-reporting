# RVL Movers - Fleet Command Center

A high-performance, real-time fleet operations and logistics management system designed for **RVL Movers Corporation**. This dashboard provides comprehensive tracking, analytics, and driver management to optimize long-haul and last-mile delivery operations in the Philippines.

## 🚀 Key Features

- **Real-time Fleet Tracking**: Monitor vehicle positions (simulated GPS), status, and progress on an interactive map.
- **Operations Dashboard**: High-level overview of active deployments, on-time delivery rates, and daily fuel efficiency metrics.
- **Dispatch & Job Management**: Create new transport jobs, assign drivers, and manage warehouse loading/unloading sequences.
- **AI-Powered Diagnostics**: Integrated Gemini AI insights for maintenance alerts and route optimization.
- **Driver Management**: Complete profiles, trip history, and performance ratings for the entire crew.
- **Financial Tracking**: Real-time monitoring of fuel costs, toll expenses (AutoSweep/EasyTrip), and labor.
- **Driver Mobile Simulation**: Dedicated interface for drivers to log fuel, report issues, and update trip status.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Intelligence**: Google Gemini AI (@google/genai)
- **Build Tool**: Vite

## 📦 Getting Started

### Prerequisites

- **Node.js**: (v18 or higher recommended)
- **Gemini API Key**: Required for AI-powered reports and diagnostics.

### Installation

1. **Clone the repository**:
   ```bash
   cd rvl-movers---real-time-reporting
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Ensure you have a `.env.local` file in the root directory with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

## 📋 Operations Guide

- **Dashboard**: Use the main dashboard to track overall performance and active vehicle stats.
- **Fleet/Vehicles**: Manage the inventory of Car Carriers, Wingvans, and Closed Vans.
- **Drivers**: Maintain the driver roster and simulate mobile app interactions.
- **Reports**: Generate detailed operational reports and performance analytics.
- **Settings**: Configure company details, fuel prices, and notification preferences.

---

*Note: This system is built for internal operational use by RVL Movers Corporation.*
