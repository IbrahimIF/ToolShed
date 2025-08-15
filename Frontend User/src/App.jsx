import { useState, useEffect } from 'react'
import SearchBar from './Components/Search/search-bar';
import ToolGrid from './Components/Tools/toolgrid';
import ToolShed from './assets/toolshed.png';
import './App.css'

const BACKEND_API_URL = 'https://toolshed-3mss.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:3001';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
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


  const fetchLists = async (baseUrl) => {
    const categoriesUrl = `${baseUrl}/api/lists/categories`;
    const typesUrl = `${baseUrl}/api/lists/types`;

    const [categoriesResponse, typesResponse] = await Promise.all([
      fetch(categoriesUrl),
      fetch(typesUrl)
    ]);

    const categoriesData = await categoriesResponse.json();
    const typesData = await typesResponse.json();

    return { categoriesData, typesData };
  };

  useEffect(() => {
    const fetchAllData = async (urlToUse) => {
      try {
        const [toolsData, listsData] = await Promise.all([
          fetchToolsFromUrl(urlToUse),
          fetchLists(urlToUse)
        ]);

        setTools(toolsData);
        setCategories(['All', ...listsData.categoriesData]);
        setTypes(['All', ...listsData.typesData]);
        setLoading(false);
        setError(null);
        console.log('Successfully fetched all data!');
      } catch (error) {
        console.error('Failed to fetch from current URL:', error);
        throw error;
      }
    };

    const attemptFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchAllData(BACKEND_API_URL);
      } catch (renderError) {
        console.warn('Failed to fetch from Render.com, attempting localhost...');
        try {
          await fetchAllData(LOCAL_BACKEND_URL);
        } catch (localhostError) {
          console.error('Failed to fetch from both Render.com and localhost:', localhostError);
          setLoading(false);
          setError('Failed to load tools. Please check your internet connection or server status.');
        }
      }
    };
    
    attemptFetch();
  }, []);

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


  const filteredTools = tools.filter(tool => {
      const lowerSearchTerm = searchTerm.toLowerCase();

      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategoryBySearch = tool.category.some(cat => cat.toLowerCase().includes(lowerSearchTerm));

      const matchesCategoryByFilter = selectedCategory === 'All' ||
                                    (tool.category && tool.category.includes(selectedCategory));

      const matchesTypeBySearch = tool.types && tool.type.some(type => type.toLowerCase().includes(lowerSearchTerm));

      return matchesCategoryByFilter && (matchesSearch || matchesCategoryBySearch || matchesTypeBySearch);
  });


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
              types={types}
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
