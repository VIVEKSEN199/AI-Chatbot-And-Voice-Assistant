import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompt, setPrevprompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');
    const [voiceSearch, setVoiceSearch] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [recordingAnimation, setRecordingAnimation] = useState(false);
    const [mood, setMood] = useState('neutral');

    const deplayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index)
    }

    useEffect(() => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceSearch(false);
            setInput(transcript);
            onSent(transcript);
            setInput("")
            setRecordingAnimation(false);
        };
        recognition.onend = () => {
            setVoiceSearch(false);
            setRecordingAnimation(false);
        };
        setRecognition(recognition);
    }, []);

    const openVoiceSearch = () => {
        if (!voiceSearch) {
            recognition.start();
            setVoiceSearch(true);
            setRecordingAnimation(true);
        }
    };

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }
const detectMood = (text) => {
  const lower = text.toLowerCase();
  if(lower.includes('frustrated') || lower.includes('angry') || lower.includes('gussa') || lower.includes('pareshan')){
    setMood('frustrated');
  } else if(lower.includes('happy') || lower.includes('thanks') || lower.includes('great') || lower.includes('khush') || lower.includes('awesome')){
    setMood('happy');
  } else if(lower.includes('sad') || lower.includes('upset') || lower.includes('dukhi')){
    setMood('sad');
  } else if(lower.includes('confused') || lower.includes('samajh') || lower.includes('help')){
    setMood('confused');
  } else {
    setMood('neutral');
  }
};
    const onSent = async (prompt) => {
        if (loading) return;
        setLoading(true);
        setShowResult(true);
        setResultData("");

        if (prompt !== undefined) {
            setRecentPrompt(prompt);
            setInput("");
        } else {
            setPrevprompt(prev => [...prev, input]);
            setRecentPrompt(input);
            setInput("");
            prompt = input;
        }
detectMood(prompt || input);
        console.log("Calling runChat with:", prompt);
        const response = await runChat(prompt);
        const speakResponse = (text) => {
  const cleanText = text.replace(/<[^>]*>/g, '');
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};
speakResponse(response);
        console.log("Got response:", response);

        let newResponse = "";
        let responseArray = response.split("**");
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }

        let formattedResponse = newResponse.split("*").join("</br>");
        setResultData(formattedResponse);
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSent();
        }
    };

    const contextValue = {
        prevPrompt,
        setPrevprompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        handleKeyPress,
        voiceSearch,
        openVoiceSearch,
        recordingAnimation,
        setRecordingAnimation,
        mood,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export { Context };
export default ContextProvider;