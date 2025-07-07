import React, {  useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";
import {useSelector} from 'react-redux'
import {  toast } from 'react-toastify';
import useGeminiTextGen from "../Components/aiRequest.jsx";
import { FiUpload, FiSearch, FiCamera,FiCameraOff,FiChevronDown,FiCheck  , FiLoader, FiCheckCircle, FiX, FiGlobe } from 'react-icons/fi';
import { TbLanguage } from 'react-icons/tb';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
// lottieflow animated icons 
import Notifier from "../Components/notifier.jsx";
const AIPage = ({isAuthenticated}) => {
  
    const { response, loading, error, generateText } = useGeminiTextGen()
    const [IsLoading,SetIsLoading] = useState(false)
    const Theme = useSelector((state)=> state.auth.Theme)  
    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('French');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);
    const webcamRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const languages = [
        'English',
        'French',
        'Spanish',
        'German',
        'Italian',
        'Portuguese',
        'Russian',
        'Chinese',
        'Japanese',
        'Arabic',
        'Hindi',
        'Bengali',
        'Urdu',
        'Turkish',
        'Vietnamese',
        'Korean',
        'Thai',
        'Polish',
        'Dutch',
        'Greek',
        'Czech',
        'Hungarian',
        'Swedish',
        'Finnish',
        'Norwegian',
        'Danish',
        'Hebrew',
        'Malay',
        'Indonesian',
        'Filipino',
        'Persian',
        'Swahili',
        'Zulu',
        'Xhosa',
        'Afrikaans',
        'Romanian',
        'Bulgarian',
        'Serbian',
        'Croatian',
        'Slovak',
        'Slovenian',
        'Ukrainian',
        'Belarusian',
        'Estonian',
        'Latvian',
        'Lithuanian',
        'Albanian',
        'Macedonian',
        'Bosnian',
        'Armenian',
        'Georgian',
        'Kazakh',
        'Uzbek',
        'Pashto',
        'Nepali',
        'Sinhala',
        'Tamil',
        'Telugu',
        'Kannada',
        'Malayalam',
        'Marathi',
        'Gujarati',
        'Punjabi',
        'Burmese',
        'Khmer',
        'Lao',
        'Mongolian',
        'Haitian Creole',
        'Yoruba',
        'Igbo',
        'Hausa',
        'Amharic',
        'Somali',
        'Maori',
        'Samoan',
        'Tongan',
        'Fijian',
        'Basque',
        'Catalan',
        'Galician',
        'Welsh',
        'Irish',
        'Scottish Gaelic',
        'Icelandic',
        'Esperanto',
        'Latin'
      ];

    const AIConfigurationText = {
        role: 'user',
        parts: [{ text :`Only provide the answer directly.Do not provide explanations or such but provide the translations requested by user.` }]

    }


    function ShowToast(type, message, progress = null) {
            if (type != null && message != null) {
                // If progress is provided (format: "current/total"), add it to the message
                let toastMessage = message;
                if (progress) {
                    const [current, total] = progress.split('/');
                    if (current && total) {
                        toastMessage = `(${current}/${total}) ${message}`;
                    }
                }
        
                const toastOptions = {
                    type: type,
                    theme: Theme,
                    position: 'top-right',
                    // Add progress bar if it's a progress notification
                    ...(progress && {
                        progressStyle: { backgroundColor: type === 'success' ? '#4CAF50' : 
                                        type === 'error' ? '#F44336' :
                                        type === 'warning' ? '#FFC107' : '#2196F3' },
                        autoClose: false // Keep open until manually closed for progress toasts
                    })
                };
        
                // Return the toast ID so you can update or close it later
                return toast(toastMessage, toastOptions);
            }
            return null;
    }
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const captureImage = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    };
    const filteredLanguages = languages.filter(lang =>
      lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const extractTextFromImage = async () => {
      if (!image) return;
      
      setIsProcessing(true);
      try {
        const { data: { text } } = await Tesseract.recognize(
          image,
          'eng',
          { logger: m => console.log(m) }
        );
        setExtractedText(text);
      } catch (err) {
        console.error('OCR Error:', err);
      } finally {
        setIsProcessing(false);
      }
    };

    const translateText = async () => {
      if (!extractedText) return;
      
      try {
        const prompt = [
          AIConfigurationText,
          {
            role: 'user',
            parts: [{ text: `Translate the following text to ${targetLanguage}:\n\n${extractedText}` }]
          }
        ];
        
        const translation = await generateText(prompt);
        setTranslatedText(translation);
      } catch (err) {
        console.error('Translation Error:', err);
      }
    };

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      ShowToast('success','Copied')
    };

    useEffect(() => {
      checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
      try {
        // Check if the API is available
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
        };
      } catch (error) {
        console.error('Permission check failed:', error);
        setHasPermission(false);
      }
    };

    const requestCameraAccess = async () => {
      setIsRequesting(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true
        });
        
        setHasPermission(true);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Camera access denied:', error);
        setHasPermission(false);
      } finally {
        setIsRequesting(false);
      }
    };

    if (hasPermission === null) {
      return (
        <div className="flex items-center justify-center p-8">
          <FiLoader className="animate-spin text-2xl" />
        </div>
      );
    }

    if (!hasPermission) {
      return (
        <div className="max-w-md mx-auto p-6 bg-base-200 h-fit my-auto rounded-lg text-center">
          <FiCameraOff className="mx-auto text-4xl mb-4 text-error" />
          <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
          <p className="mb-4">We need your permission to access the camera for document scanning.</p>
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
      );
    }

  
    return (
        <div className={` h-full  bg-transparent  py-4  overflow-x-hidden w-full overflow-y-auto relative min-w-full max-w-[100%] flex flex-col justify-between  `} >
            <Notifier />

            <section className="md:w-full flex flex-col gap-6 px-4 py-8 w-full rounded-sm md:mx-auto bg-base-100 dark:bg-base-200 m-auto h-full">
                <h1 className="text-2xl font-bold text-center">AI Document Translator</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 dark:bg-base-300 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FiUpload /> Upload or Capture Document
                    </h2>
                    
                    <div className="flex flex-col gap-4">
                        <button 
                        onClick={() => fileInputRef.current.click()}
                        className="btn btn-secondary w-full"
                        >
                        <FiUpload className="mr-2" /> Upload Image
                        </button>
                        <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                        />
                        
                        <div className="divider">OR</div>
                        
                        <div className="flex flex-col gap-2">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                height={500}
                                screenshotFormat="image/jpeg"
                                width={500}
                                videoConstraints={{
                                    width: 500,
                                    height: 500,
                                    facingMode: "environment",
                                }}
                                className=" rounded-md"
                            >
                                
                            </Webcam>
                            <button 
                                onClick={captureImage}
                                className="btn btn-secondary w-full"
                            >
                                <FiCamera className="mr-2" /> Capture Image
                            </button>
                        </div>
                    </div>
                    </div>
                    
                    <div className="bg-base-200 dark:bg-base-300 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Document Preview</h2>
                    {image ? (
                        <div className="relative">
                        <img 
                            src={image} 
                            alt="Uploaded document" 
                            className="w-full h-64 object-contain rounded-lg border border-base-content/20"
                        />
                        <button 
                            onClick={() => setImage(null)}
                            className="btn btn-circle btn-sm absolute top-2 right-2"
                        >
                            <FiX />
                        </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-base-300 rounded-lg border-2 border-dashed border-base-content/30">
                        <p className="text-base-content/50">No document selected</p>
                        </div>
                    )}
                    </div>
                </div>
                
                <div className="bg-base-200 dark:bg-base-300 p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FiCheckCircle /> Extracted Text
                    </h2>
                    <button 
                        onClick={extractTextFromImage}
                        disabled={!image || isProcessing}
                        className="btn btn-primary md:w-auto w-full"
                    >
                        {isProcessing ? (
                        <span className="flex items-center gap-2">
                            <FiLoader className="animate-spin" /> Processing...
                        </span>
                        ) : 'Extract Text'}
                    </button>
                    </div>
                    
                    <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Extracted text will appear here..."
                    className="textarea textarea-bordered w-full h-40 font-mono"
                    />
                </div>
                
                <div className="bg-base-200 dark:bg-base-300 p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex flex-row flex-wrap items-center gap-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                        <TbLanguage /> Translation
                        </h2>
                        <div className="relative w-[200px] " ref={dropdownRef}>
                          <div 
                            className="select select-bordered flex items-center cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <div className="flex-1 flex items-center gap-2">
                              <FiGlobe />
                              <span>{targetLanguage}</span>
                            </div>
                            <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                          </div>
                        
                        {isDropdownOpen && (
                          <div className="absolute z-10 mt-2 w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-100 rounded-lg shadow-lg overflow-hidden">
                            {/* Search Input */}
                            <div className="p-2 border-b border-base-200 dark:border-base-300">
                              <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70" />
                                <input
                                  type="text"
                                  placeholder="Search languages..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="input input-sm w-full pl-10 focus:ring-1 focus:ring-primary"
                                  autoFocus
                                />
                                {searchTerm && (
                                  <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-error"
                                  >
                                    <FiX  size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Language List */}
                            <div className="max-h-60 overflow-y-auto">
                              {filteredLanguages.length > 0 ? (
                                filteredLanguages.map((lang) => (
                                  <div
                                    key={lang}
                                    className={`px-4 py-2 hover:bg-base-200 dark:hover:bg-base-300 cursor-pointer flex items-center gap-2 ${
                                      targetLanguage === lang ? 'bg-primary/10 text-primary' : ''
                                    }`}
                                    onClick={() => {
                                      setTargetLanguage(lang);
                                      setIsDropdownOpen(false);
                                      setSearchTerm('');
                                    }}
                                  >
                                    {targetLanguage === lang && <FiCheck className="text-primary" />}
                                    <span>{lang}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-center text-base-content/70">
                                  No languages found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                        
                    </div>
                    
                    <div className="flex flex-row flex-wrap justify-between gap-2">
                        <button 
                        onClick={translateText}
                        disabled={!extractedText || loading}
                        className="btn btn-accent md:w-auto w-[80%]"
                        >
                        {loading ? (
                            <span className="flex items-center gap-2">
                            <FiLoader className="animate-spin" /> Translating...
                            </span>
                        ) : 'Translate'}
                        </button>
                        {translatedText && (
                        <button 
                            onClick={() => copyToClipboard(translatedText)}
                            className="btn btn-ghost"
                        >
                            Copy
                        </button>
                        )}
                    </div>
                    </div>
                    
                    <textarea
                    value={translatedText}
                    readOnly
                    placeholder="Translation will appear here..."
                    className="textarea textarea-bordered w-full h-40 font-mono"
                    />
                </div>
                
                {error && (
                    <div className="alert alert-error">
                    <div className="flex-1">
                        <label className="font-bold">Error:</label>
                        <p>{error}</p>
                    </div>
                    </div>
                )}
            </section>

        </div>
    )
};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps,null)(AIPage)
