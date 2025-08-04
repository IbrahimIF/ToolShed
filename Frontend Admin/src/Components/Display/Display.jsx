import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import './Display.css';

function Display({ isSent, setIsSent }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const BACKEND_API_URL = `${API_BASE_URL}/user/data`;

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isSent) {
      fetchData();
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
            <ul>
              <div className="toolListHeader">
                <span className="headerItem">Name</span>
                <span className="headerItem">Link</span>
                <span className="headerItem">Categories</span>
              </div>
              {data.map(item => (
                <div className="toolCard" key={item.id}>
                  <div className="toolInfo">
                    <h4>{item.name}</h4>
                  </div>
                  <div className="toolInfo">
                    <a href={item.links[0]?.url} target="_blank" rel="noopener noreferrer">
                      {item.links[0]?.url}
                    </a>
                  </div>
                  <div className="categoryPills">
                    {item.category.slice(0,2).map(cat => (
                      <span key={cat} className="categoryPill">{cat}</span>
                    ))}
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Display;
