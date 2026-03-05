/* ===== HOME PAGE ===== */
/* Clean Architecture: Presentation Layer - Page */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChordRepository } from '@/data/ChordRepository';
import './HomePage.css';

const CATEGORIES = [
    { label: 'Major', icon: 'music_note', quality: 'Major' },
    { label: 'Minor', icon: 'grid_view', quality: 'Minor' },
    { label: '7th Chords', icon: 'equalizer', quality: 'Dominant 7' },
    { label: 'Jazz', icon: 'auto_awesome', genre: 'Jazz' },
];

export function HomePage() {
    const [query, setQuery] = useState('');
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    const popular = useMemo(() => ChordRepository.getPopular(), []);
    const allChords = useMemo(() => ChordRepository.getAll(), []);

    const searchResults = useMemo(() => {
        if (!query.trim()) return null;
        return ChordRepository.searchByName(query);
    }, [query]);

    const isSearching = searchResults !== null || showAll;
    const displayChords = searchResults ?? (showAll ? allChords : popular);

    return (
        <div className="home">
            {/* Search */}
            <div className="home__search">
                <div className="home__search-icon">
                    <span className="material-symbols-rounded">search</span>
                </div>
                <input
                    id="chord-search"
                    className="home__search-input"
                    type="text"
                    placeholder="Search chords (e.g., Cmaj7)..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoComplete="off"
                />
            </div>

            {/* Chord List */}
            <section className="home__section">
                <div className="home__section-header">
                    <h2 className="home__section-title">
                        {isSearching ? `Results (${displayChords.length})` : 'Popular Chords'}
                    </h2>
                    {!isSearching && (
                        <button className="home__section-link" onClick={() => setShowAll(true)}>
                            View All
                        </button>
                    )}
                    {isSearching && (
                        <button className="home__section-link" onClick={() => { setQuery(''); setShowAll(false); }}>
                            Clear
                        </button>
                    )}
                </div>

                <div className="stagger-children">
                    {displayChords.slice(0, isSearching ? 50 : 5).map(chord => (
                        <div
                            key={chord.Id}
                            className="chord-item"
                            onClick={() => navigate(`/chord/${chord.Id}`)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="chord-item__icon">
                                <span className="material-symbols-rounded">grid_view</span>
                            </div>
                            <div className="chord-item__info">
                                <div className="chord-item__name">{chord.Name}</div>
                                <div className="chord-item__desc">
                                    {chord.Variations[0]?.VariationName ?? chord.Quality}
                                    {chord.Difficulty !== 'Beginner' && ` • ${chord.Difficulty}`}
                                </div>
                            </div>
                            <div className="chord-item__chevron">
                                <span className="material-symbols-rounded">chevron_right</span>
                            </div>
                        </div>
                    ))}
                </div>

                {isSearching && displayChords.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: 48, marginBottom: 8, display: 'block' }}>search_off</span>
                        No chords found for "{query}"
                    </div>
                )}
            </section>

            {/* Categories */}
            {!isSearching && (
                <section className="home__section animate-fade-in">
                    <div className="home__section-header">
                        <h2 className="home__section-title">Categories</h2>
                    </div>
                    <div className="categories-grid">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.label}
                                className="category-card"
                                onClick={() => {
                                    if (cat.quality) setQuery(cat.quality);
                                    else if (cat.genre) setQuery(cat.genre);
                                }}
                            >
                                <div className="category-card__icon">
                                    <span className="material-symbols-rounded">{cat.icon}</span>
                                </div>
                                <span className="category-card__label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
