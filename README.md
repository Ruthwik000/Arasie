# 🏋️‍♂️ ARAISE - AI-Powered Fitness Tracking Platform

<div align="center">

![ARAISE Logo](./public/vite.svg)

**A comprehensive fitness ecosystem combining AI-powered form analysis, nutrition tracking, hydration monitoring, and gamified progress visualization.**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[🚀 Live Demo](https://arasie.vercel.app/) | [📖 Documentation](./USER_FLOW_CHART.md) | [🐛 Report Bug](#) | [💡 Request Feature](#)

</div>

---

## 🎯 **Overview**

**ARAISE** is a next-generation fitness tracking application that revolutionizes how users approach their health and wellness journey. Built with cutting-edge technologies including **React 19**, **Firebase**, and **MediaPipe AI**, it offers real-time form correction, comprehensive progress tracking, and an intuitive user experience optimized for all devices.

### ✨ **Key Highlights**

- 🤖 **AI-Powered Form Analysis** - Real-time exercise form correction using MediaPipe
- 🎥 **Video Exercise Demonstrations** - HD workout videos with seamless integration
- 📊 **Professional Dashboard UI** - Modern glassmorphism design with enhanced animations and micro-interactions
- � **Premfium Visual Design** - Gradient progress bars, sophisticated card layouts, and polished typography
- 🎮 **Advanced Gamification** - Levels, streaks, achievement badges with glow effects and celebrations
- � **Mobilei-First Excellence** - Touch-optimized responsive design with premium interactions
- 🔥 **Real-Time Sync** - Firebase-powered instant data synchronization with smooth transitions
- ⚡ **Enhanced Performance** - Optimized animations and state management for fluid user experience

---



### 🏠 **Enhanced Dashboard Overview**

<!-- Add dashboard screenshot here -->

![Dashboard Screenshot](./araise/screenshots/dashboard.png)
_Professional modern dashboard with enhanced glassmorphism cards, gradient progress bars, and sophisticated animations_

### 💪 **AI-Powered Workout Analysis**

<!-- Add workout analysis screenshot here -->

![Workout Analysis Screenshot](./araise/screenshots/workout-analysis.png)
_Live form correction using MediaPipe pose detection with real-time feedback_

### 💧 **Water & 🍽️ Diet Tracking**

<!-- Add tracking features screenshot here -->

![Tracking Features Screenshot](./araise/screenshots/tracking-features.png)
_Intuitive progress visualization with animated charts and goal management_

### 📱 **Mobile-Responsive Design**

<!-- Add mobile screenshots here -->

![Mobile Screenshots](./araise/screenshots/mobile-responsive.png)
_Seamless experience across all device sizes with touch-optimized interactions_

</div>

---

## �🚀 **Core Features**

### 💪 **Smart Workout System**

- **Multi-Level Training Plans** - Beginner, Intermediate, and Advanced routines
- **AI Form Analyzer** - Real-time pose detection and correction feedback
- **Video Demonstrations** - High-quality exercise videos (biceps.mp4 and more)
- **Progress Tracking** - Session completion and performance metrics
- **Dynamic Exercise Display** - Animated elements and responsive layouts

### 💧 **Hydration Tracking**

- **Circular Progress Visualization** - Beautiful water intake progress rings
- **Quick Add Buttons** - 250ml, 500ml, 750ml, 1000ml preset options
- **Custom Amount Entry** - Flexible manual logging
- **Smart Goal Management** - 3L daily target with achievement notifications
- **Time-Stamped Logs** - Complete hydration history tracking

### 🍽️ **Nutrition Management**

- **Macro Visualization** - Interactive pie charts for carbs, protein, and fats
- **Calorie Tracking** - Real-time progress bars and goal monitoring
- **Meal Logging** - Breakfast, lunch, dinner, and snack categorization
- **Achievement Notifications** - Goal completion celebrations
- **Nutritional Insights** - Comprehensive macro and calorie breakdowns

### 📈 **Progress Dashboard**

- **Radar Chart Analytics** - Multi-dimensional progress visualization
- **Streak Calendar** - 35-day heatmap showing consistency
- **Real-Time Updates** - Live progress synchronization across all features
- **Gamification Elements** - Level progression and achievement badges
- **Responsive Design** - Optimized spacing and layouts for mobile and desktop

---

## 🛠️ **Tech Stack**

### **Frontend Framework**

- ⚛️ **React 19.1.1** - Latest React with enhanced performance
- 🎨 **Tailwind CSS 3.4.17** - Utility-first styling with custom components
- 🌟 **Framer Motion 12.23.12** - Smooth animations and transitions
- 🧭 **React Router DOM 7.8.2** - Client-side routing and navigation

### **Backend & Database**

- 🔥 **Firebase 12.2.1** - Authentication, Firestore, and real-time sync
- 📊 **Firebase Analytics** - User behavior and performance tracking
- ☁️ **Firebase Hosting** - Fast, secure web hosting

### **State Management & UI**

- 🗃️ **Zustand 5.0.8** - Lightweight state management
- 🎯 **Radix UI Components** - Accessible, customizable UI primitives
- 📊 **Recharts 3.1.2** - Responsive chart library for data visualization
- 🎨 **Lucide React 0.542.0** - Beautiful, consistent icons

### **AI & Analysis**

- 🤖 **MediaPipe** - Advanced pose detection and form analysis
- 📸 **WebRTC** - Real-time camera integration for form checking
- 🧠 **Computer Vision** - Real-time feedback and rep counting

### **Development Tools**

- ⚡ **Vite 7.1.2** - Lightning-fast build tool and dev server
- 🔍 **ESLint 9.33.0** - Code quality and consistency
- 📦 **PostCSS & Autoprefixer** - CSS processing and optimization

---

## 📁 **Project Structure**

```
araise/
├── 📂 public/
│   ├── 🎬 videos/
│   │   └── biceps.mp4          # Exercise demonstration videos
│   ├── 📄 manifest.json        # PWA manifest
│   ├── ⚙️ sw.js               # Service worker
│   └── 🖼️ vite.svg            # App icons
├── 📂 src/
│   ├── 📂 assets/
│   │   └── react.svg
│   ├── 📂 components/
│   │   ├── Navigation.jsx      # Responsive navigation bar
│   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   ├── UI.jsx             # Reusable UI components
│   │   └── 📂 ui/
│   │       ├── button.jsx      # Custom button component
│   │       ├── card.jsx        # Card layout component
│   │       ├── input.jsx       # Form input component
│   │       ├── ModernLogin.jsx # Styled login form
│   │       └── ModernSignup.jsx# Styled signup form
│   ├── 📂 pages/
│   │   ├── Dashboard.jsx       # Main hub with analytics
│   │   ├── Diet.jsx           # Nutrition tracking page
│   │   ├── Login.jsx          # Authentication page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── Water.jsx          # Hydration tracking page
│   │   ├── Welcome.jsx        # Landing page
│   │   └── Workout.jsx        # Comprehensive workout system
│   ├── 📂 store/
│   │   └── userStore.js       # Zustand state management
│   ├── 📂 utils/
│   │   ├── cn.js              # Class name utilities
│   │   └── helpers.js         # Common helper functions
│   ├── App.jsx                # Root application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── 📄 eslint.config.js         # ESLint configuration
├── 📄 package.json            # Dependencies and scripts
├── 📄 postcss.config.js       # PostCSS configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 vite.config.js          # Vite build configuration
├── 📋 USER_FLOW_CHART.md      # Comprehensive user flow documentation
└── 📖 README.md               # Project documentation
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Firebase project with Authentication and Firestore enabled
- Modern web browser with WebRTC support

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ruthwik000/Arasie.git
   cd Arasie/araise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

4. **Configure Firebase** - Add your Firebase config to `.env`:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.2
- **Styling**: Tailwind CSS 3.4.17, Framer Motion 12.23.12
- **Authentication**: Firebase Auth 12.2.1
- **Database**: Firebase Firestore, Real-time sync
- **State Management**: Zustand 5.0.8
- **Routing**: React Router DOM 7.8.2
- **AI Integration**: MediaPipe for pose detection
- **Charts**: Recharts 3.1.2 for data visualization

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Firebase project with Authentication and Firestore enabled
- Modern web browser with WebRTC support

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ruthwik000/Arasie.git
   cd Arasie/araise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

4. **Configure Firebase** - Add your Firebase config to `.env`:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Build for Production**

```bash
npm run build        # Build optimized production files
npm run preview      # Preview production build locally
```

---

## 🎮 **Usage Guide**

### **🔐 Authentication Flow**

1. **Welcome Screen** - Feature overview and call-to-action
2. **Sign Up/Login** - Firebase email/password authentication
3. **Protected Routes** - Automatic redirection for unauthorized users

### **📊 Dashboard Navigation**

- **Progress Overview** - Radar chart showing workout, water, and diet progress
- **Streak Calendar** - Visual representation of daily consistency
- **Quick Actions** - Direct access to workout, water, and diet features

### **💪 Workout Experience**

1. **Select Difficulty** - Beginner, Intermediate, or Advanced
2. **Choose Plan** - Multiple workout routines per difficulty level
3. **Exercise Session** - Video demonstrations and animated guides
4. **AI Form Analysis** - Real-time pose detection and feedback
5. **Progress Tracking** - Automatic completion and statistics

### **💧 Water & 🍽️ Diet Tracking**

- **Quick Logging** - Preset buttons for common amounts
- **Custom Entry** - Manual input with flexible amounts
- **Progress Visualization** - Real-time charts and goal tracking
- **Achievement Notifications** - Celebration of daily goals

---

## 🏗️ **Architecture & Design Patterns**

### **Component Architecture**

```
App (Root)
├── AuthProvider (Firebase Context)
├── Navigation (Conditional Sidebar)
├── ProtectedRoute (Auth Guard)
└── Page Components
    ├── Dashboard (Analytics Hub)
    ├── Workout (Complex Nested Routes)
    ├── Water (Progress Tracking)
    ├── Diet (Nutrition Management)
    └── Auth Pages (Login/Signup)
```

### **State Management Pattern**

- **Zustand Store** - Centralized state with persistence
- **Firebase Integration** - Real-time data synchronization
- **Local Storage Fallback** - Offline capability and performance
- **Reactive Updates** - Automatic UI updates on state changes

### **Responsive Design Strategy**

```css
/* Mobile-First Approach */
Default (Mobile): Compact layouts, touch-optimized
md: 768px+       : Enhanced spacing, grid layouts
lg: 1024px+      : Full desktop experience, max width
```

---

## 🔧 **Configuration**

### **Environment Variables**

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=            # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN=        # Authentication domain
VITE_FIREBASE_PROJECT_ID=         # Project identifier
VITE_FIREBASE_STORAGE_BUCKET=     # Storage bucket URL
VITE_FIREBASE_MESSAGING_SENDER_ID=# Messaging sender ID
VITE_FIREBASE_APP_ID=             # App identifier
VITE_FIREBASE_MEASUREMENT_ID=     # Analytics measurement ID
```

### **Firebase Rules**

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 **Deployment**

### **Firebase Hosting**

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**

   ```bash
   firebase login
   firebase init hosting
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### **Alternative Deployment Options**

- **Vercel** - Zero-config deployment with GitHub integration
- **Netlify** - Continuous deployment with form handling
- **GitHub Pages** - Free static hosting for public repositories

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### **Development Setup**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Standards**

- **ESLint Configuration** - Follow existing linting rules
- **Component Structure** - Use functional components with hooks
- **Responsive Design** - Mobile-first approach required
- **Accessibility** - WCAG 2.1 compliance for all interactive elements

---

## 📋 **Roadmap**

### **🔮 Upcoming Features**

- [ ] **Advanced AI Analysis** - Enhanced form correction algorithms
- [ ] **Social Features** - Friend challenges and community boards
- [ ] **Wearable Integration** - Heart rate and activity sync
- [ ] **Meal Planning** - AI-powered nutrition recommendations
- [ ] **Offline Mode** - Complete functionality without internet
- [ ] **Progressive Web App** - Native app-like experience
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Voice Commands** - Hands-free workout guidance

---

## 🐛 **Troubleshooting**

### **Common Issues**

**🔥 Firebase Connection Issues**

```bash
# Check environment variables
echo $VITE_FIREBASE_API_KEY

# Verify Firebase project settings
firebase projects:list
```

**📱 Video Playback Issues**

- Ensure browser supports HTML5 video
- Check video file format compatibility
- Verify HTTPS connection for autoplay

**🔧 Build Errors**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👥 **Team**

**Lead Developer:** [Ruthwik000](https://github.com/Ruthwik000)

- Full-stack development
- AI integration and optimization
- UI/UX design and implementation

**Contributors:**

**[PATTASWAMY-VISHWAK-YASASHREE](https://github.com/PATTASWAMY-VISHWAK-YASASHREE)**

- Frontend development
- UI/UX enhancements
- Feature implementation

**[vara-prasad-07](https://github.com/vara-prasad-07)**

- Backend development
- Firebase integration
- Performance optimization

---

## 🙏 **Acknowledgments**

- **MediaPipe Team** - For exceptional pose detection technology
- **Firebase Team** - For robust backend infrastructure
- **React Team** - For the incredible frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Open Source Community** - For continuous inspiration and support

---

## 📞 **Support**

Need help or have questions? We're here to assist:

- **📚 Documentation** - [User Flow Chart](./USER_FLOW_CHART.md)
- **🐛 Bug Reports** - [GitHub Issues](https://github.com/Ruthwik000/Arasie/issues)
- **💬 Discussions** - [GitHub Discussions](https://github.com/Ruthwik000/Arasie/discussions)
- **📧 Email Support** - [Contact Us](mailto:support@araise.app)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**🔗 Share with your fitness community**

**🤝 Contribute to make fitness tracking better for everyone**

---

_Built with ❤️ by the ARAISE team_

_Empowering fitness journeys through technology_

</div>
