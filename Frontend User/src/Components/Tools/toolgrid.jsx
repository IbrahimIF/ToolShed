import PropTypes from 'prop-types';
import './toolgrid.css'

function ToolGrid({ filteredTools }) {

    return (
        <section className="tool-grid">
        {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
            <div className="ToolCard" key={tool.id}>
                <a
                    href={tool.links && tool.links.length > 0 ? tool.links[0].url : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card"
                >
                    <div className="card-image-wrapper">
                        <img
                            src={tool.imageUrl}
                            alt={tool.name}
                            className="card-image"
                            onError={(e) => { e.target.onerror = null; e.target.src =  `https://placehold.co/100x100/4A3F35/F0EAD6?text=${tool.name.substring(0, 1)}`; }}
                        />
                    </div>
                    <div className="card-content">
                        <h3 className="card-title">{tool.name}</h3>
                        <h5 className="card-type">
                        {tool.types && tool.types.length > 0 ? (
                            <span className="card-type-title"> {tool.types[0]} </span>
                        ) : (
                            <span className="card-type-title"> Empty </span>
                        )}
                        </h5>
                        <p className="card-description">
                            {tool.description || 'No description available.'}
                        </p>
                        {tool.category && tool.category.length > 0 && (
                            <div className="card-category-list">
                                {tool.category.map((cat) => (
                                    <span key={cat} className="card-category-item">
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
            types: PropTypes.arrayOf(PropTypes.string),
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
