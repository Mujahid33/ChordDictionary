/* ===== DOMAIN TYPES ===== */
/* Clean Architecture: Domain Layer - Core business entities */

export interface ChordPosition {
    String: number;
    Fret: number;
    Finger: string;
}

export interface ChordBarre {
    Fret: number;
    StartString: number;
    EndString: number;
    Finger: string;
}

export interface ChordVariation {
    VariationName: string;
    BaseFret: number;
    MutedStrings: number[];
    OpenStrings: number[];
    Positions: ChordPosition[];
    Barres: ChordBarre[];
}

export interface Chord {
    Id: string;
    Root: string;
    Quality: string;
    Name: string;
    Difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    Genres: string[];
    Variations: ChordVariation[];
}

export type ChordQuality =
    | 'Major' | 'Minor'
    | 'Dominant 7' | 'Major 7' | 'Minor 7'
    | 'Sus2' | 'Sus4'
    | 'Diminished' | 'Augmented'
    | 'Power' | 'Add9'
    | '6th' | 'Minor 6'
    | 'Dominant 9' | 'Minor 9'
    | '7#9' | '7sus4';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TabRoute = '/' | '/favorites' | '/tuner' | '/library' | '/settings';
