import { useState } from 'react';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload }  from '@fortawesome/free-solid-svg-icons';



function Button({onDataSent}) {
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [categoryInput, setCategoryInput] = useState('');
const [linkUrl, setLinkUrl] = useState('');
const [linkLabel, setLinkLabel] = useState('');
const [imageUrl, setImageUrl] = useState('');

const [uploadStatus, setUploadStatus] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setUploadStatus('Adding tool...');

  const BACKEND_ADMIN_API_BASE_URL = 'http://localhost:5000/admin/data';
  if (!name || !linkUrl) {
    setUploadStatus('Name and Link URL are required.');
    return;
  }

  try {
    const newToolId = crypto.randomUUID();
    const categoriesArray = categoryInput
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat !== '');

    const linksArray = [];
    if (linkUrl) {
      linksArray.push({ url: linkUrl, label: linkLabel || 'Official Site' });
    }

    const newTool = {
      id: newToolId,
      name: name,
      description: description,
      category: categoriesArray,
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

    setUploadStatus(`Tool "${name}" added successfully!`);
    onDataSent();
    setName('');
    setDescription('');
    setCategoryInput('');
    setLinkUrl('');
    setLinkLabel('');
    setImageUrl('');

  } catch (error) {
    console.error("Error adding tool to backend:", error);
    setUploadStatus(`Failed to add tool: ${error.message}`);
  }
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
              type="text"
              className="input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="highlight"></div>
          </div>

          <div className="input-Animated">
            <input
              type="text"
              className="input"
              placeholder="Categories (comma-separated, e.g., Productivity, Writing)"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
            <div className="highlight"></div>
          </div>

          {/* Input for Link URL */}
          <div className="input-Animated">
            <input
              type="url"
              className="input"
              placeholder="Official Site URL (e.g., https://www.notion.com/)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
            />
            <div className="highlight"></div>
          </div>

          {/* Input for Link Label */}
          <div className="input-Animated">
            <input
              type="text"
              className="input"
              placeholder="Link Label (e.g., Official Site)"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
            />
            <div className="highlight"></div>
          </div>

          <div className="input-Animated">
            <input
              type="url"
              className="input"
              placeholder="Image URL (e.g., https://i.postimg.cc/...)"
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


