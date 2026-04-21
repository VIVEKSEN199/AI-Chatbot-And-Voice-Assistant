import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, handleKeyPress, openVoiceSearch, voiceSearch, recordingAnimation, mood } = useContext(Context);
const [selectedImage, setSelectedImage] = React.useState(null);
    return (
        <div className="main" style={{
  background: mood === 'happy' ? '#e8f5e9' :
              mood === 'frustrated' ? '#ffebee' :
              mood === 'sad' ? '#e3f2fd' :
              mood === 'confused' ? '#fff8e1' : 'white'
}}>
            <div className="nav">
                <p>Chatbot</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">

                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Dev</span></p>
                            <p>How can I help you?</p>
                        </div>
                        <div className="cards">
                            <div className="card">
                                <p>Suggest Beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Briefly summarize this concept urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className='result-title'>
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className='result-data'>
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}
{selectedImage && (
  <div style={{padding:'10px', textAlign:'center'}}>
    <img 
      src={selectedImage} 
      alt="Selected" 
      style={{
        maxWidth:'200px', 
        maxHeight:'200px', 
        borderRadius:'10px',
        border:'2px solid #4b90ff'
      }}
    />
    <p 
      onClick={() => setSelectedImage(null)}
      style={{
        color:'red', 
        cursor:'pointer',
        fontSize:'12px'
      }}>
      ✕ Remove
    </p>
  </div>
)}
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            onKeyDown={handleKeyPress}
                            placeholder="Enter a prompt here"
                        />
                        <input 
  type="file" 
  id="imageUpload" 
  accept="image/*" 
  style={{display:'none'}}
  onChange={(e) => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  }
}}
/>
                        <div>
                            <img 
  src={assets.gallery_icon} 
  alt="" 
  style={{cursor:'pointer'}}
  onClick={() => document.getElementById('imageUpload').click()}
/>
                            <img
                                src={assets.mic_icon}
                                alt="Mic Icon"
                                onClick={openVoiceSearch}
                                className={`mic-icon ${voiceSearch ? "active" : ""} ${recordingAnimation ? "recording" : ""}`}
                            />
                            <button 
  onClick={() => window.speechSynthesis.cancel()}
  style={{
    cursor:'pointer',
    background:'red',
    color:'white',
    border:'none',
    borderRadius:'5px',
    padding:'5px 10px',
    marginRight:'8px'
  }}>
  ⏹ Stop
</button>
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                    Gemini may display inaccurate info including about people so double check its responses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
