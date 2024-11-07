import logo from './Logo.png';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
function App() {
  // State to store form data and API response
  //const [apiUrl,setApiUrl] = useState("http://localhost/homecare/v1/login");
  const [apiUrl,setApiUrl] = useState("https://staging.myadulthomecare.com/v1/login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  
  // Handle change in phone number input
  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle form submission (API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber) {
      alert("Please enter a valid phone number");
      return;
    }

    // Prepare data for the API request
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const formData = new FormData();
    formData.append("username", "HubSpot_User");
    formData.append("password", "Nvcrm@007");
    formData.append("secret_key", secretKey); // Replace with actual secret_key if received
    formData.append("timestamp", timestamp);
    formData.append("phone_number", phoneNumber);

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Initial API request
      //https://staging.myadulthomecare.com/v1/login
      let result = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Check if statusCode is 401 and if there is a new key
      if (result.data.statusCode === 401 && result.data.key) {
        console.log("Received new key, updating secret_key.");
        
        // Replace the secret_key with the new key
        setSecretKey(result.data.key); // Update the secret_key in the state
        formData.set("secret_key", result.data.key); // Update secret_key in formData

        // Resubmit the request with the new key
        result = await axios.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Check if statusCode is 200 and contains access_url
      if (result.data.statusCode === 200 && result.data.access_url) {
        console.log("Access URL received, opening in a new tab.");
        //setIframeUrl(result.data.access_url); // Set the URL for iframe
         window.open(result.data.access_url, "_blank"); // Open the URL in a new tab
      }

      // Set the final response state
      setResponse(result.data);

    } catch (err) {
      // Handle errors
      setError("Failed to fetch data: " + err.message);
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 style={{color: 'black'}}>Enter phone number to get access of Myadulthomecare</h1>
      </header>
      <div className="App-content">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {response && <p>Response: {JSON.stringify(response)}</p>}

        
      </div>
    </div>
  );
}

export default App;
