/* ===== FAVORITES PAGE ===== */
/* Clean Architecture: Presentation Layer */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChordRepository } from '@/data/ChordRepository';
import { FavoritesService } from '@/infrastructure/FavoritesService';
import type { Chord } from '@/domain/types';
import './FavoritesPage.css';
import './PlaceholderPage.css';

export function FavoritesPage() {
    const navigate = useNavigate();
    const [tick, setTick] = useState(0);

    const favoriteChords: Chord[] = (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        tick; // dependency to re-read on changes
        const ids = FavoritesService.getAll();
        return ids
            .map(id => ChordRepository.getById(id))
            .filter((c): c is Chord => c !== undefined);
    })();

    const handleRemove = useCallback((e: React.MouseEvent, chordId: string) => {
        e.stopPropagation();
        FavoritesService.remove(chordId);
        setTick(t => t + 1);
    }, []);

    const handleClearAll = useCallback(() => {
        favoriteChords.forEach(c => FavoritesService.remove(c.Id));
        setTick(t => t + 1);
    }, [favoriteChords]);

    /* ── Empty State ── */
    if (favoriteChords.length === 0) {
        return (
            <div className="placeholder-page animate-fade-in">
                <div className="placeholder-page__icon">
                    <span className="material-symbols-rounded">favorite</span>
                </div>
                <h2 className="placeholder-page__title">No Favorites Yet</h2>
                <p className="placeholder-page__desc">
                    Tap the heart icon on any chord to save it here for quick access.
                </p>
                <button className="fav__browse-btn" onClick={() => navigate('/')}>
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>search</span>
                    Browse Chords
                </button>
            </div>
        );
    }

    /* ── Favorites List ── */
    return (
        <div className="fav animate-fade-in">
            {/* Header */}
            <div className="fav__header">
                <div>
                    <h2 className="fav__title">Favorites</h2>
                    <span className="fav__count">{favoriteChords.length} chord{favoriteChords.length > 1 ? 's' : ''} saved</span>
                </div>
                <button className="fav__clear-btn" onClick={handleClearAll}>
                    Clear All
                </button>
            </div>

            {/* Chord Cards */}
            <div className="fav__list stagger-children">
                {favoriteChords.map(chord => (
                    <div
                        key={chord.Id}
                        className="fav__card"
                        onClick={() => navigate(`/chord/${chord.Id}`)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="fav__card-left">
                            <div className="fav__card-icon">
                                <span className="material-symbols-rounded">music_note</span>
                            </div>
                            <div className="fav__card-info">
                                <div className="fav__card-name">{chord.Name}</div>
                                <div className="fav__card-meta">
                                    <span>{chord.Quality}</span>
                                    <span className="fav__card-dot">•</span>
                                    <span>{chord.Variations.length} variation{chord.Variations.length > 1 ? 's' : ''}</span>
                                </div>
                                <div className="fav__card-tags">
                                    <span className={`badge badge--${chord.Difficulty.toLowerCase()}`}>
                                        {chord.Difficulty}
                                    </span>
                                    {chord.Genres.slice(0, 2).map(g => (
                                        <span key={g} className="badge">{g}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            className="fav__card-remove"
                            onClick={(e) => handleRemove(e, chord.Id)}
                            aria-label={`Remove ${chord.Name} from favorites`}
                        >
                            <span className="material-symbols-rounded filled">heart_minus</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
