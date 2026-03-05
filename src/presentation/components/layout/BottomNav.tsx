/* ===== BOTTOM NAVIGATION ===== */
/* Clean Architecture: Presentation Layer */

import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

interface NavTab {
    path: string;
    icon: string;
    label: string;
}

const TABS: NavTab[] = [
    { path: '/', icon: 'search', label: 'Search' },
    { path: '/favorites', icon: 'favorite', label: 'Favorites' },
];

export function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/chord/');
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bottom-nav" role="tablist" aria-label="Main navigation">
            {TABS.map(tab => (
                <button
                    key={tab.path}
                    className={`bottom-nav__item ${isActive(tab.path) ? 'bottom-nav__item--active' : ''}`}
                    onClick={() => navigate(tab.path)}
                    role="tab"
                    aria-selected={isActive(tab.path)}
                    aria-label={tab.label}
                >
                    <span className="material-symbols-rounded">{tab.icon}</span>
                    <span className="bottom-nav__label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
