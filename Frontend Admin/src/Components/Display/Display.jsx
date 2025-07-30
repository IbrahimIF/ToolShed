import { useState, useEffect } from 'react';

import './Display.css';

function Display({ isSent, setIsSent }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const BACKEND_API_URL = 'http://localhost:5000/user/data';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch(BACKEND_API_URL);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
        }
        const toolsData = await response.json();
        setData(toolsData);
      } catch (error) {
        console.error("Error fetching data from backend:", error);
        setErrorMessage(`Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isSent) {
      setTimeout(() => setIsSent(false), 3000);
    }
  }, [isSent, setIsSent]);

  if (isLoading) {
    return <div className="displayContainer"><div className="loadingContainer"><div>Loading tools...</div></div></div>;
  }

  if (isSent) {
    return <div className="displayContainer"><div className="displayArea"><div style={{transition: "1s" }}>Updating...</div></div></div>;
  }

  return (
    <>
      <div className="displayContainer">
        <div className="displayArea">
          {errorMessage ? (
            <div className="error">{errorMessage}</div>
          ) : data.length === 0 ? (
            <p className="no-tools-found">No tools found in the database.</p>
          ) : (
            <ul className="text">
              {data.map(item => (
                <li key={item.id}>
                  <strong>ID:</strong> {item.id}, <strong>Name:</strong> {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Display;
