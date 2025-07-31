import { useState, useEffect } from 'react'
import SearchBar from './Components/Search/search-bar';
import ToolGrid from './Components/Tools/toolgrid';
import ToolShed from './assets/toolshed.png';
import { tools as initialTools, categories } from './Components/data/toolsData';
import './App.css'

const BACKEND_API_URL = 'http://localhost:3001/api/get-page-info';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tools, setTools] = useState(initialTools);

  useEffect(() => {
      const fetchDescriptions = async () => {
          const updatedTools = await Promise.all(
              tools.map(async (tool) => {
                  const primaryUrl = tool.links && tool.links.length > 0 ? tool.links[0].url : null;

                  if ((!tool.description || tool.description.trim() === '') && primaryUrl) {
                      try {
                          const response = await fetch(BACKEND_API_URL, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ url: primaryUrl }),
                          });

                          if (!response.ok) {
                              const errorText = await response.text();
                              throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
                          }
                          const data = await response.json();
                          return { ...tool, description: data.description || 'No description found.' };
                      } catch (error) {
                          console.error(`Error fetching description for ${tool.name} (${primaryUrl}):`, error);
                          return { ...tool, description: `Failed to load description: ${error.message}` };
                      }
                  }
                  return tool;
              })
          );

          if (JSON.stringify(updatedTools) !== JSON.stringify(tools)) {
              setTools(updatedTools);
          }
      };

      fetchDescriptions();
  }, [tools]);

  const filteredTools = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' ||
                            (tool.category && tool.category.includes(selectedCategory));
      return matchesSearch && matchesCategory;
  });

  return (
      <div className="main-container">
          <h1 className="text-4xl font-bold text-amber-300 mb-8 text-center"> <img src={ToolShed} className="logo" alt="Toolshed logo" /> ToolShed</h1>
          <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showFilterOptions={showFilterOptions}
              setShowFilterOptions={setShowFilterOptions}
              categories={categories}
          />
          <ToolGrid filteredTools={filteredTools} />
      </div>
  );
}

export default App
