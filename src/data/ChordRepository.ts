/* ===== CHORD REPOSITORY ===== */
/* Clean Architecture: Data Layer - Data access abstraction */

import type { Chord, ChordQuality, DifficultyLevel } from '@/domain/types';
import chordsData from '@/data/chords.json';

const allChords: Chord[] = chordsData as Chord[];

export const ChordRepository = {
    getAll(): Chord[] {
        return allChords;
    },

    getById(id: string): Chord | undefined {
        return allChords.find(c => c.Id === id);
    },

    searchByName(query: string): Chord[] {
        const q = query.toLowerCase().trim();
        if (!q) return allChords;
        return allChords.filter(c =>
            c.Name.toLowerCase().includes(q) ||
            c.Root.toLowerCase().includes(q) ||
            c.Quality.toLowerCase().includes(q) ||
            c.Difficulty.toLowerCase().includes(q) ||
            c.Genres.some(g => g.toLowerCase().includes(q))
        );
    },

    getByRoot(root: string): Chord[] {
        return allChords.filter(c => c.Root === root);
    },

    getByQuality(quality: ChordQuality): Chord[] {
        return allChords.filter(c => c.Quality === quality);
    },

    getByDifficulty(difficulty: DifficultyLevel): Chord[] {
        return allChords.filter(c => c.Difficulty === difficulty);
    },

    getByGenre(genre: string): Chord[] {
        return allChords.filter(c => c.Genres.includes(genre));
    },

    getPopular(): Chord[] {
        const popularIds = ['a_min', 'g_maj', 'e_7s9', 'd_maj', 'fs_min7', 'c_maj', 'e_min', 'a_maj'];
        return popularIds
            .map(id => allChords.find(c => c.Id === id))
            .filter((c): c is Chord => c !== undefined);
    },

    getRoots(): string[] {
        return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    },

    getQualities(): string[] {
        return [...new Set(allChords.map(c => c.Quality))].sort();
    },

    getGenres(): string[] {
        return [...new Set(allChords.flatMap(c => c.Genres))].sort();
    }
};
