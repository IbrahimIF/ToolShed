import PropTypes from 'prop-types';
import './search-bar.css'
function SearchBar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showFilterOptions,
    setShowFilterOptions,
    categories
}) {
    return (
        <section className="search-container">
            <div className="search-filter-box">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search tools by name, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-icon" size={20} />
                </div>

                <div className="filter-wrapper">
                    <button
                        onClick={() => setShowFilterOptions(!showFilterOptions)}
                        className="filter-button"
                    >
                        <div className="filter-icon" size={20} /> Filter by Category
                    </button>
                    {showFilterOptions && (
                        <div className="filter-dropdown">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowFilterOptions(false);
                                    }}
                                    className={`filter-dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {selectedCategory !== 'All' && (
                <p className="current-filter-info">
                    Showing tools in: <span className="current-filter-highlight">{selectedCategory}</span>
                </p>
            )}
        </section>
    );
}


SearchBar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    setSelectedCategory: PropTypes.func.isRequired,
    showFilterOptions: PropTypes.bool.isRequired,
    setShowFilterOptions: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SearchBar;
