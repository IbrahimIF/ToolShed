import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaFilter } from "react-icons/fa";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import './search-bar.css'

function SearchBar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showFilterOptions,
    setShowFilterOptions,
    categories,
    isScrolled
}) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowFilterOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowFilterOptions]);

    return (
        <section className={`search-filter-wrapper ${isScrolled ? 'scrolled' : ''}`}>
            <div className={`search-filter-container ${isScrolled ? 'scrolled-inner' : ''}`}>
                <div className="search-input-wrapper">
                    <IoMdSearch className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search tools by name, description, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}>
                            <IoMdClose size={16} />
                        </button>
                    )}
                </div>

                <div className="filter-wrapper" ref={dropdownRef}>
                    <button
                        onClick={() => setShowFilterOptions(!showFilterOptions)}
                        className="filter-button"
                    >
                        <FaFilter size={14} /> Filter
                    </button>
                    <AnimatePresence>
                        {showFilterOptions && (
                            <div className="filter-dropdown-wrapper">
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="filter-dropdown"
                                >
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
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {selectedCategory !== 'All' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`current-filter-info ${isScrolled ? 'scrolled-inner' : ''}`}
                    >
                        <span>Showing: <span className="current-filter-highlight">{selectedCategory}</span></span>
                        <button className="current-filter-clear" onClick={() => setSelectedCategory('All')}>
                            <IoMdClose size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
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
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    isScrolled: PropTypes.bool.isRequired,
};

export default SearchBar;
