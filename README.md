# Traccar Fleet Management System

A modern GPS vehicle tracking and fleet management web application built with Next.js, integrating with Traccar server API.

## 🚀 Features

- **Real-Time Tracking**: Monitor your fleet in real-time with live GPS data
- **Modern Dashboard**: Beautiful, responsive dashboard built with Tailwind CSS
- **Traccar Integration**: Seamless integration with your existing Traccar server
- **Vehicle Management**: View and manage all your vehicles in one place
- **Reports & Analytics**: Generate detailed reports on routes, trips, and fleet performance
- **Geofencing**: Create and manage geofences for your vehicles
- **Secure Authentication**: Built-in authentication system with NextAuth

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

## 🎯 Next Steps

### Phase 1: Current (Basic Integration) ✅
- [x] Project setup
- [x] Traccar API integration
- [x] Basic dashboard
- [x] Device listing
- [x] Real-time position display

### Phase 2: Enhanced Features (Coming Soon)
- [ ] Authentication system with NextAuth
- [ ] Map integration (Leaflet/Mapbox)
- [ ] Visual route tracking
- [ ] Advanced filtering and search
- [ ] Custom reporting dashboard
- [ ] Geofence management UI

### Phase 3: Advanced Features
- [ ] Multi-user support with role-based access
- [ ] Customer portal
- [ ] Driver management
- [ ] Maintenance scheduling
- [ ] Fuel tracking
- [ ] Billing integration
- [ ] Mobile app (React Native)

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
