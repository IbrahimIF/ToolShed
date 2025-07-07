import PropTypes from 'prop-types';
import './toolgrid.css'
import { FaMusic } from "react-icons/fa";

function ToolGrid({ filteredTools }) {
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Productivity': return <div className="tool-icon" />;
            case 'Creativity': return <div  className="tool-icon" />;
            case 'Learning': return <div  className="tool-icon" />;
            case 'Utilities': return <div  className="tool-icon" />;
            case 'Fun': return <div  className="tool-icon" />;
            case 'Development': return <div  className="tool-icon" />;
            case 'Writing': return <div className="tool-card-category-icon" />;
            case 'Design': return <div className="tool-card-category-icon" />;
            case 'AI': return <div className="tool-card-category-icon" />;
            case 'Data Analysis': return <div className="tool-card-category-icon" />;
            case 'Music': return <FaMusic className="tool-card-category-icon" />;
            case 'Relaxation': return <div className="tool-card-category-icon" />;
            default: return <div className="tool-card-category-icon" />;
        }
    };

    return (
        <section className="tool-grid">
        {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
            <div className="ToolCard" key={tool.id}>
                <a
                    href={tool.links && tool.links.length > 0 ? tool.links[0].url : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-card"
                >
                    <div className="tool-card-image-wrapper">
                        <img
                            src={tool.imageUrl}
                            alt={tool.name}
                            className="tool-card-image"
                            onError={(e) => { e.target.onerror = null; e.target.src =  `https://placehold.co/100x100/4A3F35/F0EAD6?text=${tool.name.substring(0, 1)}`; }}
                        />
                    </div>
                    <div className="tool-card-content">
                        <h3 className="tool-card-title">{tool.name}</h3>
                        <p className="tool-card-description">
                            {tool.description || 'No description available.'}
                        </p>
                        {tool.category && tool.category.length > 0 && (
                            <div className="tool-card-category-list">
                                {tool.category.map((cat, index) => (
                                    <span key={index} className="tool-card-category-item">
                                        {getCategoryIcon(cat)}
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </a>
            </div>
            ))
        ) : (
            <p className="no-tools-found">No tools found matching your criteria.</p>
        )}
    </section>
    );
}


ToolGrid.propTypes = {
    filteredTools: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            category: PropTypes.arrayOf(PropTypes.string),
            links: PropTypes.arrayOf(
                PropTypes.shape({
                    url: PropTypes.string.isRequired,
                    label: PropTypes.string,
                })
            ).isRequired,
            imageUrl: PropTypes.string,
            developer: PropTypes.string,
        })
    ).isRequired,
};

export default ToolGrid;
