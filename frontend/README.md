# Disease Detection System - Frontend

A modern React application for **Lightweight Edge AI Models for Disease Detection Using Images and Clinical Reports**. This application supports detection of Conjunctivitis, Leishmaniasis, Dengue, and Acute Respiratory Infections.

## Features

- 🎨 **Modern UI Design** - Beautiful, responsive login page with gradient backgrounds
- 🌐 **Multi-language Support** - English, Sindhi (سنڌي), and Urdu (اردو)
- 🔐 **Authentication** - Secure login page with email and password
- 🗺️ **Routing** - React Router for navigation
- 🎨 **Styling** - Tailwind CSS for modern, responsive design
- 📱 **Responsive** - Works on all devices

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library

## Project Structure

```
src/
├── contexts/
│   └── LanguageContext.jsx    # Language management context
├── pages/
│   ├── Login.jsx              # Login page
│   ├── LanguageSelection.jsx  # Language selection page
│   └── Dashboard.jsx          # Main dashboard
├── App.jsx                    # Main app component with routing
├── main.jsx                   # Entry point
└── index.css                  # Global styles with Tailwind
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## User Flow

1. **Login Page** (`/`) - Users enter their email and password
   - Language selector available in the top-right corner
   - Supports three languages: English, Sindhi, Urdu

2. **Language Selection** (`/language-selection`) - After login, users choose their preferred language
   - Three beautiful language cards
   - Selection automatically navigates to dashboard

3. **Dashboard** (`/dashboard`) - Main application interface
   - Features grid with Image Analysis, Clinical Reports, Real-time Detection, and Settings
   - Supported diseases display
   - System information
   - Logout functionality

## Supported Languages

- **English** - Full support
- **Sindhi (سنڌي)** - Right-to-left text support
- **Urdu (اردو)** - Right-to-left text support

## Notes

- Language preference is saved in localStorage
- All pages are fully responsive
- The application uses a modern gradient design with smooth transitions
