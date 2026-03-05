/* ===== PLACEHOLDER PAGES ===== */
/* Clean Architecture: Presentation Layer */

import './PlaceholderPage.css';

export function TunerPage() {
    return (
        <div className="placeholder-page animate-fade-in">
            <div className="placeholder-page__icon">
                <span className="material-symbols-rounded">tune</span>
            </div>
            <h2 className="placeholder-page__title">Guitar Tuner</h2>
            <p className="placeholder-page__desc">
                The tuner will use your microphone to help you tune your guitar in real-time.
            </p>
        </div>
    );
}

export function LibraryPage() {
    return (
        <div className="placeholder-page animate-fade-in">
            <div className="placeholder-page__icon">
                <span className="material-symbols-rounded">library_music</span>
            </div>
            <h2 className="placeholder-page__title">Chord Library</h2>
            <p className="placeholder-page__desc">
                Browse chords by scale, key, or progression. Coming soon.
            </p>
        </div>
    );
}

export function SettingsPage() {
    return (
        <div className="placeholder-page animate-fade-in">
            <div className="placeholder-page__icon">
                <span className="material-symbols-rounded">settings</span>
            </div>
            <h2 className="placeholder-page__title">Settings</h2>
            <p className="placeholder-page__desc">
                Customize your experience — instrument tuning, theme, and more.
            </p>
        </div>
    );
}
