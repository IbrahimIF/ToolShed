import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import './Button.css';
import { FaUpload, FaImage } from 'react-icons/fa';
import { IoChevronDown } from "react-icons/io5";

function Button({ onDataSent }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFetchingDescription, setIsFetchingDescription] = useState(false);
  const [showManualDescriptionInput, setShowManualDescriptionInput] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const BACKEND_ADMIN_API_BASE_URL = `${API_BASE_URL}/admin/data`;
  const BACKEND_FETCH_DESCRIPTION_URL = `${API_BASE_URL}/admin/get-page-info`;
  

  useEffect(() => {
    const fetchLists = async () => {
        try {
            const categoriesUrl = `${API_BASE_URL}/api/lists/categories`;
            const typesUrl = `${API_BASE_URL}/api/lists/types`;
            const [categoriesResponse, typesResponse] = await Promise.all([
                fetch(categoriesUrl),
                fetch(typesUrl)
            ]);

            if (!categoriesResponse.ok || !typesResponse.ok) {
                throw new Error('Failed to fetch categories or types');
            }

            const categoriesData = await categoriesResponse.json();
            const typesData = await typesResponse.json();

            setCategories(categoriesData);
            setTypes(typesData);

        } catch (error) {
            console.error("Error fetching predefined lists:", error);
        }
    };
    fetchLists();
  }, []);


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
    }, 500);
  
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
        types: selectedTypes,
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
      setSelectedTypes([]);
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


  const handleTypeClick = (type) => {
    if (selectedTypes.includes(type)) {
        setSelectedTypes([]);
    } else {
        setSelectedTypes([type]);
    }
};


  return (
    <>
      <div className="buttonContainer">
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <div className="input-animated-container">
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
            </div>
            <div className="descriptionContainer">
              <label className="description-label">Description:</label>
              {isFetchingDescription ? (
                <div className="loading-description">
                  Fetching description...
                </div>
              ) : showManualDescriptionInput ? (
                  <textarea
                    className="input"
                    rows="4"
                    placeholder="Couldn't automatically fetch description. Please enter manually."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
              ) : (
                <div className="fetched-description">
                  {description || 'Description will be fetched after entering a URL.'}
                </div>
              )}
            </div>

            <div className="dropdown-app-container">
              <div className="category-select-container">
                <button 
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="dropdown-button"
                  type="button"
                >
                  <span>Category</span>
                  &nbsp;
                  <IoChevronDown className={`dropdown-icon ${isCategoryDropdownOpen ? 'rotated' : ''}`} />
                </button>
        
                {isCategoryDropdownOpen && (
                  <div className="category-pills-container dropdown-menu">
                    {categories.map((category) => (
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
                )}
              </div>
            </div>

            <div className="dropdown-app-container">
              <div className="category-select-container">
                <button
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="dropdown-button"
                  type="button"
                >
                  <span>Type</span>
                  &nbsp;
                  <IoChevronDown className={`dropdown-icon ${isTypeDropdownOpen ? 'rotated' : ''}`} />
                </button>
                
                {isTypeDropdownOpen && (
                  <div className="category-pills-container dropdown-menu">
                    {types.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`category-pill ${selectedTypes.includes(type) ? 'selected' : ''}`}
                        onClick={() => handleTypeClick(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        
            <div className="input-animated-container">
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
              <a
                href="https://postimages.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="post-button"
              >
                <FaImage /> &nbsp; PostImages
              </a>
            </div>
          </div>
          <div className="submitButtonContainer">
            <button type="submit">
              <FaUpload /> &nbsp; Add New Tool
            </button>
          </div>
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </form>
      </div>
    </>
  );
}

export default Button;
