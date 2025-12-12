# 🏋️‍♂️ ARAISE - AI-Powered Fitness & Wellness Platform

<div align="center">

**A comprehensive health ecosystem combining AI-powered form analysis, nutrition tracking, mental wellness, and gamified progress.**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)

[🚀 Live Demo](https://arasie.vercel.app/) | [🐛 Report Bug](https://github.com/Ruthwik000/Arasie/issues) | [💡 Request Feature](https://github.com/Ruthwik000/Arasie/issues)

</div>

---

## 👥 Team

**Lead Developer:** [Ruthwik000](https://github.com/Ruthwik000)  
**Contributors:** [Vishwak](https://github.com/PATTASWAMY-VISHWAK-YASASHREE) | [vara-prasad-07](https://github.com/vara-prasad-07)

---

## ✨ Features

### 💪 Workout System
- Multi-level training plans (Beginner, Intermediate, Advanced)
- AI-powered form analysis using MediaPipe pose detection
- Video demonstrations for exercises
- Custom workout builder
- Progress tracking and session history
- Support for gym workouts, calisthenics, stretching, and yoga

### 🍽️ Nutrition & Hydration
- Calorie and macro tracking (carbs, protein, fats)
- Meal logging with categorization
- Water intake tracking with customizable goals (default 3L)
- Visual progress indicators and goal completion notifications

### 🧘 Mental Health
- Guided breathing exercises (Box Breathing, 4-7-8, etc.)
- Mini meditation sessions with audio guidance
- Sound healing with nature sounds and binaural beats
- AI-powered chat support (Nivi)
- Voice interaction mode
- Journaling with mood tracking

### 🎯 Focus & Productivity
- Pomodoro-style focus sessions
- Task management with time blocking
- Calendar view for scheduled tasks
- XP and gamification system
- Progress tracking toward daily focus goals

### 🎮 Gamification
- Streak tracking for daily goal completion
- Level progression system
- XP rewards for completing activities
- Achievement badges and visual celebrations
- 35-day calendar heatmap

---

## 🛠️ Tech Stack

**Frontend:** React 19.1.1, Vite 7.1.2, Tailwind CSS 3.4.17, Framer Motion 12.23.12  
**Backend:** Firebase 12.2.1 (Auth, Firestore, Analytics, Hosting)  
**State Management:** Zustand 5.0.8, React Context API  
**AI/ML:** MediaPipe Tasks Vision 0.10.22, Google Generative AI 0.24.1  
**UI Components:** Radix UI, Lucide React 0.542.0  
**Charts:** Recharts 3.1.2  
**Dev Tools:** ESLint 9.33.0, PostCSS, Autoprefixer

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ruthwik000/Arasie.git
   cd Arasie/araise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the `araise` directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build        # Build optimized production files
npm run preview      # Preview production build locally
```

---

## 📁 Project Structure

```
araise/
├── public/              # Static assets (videos, images, sounds, animations)
├── src/
│   ├── components/      # React components (organized by feature)
│   ├── pages/          # Route components (Dashboard, Workout, Diet, etc.)
│   ├── store/          # Zustand state management
│   ├── services/       # Firebase and external services
│   ├── contexts/       # React Context providers
│   ├── utils/          # Helper functions and utilities
│   ├── data/           # Static workout data and exercise definitions
│   ├── config/         # Firebase configuration
│   └── styles/         # Global styles and utilities
├── .env                # Environment variables (not committed)
└── vite.config.js      # Vite build configuration
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Create Firestore database

### 2. Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Get Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the configuration values to your `.env` file

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

### Deploy to Firebase Hosting

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

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

---

## 🐛 Known Issues & Fixes

### Issue: Header/Footer Not Showing (Cache Issue)
**Solution:** The app includes automatic cache management. If you experience issues:
1. Go to Settings → Data & Storage → Clear Cache
2. Or open browser console and run: `window.clearAppCache()`
3. Or hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### Issue: Camera Not Working for Pose Detection
**Solution:** 
1. Ensure browser has camera permissions
2. Use HTTPS (required for camera access)
3. Check if camera is being used by another application

### Issue: Voice Chat Not Working
**Solution:**
1. Ensure microphone permissions are granted
2. Check internet connection (speech recognition requires network)
3. Use a supported browser (Chrome, Edge recommended)

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
```

### Code Style

- Use functional components with hooks
- Follow mobile-first responsive design
- Use Tailwind CSS utility classes
- Implement proper error handling with try-catch
- Add loading states for async operations

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement feature with proper error handling
3. Test on mobile and desktop
4. Update documentation if needed
5. Submit pull request

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- ESLint configuration must pass
- Use functional components with hooks
- Mobile-first responsive design required
- WCAG 2.1 accessibility compliance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MediaPipe Team** - For exceptional pose detection technology
- **Firebase Team** - For robust backend infrastructure
- **React Team** - For the incredible frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Open Source Community** - For continuous inspiration and support

---

## 📞 Support

- **Documentation:** Check this README and inline code comments
- **Bug Reports:** [GitHub Issues](https://github.com/Ruthwik000/Arasie/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Ruthwik000/Arasie/discussions)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Built with ❤️ by the ARAISE team**

</div>
