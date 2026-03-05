/* ===== FAVORITES SERVICE ===== */
/* Clean Architecture: Infrastructure Layer - localStorage persistence */

const STORAGE_KEY = 'chord_dict_favorites';

export const FavoritesService = {
    getAll(): string[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    isFavorite(chordId: string): boolean {
        return this.getAll().includes(chordId);
    },

    toggle(chordId: string): boolean {
        const favorites = this.getAll();
        const index = favorites.indexOf(chordId);
        if (index >= 0) {
            favorites.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            return false;
        } else {
            favorites.push(chordId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            return true;
        }
    },

    add(chordId: string): void {
        const favorites = this.getAll();
        if (!favorites.includes(chordId)) {
            favorites.push(chordId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }
    },

    remove(chordId: string): void {
        const favorites = this.getAll().filter(id => id !== chordId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
};
