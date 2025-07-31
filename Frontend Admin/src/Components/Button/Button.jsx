import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload }  from '@fortawesome/free-solid-svg-icons';

const predefinedCategories = [
  'Productivity',
  'Writing',
  'AI',
  'Web Development',
  'Design',
  'Finance',
  'Education',
];

function Button({ onDataSent }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFetchingDescription, setIsFetchingDescription] = useState(false);
  const [showManualDescriptionInput, setShowManualDescriptionInput] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const BACKEND_ADMIN_API_BASE_URL = `${API_BASE_URL}/admin/data`;
  const BACKEND_FETCH_DESCRIPTION_URL = `${API_BASE_URL}/admin/get-page-info`;
  
  useEffect(() => {
    const fetchDescription = async () => {
      if (linkUrl) {
        setIsFetchingDescription(true);
        setShowManualDescriptionInput(false);
        try {
          const response = await fetch(BACKEND_FETCH_DESCRIPTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: linkUrl }),
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
          }
          const data = await response.json();
          setDescription(data.description || 'No description found.');
        } catch (error) {
          console.error(`Error fetching description for ${linkUrl}:`, error);
          setDescription('');
          setShowManualDescriptionInput(true)
        } finally {
          setIsFetchingDescription(false);
        }
      } else {
        setDescription('');
        setShowManualDescriptionInput(false);
      }
    };
  
    const debounceFetch = setTimeout(() => {
      fetchDescription();
    }, 500); // Debounce to avoid fetching on every keypress
  
    return () => clearTimeout(debounceFetch);
  }, [linkUrl]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('Adding tool...');
  
    if (!name || !linkUrl) {
      setUploadStatus('Name and Link URL are required.');
      return;
    }
  
    try {
      const newToolId = crypto.randomUUID();
  
      const linksArray = [];
      if (linkUrl) {
        linksArray.push({ url: linkUrl, label: name });
      }
  
      const newTool = {
        id: newToolId,
        name: name,
        description: description,
        category: selectedCategories,
        links: linksArray,
        imageUrl: imageUrl,
      };
  
      const payload = {
        id: newTool.id,
        data: newTool,
      };
  
      const response = await fetch(`${BACKEND_ADMIN_API_BASE_URL}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add tool: ${errorText}`);
      }
  
      setUploadStatus(`Tool "${name}" (ID: ${newToolId}) added successfully!`);
      onDataSent();
  
      setName('');
      setDescription('');
      setSelectedCategories([]);
      setLinkUrl('');
      setImageUrl('');
      setShowManualDescriptionInput(false);
  
    } catch (error) {
      console.error("Error adding tool to backend:", error);
      setUploadStatus(`Failed to add tool: ${error.message}`);
    }
  };
  
  const handleCategoryClick = (category) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(cat => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };
  
  return (
    <>
      <div className="buttonContainer">
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <div className="input-Animated">
              <input
                type="text"
                className="input"
                placeholder="Tool Name (e.g., Notion)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="highlight"></div>
            </div>

            <div className="input-Animated">
              <input
                type="url"
                className="input"
                placeholder="Official Site URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />
              <div className="highlight"></div>
            </div>

            <div className="descriptionContainer">
              <label className="description-label">Description:</label>
              {isFetchingDescription ? (
                <div className="loading-description">
                  Fetching description...
                </div>
              ) : showManualDescriptionInput ? (
                <div className="input-Animated">
                  <textarea
                    className="input"
                    rows="4"
                    placeholder="Couldn't automatically fetch description. Please enter manually."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              ) : (
                <div className="fetched-description">
                  {description || 'Description will be fetched after entering a URL.'}
                </div>
              )}
            </div>

            <div className="category-select-container">
              <label className="category-label">Categories:</label>
              <div className="category-pills-container">
                {predefinedCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`category-pill ${selectedCategories.includes(category) ? 'selected' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-Animated">
              <input
                type="url"
                className="input"
                placeholder="Image URL (postimage)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="highlight"></div>
            </div>
          </div>
          <div className="submitButtonContainer">
            <button type="submit">
              <FontAwesomeIcon icon={faUpload} /> &nbsp; Add New Tool
            </button>
          </div>
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </form>
      </div>
    </>
  );
}

export default Button;
