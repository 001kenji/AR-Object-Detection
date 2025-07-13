import React, { useEffect, useRef, useState } from "react";
import '../App.css'
import { connect } from "react-redux";
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import { FiCamera, FiCameraOff, FiLoader, FiCheckCircle, FiX, FiVolume2, FiPause, FiSearch } from 'react-icons/fi';
import CameraShuttleSound from '../assets/audio/camera.mp3'
import Notifier from "../Components/notifier.jsx";

const AIPage = ({ isAuthenticated }) => {
  const Theme = useSelector((state) => state.auth.Theme);
  const [hasPermission, setHasPermission] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ObjectToDescribe, SetObjectToDescribe] = useState([])
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [targetVoice, setTargetVoice] = useState('default');
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const CameraTakenRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);
  const speechSynthRef = useRef(null);
  const detectionDebounceRef = useRef(null);
  const isCurrentlySpeakingRef = useRef(false);

  // Supported languages for speech synthesis
  const supportedLanguages = [
    { name: 'English (US)', code: 'en-US', voices: ['default', 'male', 'female'] },
    { name: 'English (UK)', code: 'en-GB', voices: ['default', 'male', 'female'] },
    { name: 'Spanish', code: 'es-ES', voices: ['default', 'male', 'female'] },
    { name: 'French', code: 'fr-FR', voices: ['default', 'male', 'female'] },
    { name: 'German', code: 'de-DE', voices: ['default', 'male', 'female'] },
    { name: 'Italian', code: 'it-IT', voices: ['default', 'male', 'female'] },
    { name: 'Portuguese', code: 'pt-PT', voices: ['default', 'male', 'female'] },
    { name: 'Russian', code: 'ru-RU', voices: ['default', 'male', 'female'] },
    { name: 'Japanese', code: 'ja-JP', voices: ['default', 'male', 'female'] },
    { name: 'Korean', code: 'ko-KR', voices: ['default', 'male', 'female'] },
    { name: 'Chinese (Mandarin)', code: 'zh-CN', voices: ['default', 'male', 'female'] },
    { name: 'Arabic', code: 'ar-SA', voices: ['default', 'male', 'female'] },
    { name: 'Hindi', code: 'hi-IN', voices: ['default', 'male', 'female'] },
    { name: 'Dutch', code: 'nl-NL', voices: ['default', 'male', 'female'] },
    { name: 'Swedish', code: 'sv-SE', voices: ['default', 'male', 'female'] },
    { name: 'Norwegian', code: 'no-NO', voices: ['default', 'male', 'female'] },
    { name: 'Finnish', code: 'fi-FI', voices: ['default', 'male', 'female'] },
    { name: 'Danish', code: 'da-DK', voices: ['default', 'male', 'female'] },
    { name: 'Polish', code: 'pl-PL', voices: ['default', 'male', 'female'] },
    { name: 'Turkish', code: 'tr-TR', voices: ['default', 'male', 'female'] },
  ];

  const filteredLanguages = supportedLanguages.filter(lang =>
    lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  useEffect(() => {
    checkCameraPermission();
    speechSynthRef.current = window.speechSynthesis;
    return () => {
      // Clean up
      if (modelRef.current) {
        modelRef.current.dispose();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (detectionDebounceRef.current) {
        clearTimeout(detectionDebounceRef.current);
      }
      speechSynthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if(isCameraActive){
      animationRef.current = requestAnimationFrame(detectObjects);
    }
  },[isCameraActive])

  useEffect(() => {
    if (ObjectToDescribe.length > 0 && isSpeaking && !isCurrentlySpeakingRef.current) {
      speakDetections(ObjectToDescribe);
 
    }
    
  },[ObjectToDescribe])

  const checkCameraPermission = async () => {
    try {
      if (!navigator.permissions || !navigator.permissions.query) {
        // Fallback for browsers that don't support permission API
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        return;
      }

      const permissionStatus = await navigator.permissions.query({
        name: 'camera'
      });

      setHasPermission(permissionStatus.state === 'granted');
      
      permissionStatus.onchange = () => {
        setHasPermission(permissionStatus.state === 'granted');
        if (permissionStatus.state !== 'granted') {
          setIsCameraActive(false);
        }
      };
    } catch (error) {
      console.error('Permission check failed:', error);
      setHasPermission(false);
      setIsCameraActive(false);
    }
  };

  const requestCameraAccess = async () => {
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
    } finally {
      setIsRequesting(false);
    }
  };

  

  const loadModel = async () => {
    try {
      await tf.ready();
      const model = await cocoSsd.load();
      modelRef.current = model;
      return true;
    } catch (err) {
      console.error('Failed to load model:', err);
      return false;
    }
  };

  const detectObjects = async () => {
    if (!webcamRef.current || !modelRef.current || !isCameraActive) return;
 
    try {
      let predictions = await modelRef.current.detect(webcamRef.current.video);
      setDetectedObjects(predictions);
      drawBoundingBoxes(predictions);
      SetObjectToDescribe(predictions)
    
    } catch (err) {
      console.error('Detection error:', err);
    }
    
    animationRef.current = requestAnimationFrame(detectObjects);
  };
 

  const drawBoundingBoxes = (predictions) => {
    if (!canvasRef.current || !webcamRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    // Set canvas dimensions
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    
    // Draw each prediction
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      
      // Draw bounding box
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = '#00FF00';
      const textWidth = ctx.measureText(prediction.class).width;
      ctx.fillRect(x, y, textWidth + 10, 25);
      
      // Draw text
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText(prediction.class, x + 5, y + 18);
    });
  };

  const speakDetections = (objectsToSpeak) => {
    if (!isSpeaking || !objectsToSpeak.length || isCurrentlySpeakingRef.current) return;
    
    // Create combined description text
    let description = 'I see ';
    const uniqueObjects = [...new Set(objectsToSpeak.map(obj => obj.class))];
    
    if (uniqueObjects.length === 1) {
      description += `a ${uniqueObjects[0]}`;
    } else {
      description += uniqueObjects.slice(0, -1).join(', ');
      description += ` and a ${uniqueObjects[uniqueObjects.length - 1]}`;
    }

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = description;
    utterance.lang = targetLanguage;
    
    // Try to find a voice that matches both language and preferred gender
    const voices = speechSynthRef.current.getVoices();
    const preferredVoice = voices.find(voice => {
      return voice.lang === targetLanguage && 
             (targetVoice === 'default' || 
              (targetVoice === 'male' && voice.name.includes('Male')) ||
              (targetVoice === 'female' && voice.name.includes('Female')));
    });
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Mark as currently speaking
    isCurrentlySpeakingRef.current = true;
    
    utterance.onend = () => {
      isCurrentlySpeakingRef.current = false;
    };
    
    utterance.onerror = () => {
      isCurrentlySpeakingRef.current = false;
    };
    
    // Cancel any ongoing speech and start new one
    speechSynthRef.current.cancel();
    speechSynthRef.current.speak(utterance);
  };

  const toggleSpeaking = () => {
      if (isSpeaking) {
        // Completely stop all speech
        speechSynthRef.current.cancel();
        isCurrentlySpeakingRef.current = false;
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        if (detectedObjects.length > 0) {
          speakDetections(detectedObjects);
        }
      }
  };

  const toggleCamera = async () => {
    if (!isCameraActive) {
      const modelLoaded = await loadModel();
      if (!modelLoaded) {
        ShowToast('error', 'Failed to load AI model');
        return;
      }
      setIsCameraActive(true);
      setIsSpeaking(true); // Auto-enable speaking when camera starts
    } else {
      // Stop everything when camera is turned off
      setIsCameraActive(false);
      cancelAnimationFrame(animationRef.current);
      speechSynthRef.current.cancel();
      isCurrentlySpeakingRef.current = false;
      setIsSpeaking(false);
      setDetectedObjects([]);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const ShowToast = (type, message) => {
    if (type && message) {
      toast[type](message, {
        position: 'top-right',
        theme: Theme
      });
    }
  };

  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <FiLoader className="animate-spin text-2xl" />
      </div>
    );
  }

  return (
    <div className={`h-full bg-transparent py-4 overflow-x-hidden w-full overflow-y-auto relative min-w-full max-w-[100%] flex flex-col justify-between`}>
    <Notifier />
    <audio src={CameraShuttleSound} ref={CameraTakenRef} className="hidden"></audio>
    <section className="md:w-full flex flex-col gap-6 px-4 py-8 w-full rounded-sm md:mx-auto bg-base-100 dark:bg-base-200 m-auto h-full">
      <h1 className="text-2xl font-bold text-center">AR Object Detection</h1>
      
      {!hasPermission ? (
        <div className="max-w-md mx-auto p-6 bg-base-100/50 dark:bg-base-200 h-fit my-auto rounded-lg text-center">
          <FiCameraOff className="mx-auto text-4xl mb-4 text-error" />
          <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
          <p className="mb-4">We need your permission to access the camera for object detection.</p>
          <button
            onClick={requestCameraAccess}
            disabled={isRequesting}
            className="btn btn-primary"
          >
            {isRequesting ? (
              <span className="flex items-center gap-2">
                <FiLoader className="animate-spin" /> Requesting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiCamera /> Allow Camera Access
              </span>
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-base-200 dark:bg-base-300 p-2 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {isCameraActive ? (
                <div className="relative">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: "environment",
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    }}
                    className="rounded-lg w-full max-w-2xl"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full object-contain rounded-lg pointer-events-none"
                  />
                </div>
              ) : (
                <div className="max-w-md mx-auto p-6 bg-base-100/50 dark:bg-base-200 h-fit my-auto rounded-lg text-center">
                  <FiCamera className="mx-auto text-4xl mb-4 text-primary" />
                  <p className="mb-4">Camera is currently off for your privacy.</p>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <button
                  onClick={toggleCamera}
                  className={`btn ${isCameraActive ? 'btn-error' : 'btn-primary'}`}
                >
                  {isCameraActive ? (
                    <span className="flex items-center gap-2">
                      <FiX /> Stop Detection
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiCamera /> Start Detection
                    </span>
                  )}
                </button>
                
                <button
                  onClick={toggleSpeaking}
                  disabled={!isCameraActive}
                  className={`btn ${isSpeaking ? 'btn-warning' : 'btn-accent'}`}
                >
                  {isSpeaking ? (
                    <span className="flex items-center gap-2">
                      <FiPause /> Stop Describing
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiVolume2 /> Start Describing
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-base-200 dark:bg-base-300 p-2 sm:p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCheckCircle /> Detected Objects
            </h2>
            
            {detectedObjects.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {detectedObjects.map((obj, index) => (
                  <div key={index} className="bg-base-100 dark:bg-base-200 p-4 rounded-lg">
                    <div className="font-bold">{obj.class}</div>
                    <div className="text-sm opacity-70">
                      Confidence: {Math.round(obj.score * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/70">
                {isCameraActive ? 'Point camera at objects to detect them...' : 'Camera is currently off'}
              </div>
            )}
          </div>
          
          <div className="bg-base-200 dark:bg-base-300 p2 sm:p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
            
            {/* Language Search Input */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70" />
              <input
                type="text"
                placeholder="Search languages..."
                value={languageSearchTerm}
                onChange={(e) => setLanguageSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language Selection */}
              <div>
                <h3 className="font-medium mb-2">Select Language</h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setTargetLanguage(lang.code)}
                      className={`btn btn-sm ${targetLanguage === lang.code ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Voice Type Selection */}
              <div>
                <h3 className="font-medium mb-2">Voice Type</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTargetVoice('default')}
                    className={`btn btn-sm ${targetVoice === 'default' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setTargetVoice('male')}
                    className={`btn btn-sm ${targetVoice === 'male' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setTargetVoice('female')}
                    className={`btn btn-sm ${targetVoice === 'female' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(AIPage);