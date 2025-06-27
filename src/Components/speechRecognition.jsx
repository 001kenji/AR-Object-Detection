import { useCallback, useEffect, useRef, useState } from "react";

const UseSpeechRecognition = () => {
    const [RecordedHooktext, setRecordedHooktext] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [ErrorMessagesHook,SetErrorMessagesHook] = useState('')
    const recognitionRef = useRef(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setRecordedHooktext((prev) => prev + " " + transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            // alert(`"Speech recognition error:", ${event.error}`)
            if (event.error === 'not-allowed') {
                setPermissionDenied(true);
            }
            setIsListening(false);
            stopRecording()
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const requestMicrophonePermission = useCallback(async () => {
        try {
            // First check if mediaDevices is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('MediaDevices API not available');
            }
    
            // Check if we're in a secure context (HTTPS or localhost)
            if (window.isSecureContext === false) {
                throw new Error('Microphone access requires HTTPS or localhost');
            }
    
            // Request permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Immediately stop using the stream (we just needed the permission)
            stream.getTracks().forEach(track => track.stop());
            
            setPermissionDenied(false);
            return true;
        } catch (error) {
            console.error("Microphone permission error:", error);
            setPermissionDenied(true);
            
            // Provide specific error messages
            if (error.name === 'NotAllowedError') {
                SetErrorMessagesHook("Microphone access was denied. Please allow microphone permissions.")
                // alert("Microphone access was denied. Please allow microphone permissions.");
            } else if (error.message.includes('HTTPS')) {
                // alert("Microphone access requires a secure connection (HTTPS).");
            } else {
                // alert("Could not access microphone: " + error.message);
            }
            
            return false;
        }
    }, []);

    const startRecording = useCallback(async () => {
        if (recognitionRef.current && !isListening) {
            try {
                setRecordedHooktext('');
                
                // First request microphone permission
                const hasPermission = await requestMicrophonePermission();
                
                if (!hasPermission) {
                    SetErrorMessagesHook("Microphone access is required for speech recognition. Please enable it")
                    // alert("Microphone access is required for speech recognition");
                    
                    return;
                }
                
                setIsListening(true);
                recognitionRef.current.start();
            } catch (error) {
                console.error("Error starting recognition:", error);
                setIsListening(false);
            }
        }
    }, [isListening, requestMicrophonePermission]);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current && isListening) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return {
        RecordedHooktext,
        setRecordedHooktext,
        isListening,
        startRecording,
        stopRecording,
        permissionDenied,
        requestMicrophonePermission,
        ErrorMessagesHook,
        SetErrorMessagesHook
    };
};

export default UseSpeechRecognition;
