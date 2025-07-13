# AR Object Detection with Accessibility Features

![AR Object Detection Demo](public/apple-touch-icon.png)
<br/>
## 📌 Project Overview

This AR Object Detection system combines computer vision and accessibility features to create an inclusive real-time detection experience.

Built with **TensorFlow.js** and **React**, the application processes live camera feeds to identify objects (using the **COCO-SSD** model) and overlays dynamic visual cues like pulsing bounding boxes with adjustable animation speeds.

For visually impaired users, it integrates the **Web Speech API** to announce detected objects (e.g., “Chair, 2 meters ahead”) and triggers haptic feedback for critical obstacles (e.g., stairs or doors). The distance estimation feature calculates approximate object proximity by comparing pixel dimensions to real-world reference sizes, making it practical for navigation assistance.

---

## ⚙️ Technical Implementation

The system leverages **client-side processing** via TensorFlow.js for privacy-focused, low-latency detection. The frontend uses **React** with **Vite** for fast rendering, while **Tailwind CSS** ensures responsive design across devices.

### 🔑 Key Components:

- ✅ A custom `useObjectDetection` hook that manages model loading & predictions.
- ✅ Canvas-based AR overlays with smooth animations via `requestAnimationFrame`.
- ✅ **Web Workers** for off-thread distance calculations to maintain performance.
- ✅ Progressive enhancement for accessibility (falls back to audio-only when WebGL isn’t available).

---

## 🚀 Use Cases

Beyond accessibility, this toolkit serves:

- 🎓 **Education**: Object recognition for children.
- 🛒 **Retail**: Inventory scanning and smart product search.
- 🗺️ **Smart Navigation**: Indoor/outdoor assistance systems.

The modular architecture allows easy customization of detection models, visual styles, or feedback protocols through config files like `animationUtils.js`.


## Features
- **Real-time Object Detection** using TensorFlow.js
- **Pulsing Bounding Boxes** with smooth animations
- **Distance Estimation** for detected objects
- **Audio Feedback** via Web Speech API
- **Haptic Alerts** for important objects
- **Responsive Design** works on mobile and desktop

## Technology Stack
- **Frontend**: React + Vite
- **Computer Vision**: TensorFlow.js (COCO-SSD model)
- **Camera Access**: react-webcam
- **Styling**: Tailwind CSS
- **Animation**: requestAnimationFrame

## Installation
```bash
git clone https://github.com/your-repo/ar-object-detection.git
cd ar-object-detection
npm install
npm run dev
