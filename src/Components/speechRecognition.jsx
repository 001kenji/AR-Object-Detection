import { useEffect, useRef, useState } from "react";

const UseSpeechRecognition = () => {
    const [RecordedHooktext, setRecordedHooktext] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

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
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const startRecording = () => {
        if (recognitionRef.current && !isListening) {
            
            setRecordedHooktext('')
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return {
        RecordedHooktext,
        isListening,
        startRecording,
        stopRecording,
    };
};

export default UseSpeechRecognition;
