/* ===== CHORD DETAIL PAGE ===== */
/* Clean Architecture: Presentation Layer - Page */

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import { ChordRepository } from '@/data/ChordRepository';
import { FavoritesService } from '@/infrastructure/FavoritesService';
import { FretboardDiagram } from '@/presentation/components/fretboard/FretboardDiagram';
import './ChordDetailPage.css';

export function ChordDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const chord = useMemo(() => id ? ChordRepository.getById(id) : undefined, [id]);
    const [isFav, setIsFav] = useState(() => id ? FavoritesService.isFavorite(id) : false);
    const [toast, setToast] = useState<string | null>(null);
    const [animKey, setAnimKey] = useState(0);

    const toggleFavorite = useCallback(() => {
        if (!id) return;
        const result = FavoritesService.toggle(id);
        setIsFav(result);
        setAnimKey(k => k + 1);
        setToast(result ? 'Added to Favorites ❤️' : 'Removed from Favorites');
        setTimeout(() => setToast(null), 2000);
    }, [id]);

    if (!chord) {
        return (
            <div className="detail__empty">
                <span className="material-symbols-rounded" style={{ fontSize: 48 }}>music_off</span>
                <p>Chord not found</p>
                <button onClick={() => navigate('/')} className="detail__back-btn">Go Home</button>
            </div>
        );
    }

    return (
        <>
            <div className="detail">
                {/* Header area */}
                <div className="detail__hero">
                    <div className="detail__hero-info">
                        <button className="detail__nav-back" onClick={() => navigate(-1)}>
                            <span className="material-symbols-rounded">arrow_back</span>
                        </button>
                        <div className="detail__hero-actions">
                            <button className="detail__action" aria-label="Share">
                                <span className="material-symbols-rounded">share</span>
                            </button>
                            <button
                                className={`detail__action ${isFav ? 'detail__action--active' : ''}`}
                                onClick={toggleFavorite}
                                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <span key={animKey} className={`material-symbols-rounded ${isFav ? 'filled' : ''}`}>favorite</span>
                            </button>
                        </div>
                    </div>

                    <div className="detail__title-row">
                        <div>
                            <h1 className="detail__title">{chord.Name}</h1>
                            <p className="detail__subtitle">{chord.Quality} • Root {chord.Root}</p>
                        </div>
                        <button className="detail__play-btn" aria-label="Play chord">
                            <span className="material-symbols-rounded">play_arrow</span>
                        </button>
                    </div>

                    <div className="detail__meta">
                        <span className={`badge badge--${chord.Difficulty.toLowerCase()}`}>{chord.Difficulty}</span>
                        {chord.Genres.slice(0, 3).map(g => (
                            <span key={g} className="badge">{g}</span>
                        ))}
                    </div>
                </div>

                {/* Audio Preview */}
                <div className="detail__audio">
                    <div className="detail__audio-icon">
                        <span className="material-symbols-rounded">volume_up</span>
                    </div>
                    <div className="detail__audio-info">
                        <span className="detail__audio-title">Audio Preview</span>
                        <span className="detail__audio-desc">Clean Tone • Strummed</span>
                    </div>
                    <span className="detail__audio-duration">0:04</span>
                </div>

                {/* Variations */}
                <section className="detail__section">
                    <div className="detail__section-header">
                        <h2 className="detail__section-title">Variations</h2>
                        <span className="detail__section-link"> </span>
                    </div>

                    <div className="stagger-children">
                        {chord.Variations.map((variation, idx) => (
                            <div key={idx} className="detail__variation">
                                <div className="detail__variation-header">
                                    <span className="detail__variation-name">{variation.VariationName}</span>
                                    <span className="badge">V{idx + 1}</span>
                                </div>
                                <div className="detail__fretboard-container">
                                    <FretboardDiagram variation={variation} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Toast notification */}
            {toast && (
                <div className="detail__toast">{toast}</div>
            )}
        </>
    );
}
