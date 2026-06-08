import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceRecognition(onTranscript: (text: string) => void, onEnd?: (finalText: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef(onTranscript);
  const onEndRef = useRef(onEnd);
  const accumulatedTextRef = useRef('');

  useEffect(() => {
    callbackRef.current = onTranscript;
    onEndRef.current = onEnd;
  }, [onTranscript, onEnd]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-CL'; // Spanish - Chile

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          accumulatedTextRef.current += finalTranscript;
          callbackRef.current(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (onEndRef.current && accumulatedTextRef.current) {
          onEndRef.current(accumulatedTextRef.current.trim());
        }
        accumulatedTextRef.current = '';
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      accumulatedTextRef.current = '';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      // onend is typically fired by stop() automatically, so the onEnd callback will be handled there.
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return { isListening, isSupported, startListening, stopListening, toggleListening };
}
