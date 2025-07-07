# Document Translator AI

![Project Banner](public/apple-touch-icon.png)

An AI-powered document translation tool that converts text from images or PDFs into multiple languages with high accuracy using OCR and advanced machine translation.

## 🌟 Key Features

- **Multi-Format Document Support**:
  - Upload images (JPG, PNG) or PDFs
  - Capture documents using your device camera
  - Supports both printed and handwritten text (beta)

- **Advanced Translation**:
  - Powered by Gemini AI and Pollinations API
  - Supports 50+ languages including English, Spanish, French, Chinese, etc.
  - Preserves original formatting where possible

- **Smart OCR Technology**:
  - Tesseract.js-based text extraction
  - Automatic language detection
  - Text correction and enhancement

- **User-Friendly Interface**:
  - Real-time preview of extracted text
  - Dark/light mode support
  - Responsive design works on all devices

## 🛠️ Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS + DaisyUI (Lemonade/Synthwave themes)
- **Icons**: React Icons
- **Camera**: react-webcam
- **Forms**: React Hook Form

### AI/Processing
- **OCR**: Tesseract.js
- **Translation**: 
  - Gemini AI API (primary)
  - Pollinations API (fallback)
- **Text Processing**: Web Workers for background tasks

### Development Tools
- **State Management**: React Context API
- **Animation**: Framer Motion
- **Build**: Vite
- **Linting**: ESLint + Prettier

## 📚 Project Overview

Document Translator AI solves the problem of quickly converting physical documents or images into translated digital text. Unlike traditional translation apps, it:

1. **Combines OCR and AI translation** in one seamless workflow
2. **Works entirely client-side** for most operations (no backend required)
3. **Preserves privacy** by processing documents in your browser
4. **Supports complex layouts** with multi-column text recognition

Perfect for:
- Travelers needing instant translations
- Students researching foreign materials
- Businesses processing international documents
- Immigrants handling official paperwork

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Google Cloud API key (for Gemini AI - optional)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/001kenji/document-ai-translator.git
   ```
   cd document-translator-ai

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
    ```bash
    cp .env.example .env
    ```
  Edit .env with your API keys

4. Start the development server:
    ```bash
    npm run dev
    ```

### 📂 Project Structure
```
      src/
      ├── assets/            # Static assets
      ├── components/        # Reusable components
      │   ├── camera/        # Camera UI
      │   ├── ocr/           # OCR processing
      │   ├── translation/   # Translation UI
      │   └── ui/            # Common UI elements
      ├── contexts/          # State management
      ├── hooks/             # Custom hooks
      ├── pages/             # Application views
      ├── services/          # API/services
      ├── styles/            # Global styles
      ├── utils/             # Helper functions
      ├── App.jsx            # Root component
      └── main.jsx           # Entry point
```
### 📝 Usage Guide

1. **Capture Document**
   - Click the camera icon to take a photo.
   - Or upload an image or PDF file.

2. **Review Extracted Text**
   - Edit any OCR errors in the text box.
   - Highlight sections for specific translation.

3. **Select Target Language**
   - Choose from 50+ supported languages.
   - Use the search feature for quick finding.

4. **Get Translation**
   - Click the "Translate" button.
   - Copy or download the results.
