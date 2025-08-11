import { useState, useEffect } from 'react'
import SearchBar from './Components/Search/search-bar';
import ToolGrid from './Components/Tools/toolgrid';
import ToolShed from './assets/toolshed.png';
import { categories } from './Components/data/toolsData';
import './App.css'

const BACKEND_API_URL = 'https://toolshed-3mss.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:3001';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const fetchToolsFromUrl = async (baseUrl) => {
    const url = `${baseUrl}/user/data`;
    console.log(`Attempting to fetch tools from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText} from ${url}`);
    }
    return await response.json();
  };

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchToolsFromUrl(BACKEND_API_URL);
        setTools(data);
        console.log('Successfully fetched tools from Render.com');
      } catch (renderError) {
        console.warn('Failed to fetch from Render.com, attempting localhost:', renderError);
        try {
          const data = await fetchToolsFromUrl(LOCAL_BACKEND_URL);
          setTools(data);
          console.log('Successfully fetched tools from localhost');
        } catch (localhostError) {
          console.error('Failed to fetch from both Render.com and localhost:', localhostError);
          setError('Failed to load tools. Please check your internet connection or server status.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' ||
                            (tool.category && tool.category.includes(selectedCategory));
      return matchesSearch && matchesCategory;
  });


  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 150) {
        setScrolled(true);
    } else {
        setScrolled(false);
    }
};

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => {
      window.removeEventListener('scroll', handleScroll);
  };
}, []);


  return (
      <div className="main-container">
          <h1 className="text-4xl font-bold text-amber-300 mb-8 text-center"> <img src={ToolShed} className="logo" alt="Toolshed logo" /> ToolShed </h1>
          <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showFilterOptions={showFilterOptions}
              setShowFilterOptions={setShowFilterOptions}
              categories={categories}
              isScrolled={scrolled}
          />
        {loading && <p className="loading-message">Loading tools...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <ToolGrid filteredTools={filteredTools} />
        )}
      </div>
  );
}

export default App
