import PropTypes from 'prop-types';
import { Icons } from '../common/Icons';

export function CompetencyBadge({ competency, acquired = false, size = 'md', onClick }) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5'
    };

    const categoryColors = {
        technical: acquired ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-400 border-gray-300',
        design: acquired ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-100 text-gray-400 border-gray-300',
        management: acquired ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-300',
        general: acquired ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-gray-100 text-gray-400 border-gray-300'
    };

    const colorClass = categoryColors[competency.category] || categoryColors.general;

    return (
        <span
            onClick={onClick}
            className={`inline-flex items-center gap-1 rounded-full font-medium border transition-all ${sizeClasses[size]} ${colorClass} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${!acquired ? 'opacity-50' : ''}`}
            title={competency.description}
        >
            {competency.icon && <span>{competency.icon}</span>}
            <span>#{competency.name}</span>
            {!acquired && <span className="text-xs"><Icons.Lock className="w-3 h-3 text-gray-400" /></span>}
        </span>
    );
}

CompetencyBadge.propTypes = {
    competency: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string,
        category: PropTypes.string
    }).isRequired,
    acquired: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    onClick: PropTypes.func
};
