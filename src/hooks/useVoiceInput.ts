import { useState, useRef, useEffect } from 'react'

const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  English: 'en-US',
  Tamil: 'ta-IN',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  Marathi: 'mr-IN',
  Bengali: 'bn-IN',
  Gujarati: 'gu-IN',
  Odia: 'or-IN',
  Punjabi: 'pa-IN',
  Urdu: 'ur-IN',
  Sanskrit: 'sa-IN'
}

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      let currentResult = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentResult += event.results[i][0].transcript
        } else {
          currentResult += event.results[i][0].transcript
        }
      }
      if (currentResult) {
        setTranscript(currentResult)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const startListening = (languageName: string = 'English') => {
    if (!isSupported || !recognitionRef.current) {
      return false
    }

    // Map selected language to locale code
    const locale = LANGUAGE_LOCALE_MAP[languageName] || 'en-US'
    recognitionRef.current.lang = locale
    setTranscript('')

    try {
      recognitionRef.current.start()
      return true
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
      return false
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    setTranscript
  }
}
