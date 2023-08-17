import { SetStateAction, useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import React from 'react';
import LoadingIcon from './LoadingIcon.tsx';

function App() {
  const [assemblyAiApiKey, setAssemblyAiApiKey] = useState('')
  const [savedAssemblyAiApiKey, setSavedAssemblyAiApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('')
  const [savedOpenAiApiKey, setSavedOpenAiApiKey] = useState('');
  
  useEffect(() => {
    return () => {
      setSavedAssemblyAiApiKey('');
      setSavedOpenAiApiKey('');
      setVideoUrl('')
      setQaSummary('')
      setIsLoading(false)
        
    };
  }, []);

  const handleAssemblyAiApiKeyChange = (event: { target: { value: SetStateAction<string> } }) => {
    setAssemblyAiApiKey(event.target.value);
  };

  const handleOpenAiApiKeyChange = (event: { target: { value: SetStateAction<string> } }) => {
    setOpenAiApiKey(event.target.value);
  };

  const handleSaveApiKey = () => {
    setSavedAssemblyAiApiKey(assemblyAiApiKey)
    setSavedOpenAiApiKey(openAiApiKey)
    setAssemblyAiApiKey('');
    setOpenAiApiKey('');
    console.log('api keys saved')
  };

  const handleClearApiKey = () => {
    setSavedAssemblyAiApiKey('');
    setSavedOpenAiApiKey('');
    setVideoUrl('')
    setQaSummary('')
    setIsLoading(false)
    console.log('data cleared')
  };

  const enterYourApiKeyPage = (
    <div>
      <h1>Welcome!</h1>
      <p>Please enter your AssemblyAI and your Open Ai API Keys to begin.</p>

      <div className='light-spacing'>
          <label htmlFor="apiKey">AssemblyAi API Key:</label>
          <input
            className="api-input-1"
            type="password"
            id="apiKey-1"
            value={assemblyAiApiKey}
            onChange={handleAssemblyAiApiKeyChange}
            placeholder="Enter your API key"
        />
      </div>
      <div className='light-spacing'>
          <label htmlFor="apiKey">OpenAi API Key:</label>
          <input
            className="api-input-2"
            type="password"
            id="apiKey-2"
            value={openAiApiKey}
            onChange={handleOpenAiApiKeyChange}
            placeholder="Enter your API key"
          />
      </div>
      <button className='light-spacing' onClick={handleSaveApiKey} disabled={!assemblyAiApiKey||!openAiApiKey}>Save</button>
    </div>
  );

  const [videoUrl, setVideoUrl] = useState('')
  const [qaSummary, setQaSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const qaSummaryWithLineBreaks = qaSummary.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const handleVideoUrlChange = (event: { target: { value: SetStateAction<string> } }) => {
    setVideoUrl(event.target.value);
  };

  const handleUpload = async () => {
    setIsLoading(true)
    setQaSummary('')
    if (videoUrl) {
      const data = {
        url: videoUrl,
      };

      const headers = {
        assemblyAiKey: savedAssemblyAiApiKey,
        openAiKey: savedOpenAiApiKey,
      };

      try {
        const response = await axios.post('http://localhost:5000/get_qa_arr', data,{
          headers,
        });

        // Handle the response here
        console.log('Server Response:', response.data);
        setQaSummary(response.data.result)
        setIsLoading(false)
      } catch (error) {
        console.error('Error:', error);
        alert("An Error Occurred: "+error)
        setIsLoading(false)
      }
    }
  };

  const savedApiKeyPage = (
    <div>
      <p>Your API Key is saved.</p>
      <button onClick={handleClearApiKey}>Clear API Key</button>
      <div>
        <h2>Enter Your Video URL</h2>
        <div className='light-spacing'>
          <input
              className="url-input"
              value={videoUrl}
              onChange={handleVideoUrlChange}
              placeholder=''
          />
        </div>
        { isLoading ? <LoadingIcon /> : <button onClick={handleUpload} disabled={!videoUrl}>Upload</button>}
        {qaSummary === '' ? <div></div> :  
          <div>
            <h3>Video Summary in Q and A format:</h3>
            <p className="qaText">{qaSummaryWithLineBreaks}</p>
          </div>
        }
      </div>
      
    </div>
  );

  return (
    <>
      <div>
      {savedAssemblyAiApiKey === '' && savedOpenAiApiKey === '' ? enterYourApiKeyPage : savedApiKeyPage}
      </div>
    </>
  )
}

export default App
