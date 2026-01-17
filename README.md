# Traccar Fleet Management System

A modern GPS vehicle tracking and fleet management web application bui### 🎯 **Next Steps:**

### Phase 1: Current (Basic Integration) ✅
- [x] Project setup
- [x] Traccar API integration
- [x] Basic dashboard
- [x] Device listing
- [x] Real-time position display
- [x] **Navigation menu with multiple pages**
- [x] **Interactive map view with vehicle markers**
- [x] **Real-time vehicle tracking on map**
- [x] **Vehicle status indicators (online/offline)**

### Phase 2: Enhanced Features ✅
- [x] Map integration with Leaflet
- [x] Visual route tracking with history playback
- [x] **Multiple map layer options (Google Maps, OpenStreetMap, Carto)**
- [x] **Real-time map layer switching**
- [x] **Vehicle search functionality**
- [x] **Compact hovering vehicle list with glassmorphism**
- [x] Authentication system with Prisma + SQLite
- [x] Role-based access control (Admin/Client)
- [x] User management dashboard

## 🚀 Features

- **Real-Time Tracking**: Monitor your fleet in real-time with live GPS data
- **Interactive Map View**: Advanced map interface with vehicle markers, status indicators, and live updates
- **Multiple Map Layers**: Choose from 7 different map styles:
  - 🛰️ **Google Hybrid** (Satellite + Labels) - Default
  - 🌍 **Google Satellite** (Pure satellite imagery)
  - 🗺️ **Google Streets** (Standard road map)
  - ⛰️ **Google Terrain** (Topographic map)
  - 🌐 **OpenStreetMap** (Community-driven)
  - ☀️ **Carto Light** (Minimalist light theme)
  - 🌙 **Carto Dark** (Dark mode for night use)
- **Vehicle Search**: Quick search functionality to find specific vehicles by name or ID
- **Modern Dashboard**: Beautiful, responsive dashboard built with Tailwind CSS
- **Traccar Integration**: Seamless integration with your existing Traccar server
- **Vehicle Management**: View and manage all your vehicles in one place
- **Route History Playback**: View historical routes with customizable date ranges (24h, yesterday, 7 days, custom)
- **Reports & Analytics**: Generate detailed reports on routes, trips, and fleet performance
- **Geofencing**: Create and manage geofences for your vehicles
- **Secure Authentication**: Role-based access control with admin and client user roles
- **Compact Vehicle List**: Hovering panel with glassmorphism effect showing all vehicles at a glance

## 📋 Prerequisites

- Node.js 18+ installed
- A running Traccar server (local or remote)
- Traccar admin credentials

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update with your Traccar server details:

```env
TRACCAR_API_URL=http://your-traccar-server:8082/api
TRACCAR_API_USERNAME=your-username
TRACCAR_API_PASSWORD=your-password

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Access the Dashboard

Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view your fleet.

## 🎮 Usage Guide

### Map Interface Features:

1. **Changing Map Layers**
   - Click the "Map Layer" button (top-right corner)
   - Select from 7 different map styles
   - Current layer: Google Hybrid (default)

2. **Searching for Vehicles**
   - Use the search bar in the vehicle list panel
   - Search by vehicle name or unique ID
   - Results update in real-time as you type

3. **Viewing Vehicle Details**
   - Click any vehicle in the list to zoom to its location
   - Click the vehicle marker on the map for detailed info
   - See speed, location, last update time, and status

4. **History Playback**
   - Click "View History" button in vehicle popup
   - Choose from quick options:
     - Last 24 Hours
     - Yesterday
     - Last 7 Days
     - Custom Date Range (up to 30 days)
   - Watch animated route playback with adjustable speed

5. **Authentication**
   - Default admin credentials: `admin@followtrack.com` / `Admin@123`
   - Create client users via Admin Panel
   - Clients see only assigned vehicles
   - Admins see all vehicles

## 📁 Project Structure

```
traccar_upgrade/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── devices/       # Devices endpoint
│   │   │   └── positions/     # Positions endpoint
│   │   ├── dashboard/         # Dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── services/              # API services
│   │   └── traccarService.ts  # Traccar API integration
│   ├── types/                 # TypeScript types
│   │   └── traccar.ts         # Traccar type definitions
│   └── components/            # React components (add as needed)
├── public/                    # Static files
├── .env.example               # Environment variables template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind CSS config
└── README.md                  # This file
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **GPS Tracking**: Traccar API

## 📡 Traccar API Integration

The application integrates with the following Traccar API endpoints:

- `/api/session` - Authentication
- `/api/devices` - Get vehicle devices
- `/api/positions` - Get vehicle positions
- `/api/reports/trips` - Get trip reports
- `/api/reports/summary` - Get summary reports
- `/api/geofences` - Manage geofences

## 🗺️ Map Layers

The application supports multiple map layer providers with instant switching:

### Available Map Layers:

1. **Google Hybrid** (Default)
   - Satellite imagery with street labels
   - Best for: Vehicle tracking with real-world context
   - Max Zoom: 20

2. **Google Satellite**
   - Pure satellite imagery without labels
   - Best for: Clear aerial view
   - Max Zoom: 20

3. **Google Streets**
   - Standard road map view
   - Best for: Navigation and street-level detail
   - Max Zoom: 20

4. **Google Terrain**
   - Topographic map with elevation
   - Best for: Off-road tracking and terrain analysis
   - Max Zoom: 20

5. **OpenStreetMap**
   - Community-driven open-source map
   - Best for: Detailed local information
   - Max Zoom: 19

6. **Carto Light**
   - Minimalist light theme
   - Best for: Clean, distraction-free viewing
   - Max Zoom: 19

7. **Carto Dark**
   - Dark theme for low-light environments
   - Best for: Night-time monitoring and reduced eye strain
   - Max Zoom: 19

### How to Change Map Layers:

1. Click the **Map Layer** button in the top-right corner of the map
2. Select your preferred map style from the dropdown
3. The map updates instantly while maintaining your current view and zoom level

### Technical Implementation:

- Uses Leaflet.js tile layers
- Real-time layer switching without page reload
- Maintains markers and vehicle positions during transitions
- Responsive design works on all screen sizes

## 🎯 Next Steps

### Phase 1: Current (Basic Integration) ✅
- [x] Project setup
- [x] Traccar API integration
- [x] Basic dashboard
- [x] Device listing
- [x] Real-time position display

### Phase 2: Enhanced Features (Coming Soon)
- [x] Authentication system with Prisma + SQLite
- [x] Map integration (Leaflet)
- [x] Visual route tracking
- [x] Advanced filtering and search
- [x] Multiple map layer options
- [ ] Custom reporting dashboard
- [ ] Geofence management UI
- [ ] Advanced analytics and charts

### Phase 3: Advanced Features (Roadmap)
- [ ] Driver management and assignments
- [ ] Maintenance scheduling and alerts
- [ ] Fuel consumption tracking
- [ ] Cost and billing integration
- [ ] Email/SMS notifications for alerts
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Export reports to PDF/Excel

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use strong secrets for `NEXTAUTH_SECRET`
- Consider using environment-specific configurations
- Implement proper authentication before deploying to production
- Use HTTPS for production deployments

## 🐛 Troubleshooting

### Cannot connect to Traccar server

1. Verify your Traccar server is running
2. Check the `TRACCAR_API_URL` in `.env`
3. Ensure your credentials are correct
4. Check if CORS is enabled on Traccar server

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

## 📝 License

This project is for personal/commercial use with your Traccar server.

## 🤝 Contributing

This is a custom project. Feel free to customize it for your needs!

## 📞 Support

For Traccar-specific issues, visit [Traccar Documentation](https://www.traccar.org/documentation/)

---

Built with ❤️ using Next.js and Traccar
