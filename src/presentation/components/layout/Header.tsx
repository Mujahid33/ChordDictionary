/* ===== HEADER COMPONENT ===== */
/* Clean Architecture: Presentation Layer */

import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    actions?: React.ReactNode;
}

export function Header({ title = 'Chord Dictionary', showBack = false, actions }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isDetailPage = location.pathname.startsWith('/chord/');

    // Hide on detail pages — they have their own header
    if (isDetailPage) return null;

    return (
        <header className="header">
            {showBack ? (
                <button className="header__back" onClick={() => navigate(-1)} aria-label="Go back">
                    <span className="material-symbols-rounded">arrow_back</span>
                </button>
            ) : (
                <h1 className="header__title">{title}</h1>
            )}

            <div className="header__actions">
                {actions}
                <button
                    className="header__action"
                    onClick={() => navigate('/settings')}
                    aria-label="Settings"
                >
                    <span className="material-symbols-rounded">settings</span>
                </button>
            </div>
        </header>
    );
}
