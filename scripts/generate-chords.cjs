/**
 * Chord Database Generator
 * Generates a comprehensive guitar chord database JSON file.
 * Run: node scripts/generate-chords.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const E_SHAPE_FRETS = { 'F': 1, 'F#': 2, 'G': 3, 'Ab': 4, 'A': 5, 'Bb': 6, 'B': 7, 'C': 8, 'C#': 9, 'D': 10, 'Eb': 11, 'E': 0 };
const A_SHAPE_FRETS = { 'Bb': 1, 'B': 2, 'C': 3, 'C#': 4, 'D': 5, 'Eb': 6, 'E': 7, 'F': 8, 'F#': 9, 'G': 10, 'Ab': 11, 'A': 0 };

function id(root, quality) {
    return root.toLowerCase().replace('#', 's') + '_' + quality.toLowerCase().replace(/\s+/g, '').replace(/[#]/g, 's');
}

const OPEN_MAJORS = {
    'C': { muted: [6], open: [1, 3], pos: [{ s: 5, f: 3, fi: '3' }, { s: 4, f: 2, fi: '2' }, { s: 2, f: 1, fi: '1' }] },
    'D': { muted: [5, 6], open: [4], pos: [{ s: 3, f: 2, fi: '1' }, { s: 2, f: 3, fi: '3' }, { s: 1, f: 2, fi: '2' }] },
    'E': { muted: [], open: [1, 2, 6], pos: [{ s: 5, f: 2, fi: '2' }, { s: 4, f: 2, fi: '3' }, { s: 3, f: 1, fi: '1' }] },
    'G': { muted: [], open: [2, 3, 4], pos: [{ s: 6, f: 3, fi: '2' }, { s: 5, f: 2, fi: '1' }, { s: 1, f: 3, fi: '3' }] },
    'A': { muted: [6], open: [1, 5], pos: [{ s: 4, f: 2, fi: '1' }, { s: 3, f: 2, fi: '2' }, { s: 2, f: 2, fi: '3' }] },
};
const OPEN_MINORS = {
    'D': { muted: [5, 6], open: [4], pos: [{ s: 3, f: 2, fi: '2' }, { s: 2, f: 3, fi: '3' }, { s: 1, f: 1, fi: '1' }] },
    'E': { muted: [], open: [1, 2, 3, 6], pos: [{ s: 5, f: 2, fi: '2' }, { s: 4, f: 2, fi: '3' }] },
    'A': { muted: [6], open: [1, 5], pos: [{ s: 4, f: 2, fi: '2' }, { s: 3, f: 2, fi: '3' }, { s: 2, f: 1, fi: '1' }] },
};
const OPEN_DOM7 = {
    'A': { muted: [6], open: [1, 3, 5], pos: [{ s: 4, f: 2, fi: '2' }, { s: 2, f: 2, fi: '3' }] },
    'C': { muted: [6], open: [1], pos: [{ s: 5, f: 3, fi: '3' }, { s: 4, f: 2, fi: '2' }, { s: 3, f: 3, fi: '4' }, { s: 2, f: 1, fi: '1' }] },
    'D': { muted: [5, 6], open: [4], pos: [{ s: 3, f: 2, fi: '2' }, { s: 2, f: 1, fi: '1' }, { s: 1, f: 2, fi: '3' }] },
    'E': { muted: [], open: [1, 2, 4, 6], pos: [{ s: 5, f: 2, fi: '2' }, { s: 3, f: 1, fi: '1' }] },
    'G': { muted: [], open: [2, 4, 6], pos: [{ s: 5, f: 2, fi: '2' }, { s: 1, f: 1, fi: '1' }] },
};
const OPEN_MAJ7 = {
    'C': { muted: [6], open: [1, 2, 3], pos: [{ s: 5, f: 3, fi: '3' }, { s: 4, f: 2, fi: '2' }] },
    'D': { muted: [5, 6], open: [4], pos: [{ s: 3, f: 2, fi: '1' }, { s: 2, f: 2, fi: '2' }, { s: 1, f: 2, fi: '3' }] },
    'E': { muted: [], open: [1, 2, 6], pos: [{ s: 5, f: 2, fi: '3' }, { s: 4, f: 1, fi: '1' }, { s: 3, f: 1, fi: '2' }] },
    'F': { muted: [5, 6], open: [1], pos: [{ s: 4, f: 3, fi: '3' }, { s: 3, f: 2, fi: '2' }, { s: 2, f: 1, fi: '1' }] },
    'G': { muted: [], open: [2, 3, 4], pos: [{ s: 6, f: 3, fi: '3' }, { s: 5, f: 2, fi: '2' }, { s: 1, f: 2, fi: '1' }] },
    'A': { muted: [6], open: [1, 5], pos: [{ s: 4, f: 2, fi: '2' }, { s: 3, f: 1, fi: '1' }, { s: 2, f: 2, fi: '3' }] },
};
const OPEN_MIN7 = {
    'A': { muted: [6], open: [1, 3, 5], pos: [{ s: 4, f: 2, fi: '2' }, { s: 2, f: 1, fi: '1' }] },
    'D': { muted: [5, 6], open: [4], pos: [{ s: 3, f: 2, fi: '2' }, { s: 2, f: 1, fi: '1' }, { s: 1, f: 1, fi: '3' }] },
    'E': { muted: [], open: [1, 3, 6], pos: [{ s: 5, f: 2, fi: '1' }, { s: 4, f: 2, fi: '2' }, { s: 2, f: 3, fi: '3' }] },
};
const OPEN_SUS2 = {
    'A': { muted: [6], open: [1, 2, 5], pos: [{ s: 4, f: 2, fi: '1' }, { s: 3, f: 2, fi: '2' }] },
    'D': { muted: [5, 6], open: [4, 1], pos: [{ s: 3, f: 2, fi: '1' }, { s: 2, f: 3, fi: '3' }] },
    'E': { muted: [], open: [1, 2, 4, 6], pos: [{ s: 5, f: 2, fi: '1' }, { s: 3, f: 2, fi: '2' }] },
};
const OPEN_SUS4 = {
    'A': { muted: [6], open: [1, 5], pos: [{ s: 4, f: 2, fi: '1' }, { s: 3, f: 2, fi: '2' }, { s: 2, f: 3, fi: '3' }] },
    'D': { muted: [5, 6], open: [4, 1], pos: [{ s: 3, f: 2, fi: '1' }, { s: 2, f: 3, fi: '3' }] },
    'E': { muted: [], open: [1, 2, 6], pos: [{ s: 5, f: 2, fi: '2' }, { s: 4, f: 2, fi: '3' }, { s: 3, f: 2, fi: '4' }] },
};

function buildVariation(name, baseFret, muted, open, positions, barres) {
    return {
        VariationName: name, BaseFret: baseFret, MutedStrings: muted, OpenStrings: open,
        Positions: positions.map(p => ({ String: p.s, Fret: p.f, Finger: p.fi })),
        Barres: (barres || []).map(b => ({ Fret: b.fret, StartString: b.start, EndString: b.end, Finger: b.fi }))
    };
}
function openVariation(d) { return buildVariation('Open Position', d.baseFret || 1, d.muted, d.open, d.pos, []); }
function barreVariation(d) { return d ? buildVariation(d.name, d.baseFret, d.muted, d.open, d.pos, d.barres) : null; }
function majorDiff(r) { return ['C', 'D', 'E', 'G', 'A'].includes(r) ? 'Beginner' : 'Intermediate'; }
function minorDiff(r) { return ['A', 'D', 'E'].includes(r) ? 'Beginner' : 'Intermediate'; }
const GENRES = { 'C': ['Pop', 'Rock', 'Country', 'Folk'], 'C#': ['Pop', 'R&B', 'Jazz'], 'D': ['Pop', 'Rock', 'Country', 'Folk'], 'Eb': ['Jazz', 'R&B', 'Blues'], 'E': ['Rock', 'Blues', 'Pop', 'Metal'], 'F': ['Pop', 'Rock', 'R&B'], 'F#': ['Metal', 'Rock', 'Pop'], 'G': ['Pop', 'Rock', 'Country', 'Bluegrass'], 'Ab': ['Pop', 'R&B', 'Jazz'], 'A': ['Pop', 'Rock', 'Country', 'Blues'], 'Bb': ['Jazz', 'Blues', 'R&B', 'Pop'], 'B': ['Rock', 'Pop', 'Country'] };

function eMaj(r) { const f = E_SHAPE_FRETS[r]; return (f && f > 0) ? { name: 'E-Shape Barre', baseFret: f, muted: [], open: [], pos: [{ s: 5, f: f + 2, fi: '3' }, { s: 4, f: f + 2, fi: '4' }, { s: 3, f: f + 1, fi: '2' }], barres: [{ fret: f, start: 1, end: 6, fi: '1' }] } : null; }
function aMaj(r) { const f = A_SHAPE_FRETS[r]; return (f && f > 0 && f <= 9) ? { name: 'A-Shape Barre', baseFret: f, muted: [6], open: [], pos: [{ s: 4, f: f + 2, fi: '2' }, { s: 3, f: f + 2, fi: '3' }, { s: 2, f: f + 2, fi: '4' }], barres: [{ fret: f, start: 1, end: 5, fi: '1' }] } : null; }
function eMin(r) { const f = E_SHAPE_FRETS[r]; return (f && f > 0) ? { name: 'E-Shape Minor Barre', baseFret: f, muted: [], open: [], pos: [{ s: 5, f: f + 2, fi: '3' }, { s: 4, f: f + 2, fi: '4' }], barres: [{ fret: f, start: 1, end: 6, fi: '1' }] } : null; }
function aMin(r) { const f = A_SHAPE_FRETS[r]; return (f && f > 0 && f <= 9) ? { name: 'A-Shape Minor Barre', baseFret: f, muted: [6], open: [], pos: [{ s: 4, f: f + 2, fi: '3' }, { s: 3, f: f + 2, fi: '4' }, { s: 2, f: f + 1, fi: '2' }], barres: [{ fret: f, start: 1, end: 5, fi: '1' }] } : null; }
function eDom7(r) { const f = E_SHAPE_FRETS[r]; return (f && f > 0) ? { name: 'E-Shape 7th Barre', baseFret: f, muted: [], open: [], pos: [{ s: 5, f: f + 2, fi: '3' }, { s: 3, f: f + 1, fi: '2' }], barres: [{ fret: f, start: 1, end: 6, fi: '1' }] } : null; }
function aDom7(r) { const f = A_SHAPE_FRETS[r]; return (f && f > 0 && f <= 9) ? { name: 'A-Shape 7th Barre', baseFret: f, muted: [6], open: [], pos: [{ s: 4, f: f + 2, fi: '3' }, { s: 2, f: f + 2, fi: '4' }], barres: [{ fret: f, start: 1, end: 5, fi: '1' }] } : null; }
function eMin7(r) { const f = E_SHAPE_FRETS[r]; return (f && f > 0) ? { name: 'E-Shape Minor 7 Barre', baseFret: f, muted: [], open: [], pos: [{ s: 5, f: f + 2, fi: '3' }], barres: [{ fret: f, start: 1, end: 6, fi: '1' }] } : null; }
function aMin7(r) { const f = A_SHAPE_FRETS[r]; return (f && f > 0 && f <= 9) ? { name: 'A-Shape Minor 7 Barre', baseFret: f, muted: [6], open: [], pos: [{ s: 4, f: f + 2, fi: '3' }, { s: 2, f: f + 1, fi: '2' }], barres: [{ fret: f, start: 1, end: 5, fi: '1' }] } : null; }

const chords = [];

// Majors
for (const r of ROOTS) { const v = []; if (OPEN_MAJORS[r]) v.push(openVariation(OPEN_MAJORS[r])); const e = eMaj(r); if (e) v.push(barreVariation(e)); const a = aMaj(r); if (a) v.push(barreVariation(a)); if (v.length) chords.push({ Id: id(r, 'maj'), Root: r, Quality: 'Major', Name: `${r} Major`, Difficulty: majorDiff(r), Genres: GENRES[r] || ['Pop', 'Rock'], Variations: v }); }
// Minors
for (const r of ROOTS) { const v = []; if (OPEN_MINORS[r]) v.push(openVariation(OPEN_MINORS[r])); const e = eMin(r); if (e) v.push(barreVariation(e)); const a = aMin(r); if (a) v.push(barreVariation(a)); if (v.length) chords.push({ Id: id(r, 'min'), Root: r, Quality: 'Minor', Name: `${r} Minor`, Difficulty: minorDiff(r), Genres: GENRES[r] || ['Pop', 'Rock'], Variations: v }); }
// Dom7
for (const r of ROOTS) { const v = []; if (OPEN_DOM7[r]) v.push(openVariation(OPEN_DOM7[r])); const e = eDom7(r); if (e) v.push(barreVariation(e)); const a = aDom7(r); if (a) v.push(barreVariation(a)); if (v.length) chords.push({ Id: id(r, '7'), Root: r, Quality: 'Dominant 7', Name: `${r}7`, Difficulty: ['A', 'D', 'E', 'G', 'C'].includes(r) ? 'Beginner' : 'Intermediate', Genres: [...(GENRES[r] || []), 'Blues'].filter((x, i, a) => a.indexOf(x) === i), Variations: v }); }
// Maj7
for (const r of ROOTS) { const v = []; if (OPEN_MAJ7[r]) v.push(openVariation(OPEN_MAJ7[r])); const f = A_SHAPE_FRETS[r]; if (f && f > 0 && f <= 9) v.push(buildVariation('A-Shape Maj7 Barre', f, [6], [], [{ s: 4, f: f + 2, fi: '2' }, { s: 3, f: f + 1, fi: '3' }, { s: 2, f: f + 2, fi: '4' }], [{ fret: f, start: 1, end: 5, fi: '1' }])); if (v.length) chords.push({ Id: id(r, 'maj7'), Root: r, Quality: 'Major 7', Name: `${r}maj7`, Difficulty: 'Intermediate', Genres: ['Jazz', 'Pop', 'R&B', 'Bossa Nova'], Variations: v }); }
// Min7
for (const r of ROOTS) { const v = []; if (OPEN_MIN7[r]) v.push(openVariation(OPEN_MIN7[r])); const e = eMin7(r); if (e) v.push(barreVariation(e)); const a = aMin7(r); if (a) v.push(barreVariation(a)); if (v.length) chords.push({ Id: id(r, 'min7'), Root: r, Quality: 'Minor 7', Name: `${r}m7`, Difficulty: ['A', 'D', 'E'].includes(r) ? 'Beginner' : 'Intermediate', Genres: ['Jazz', 'Blues', 'Pop', 'R&B'], Variations: v }); }
// Sus2
for (const r of ROOTS) { const v = []; if (OPEN_SUS2[r]) v.push(openVariation(OPEN_SUS2[r])); const ef = E_SHAPE_FRETS[r]; if (ef && ef > 0) v.push(buildVariation('E-Shape Sus2 Barre', ef, [], [], [{ s: 5, f: ef + 2, fi: '3' }, { s: 3, f: ef + 2, fi: '4' }], [{ fret: ef, start: 1, end: 6, fi: '1' }])); if (v.length) chords.push({ Id: id(r, 'sus2'), Root: r, Quality: 'Sus2', Name: `${r}sus2`, Difficulty: ['A', 'D', 'E'].includes(r) ? 'Beginner' : 'Intermediate', Genres: ['Pop', 'Rock', 'Alternative', 'Ambient'], Variations: v }); }
// Sus4
for (const r of ROOTS) { const v = []; if (OPEN_SUS4[r]) v.push(openVariation(OPEN_SUS4[r])); const ef = E_SHAPE_FRETS[r]; if (ef && ef > 0) v.push(buildVariation('E-Shape Sus4 Barre', ef, [], [], [{ s: 5, f: ef + 2, fi: '3' }, { s: 4, f: ef + 2, fi: '4' }, { s: 3, f: ef + 2, fi: '2' }], [{ fret: ef, start: 1, end: 6, fi: '1' }])); if (v.length) chords.push({ Id: id(r, 'sus4'), Root: r, Quality: 'Sus4', Name: `${r}sus4`, Difficulty: ['A', 'D', 'E'].includes(r) ? 'Beginner' : 'Intermediate', Genres: ['Pop', 'Rock', 'Alternative'], Variations: v }); }
// Dim
for (const r of ROOTS) { const df = { 'D': 0, 'Eb': 1, 'E': 2, 'F': 3, 'F#': 4, 'G': 5, 'Ab': 6, 'A': 7, 'Bb': 8, 'B': 9, 'C': 10, 'C#': 11 }; const f = df[r]; const v = []; if (f !== undefined && f > 0 && f <= 9) v.push(buildVariation('Movable Dim Shape', f, [5, 6], [], [{ s: 4, f: f, fi: '1' }, { s: 3, f: f + 1, fi: '2' }, { s: 2, f: f, fi: '1' }, { s: 1, f: f + 1, fi: '3' }], [])); if (v.length) chords.push({ Id: id(r, 'dim'), Root: r, Quality: 'Diminished', Name: `${r}dim`, Difficulty: 'Intermediate', Genres: ['Jazz', 'Classical', 'Blues'], Variations: v }); }
// Power
for (const r of ROOTS) { const ef = E_SHAPE_FRETS[r]; const v = []; if (ef === 0) v.push(buildVariation('6th String Root', 1, [1, 2, 3], [6], [{ s: 5, f: 2, fi: '2' }, { s: 4, f: 2, fi: '3' }], [])); else if (ef > 0 && ef <= 12) v.push(buildVariation('6th String Root', ef, [1, 2, 3], [], [{ s: 6, f: ef, fi: '1' }, { s: 5, f: ef + 2, fi: '3' }, { s: 4, f: ef + 2, fi: '4' }], [])); if (v.length) chords.push({ Id: id(r, '5'), Root: r, Quality: 'Power', Name: `${r}5`, Difficulty: 'Beginner', Genres: ['Rock', 'Metal', 'Punk', 'Grunge'], Variations: v }); }
// Specials
chords.push({ Id: 'e_7s9', Root: 'E', Quality: '7#9', Name: 'E7#9', Difficulty: 'Advanced', Genres: ['Blues', 'Rock', 'Funk', 'Psychedelic'], Variations: [buildVariation('Standard Position', 1, [6], [], [{ s: 5, f: 2, fi: '2' }, { s: 3, f: 1, fi: '1' }, { s: 1, f: 3, fi: '4' }], [])] });
chords.push({ Id: 'e_9', Root: 'E', Quality: 'Dominant 9', Name: 'E9', Difficulty: 'Advanced', Genres: ['Funk', 'Blues', 'Soul'], Variations: [buildVariation('Open Position', 1, [5, 6], [], [{ s: 4, f: 1, fi: '1' }, { s: 1, f: 2, fi: '2' }], [])] });

// Add9
const ADD9 = { 'C': { muted: [6], open: [1], pos: [{ s: 5, f: 3, fi: '2' }, { s: 4, f: 2, fi: '1' }, { s: 2, f: 3, fi: '3' }] }, 'D': { muted: [5, 6], open: [1, 4], pos: [{ s: 3, f: 2, fi: '1' }, { s: 2, f: 3, fi: '3' }] }, 'G': { muted: [], open: [2, 4], pos: [{ s: 6, f: 3, fi: '2' }, { s: 1, f: 3, fi: '3' }] }, 'A': { muted: [6], open: [1, 2, 5], pos: [{ s: 4, f: 2, fi: '1' }, { s: 3, f: 2, fi: '2' }] } };
for (const r of Object.keys(ADD9)) { chords.push({ Id: id(r, 'add9'), Root: r, Quality: 'Add9', Name: `${r}add9`, Difficulty: 'Beginner', Genres: ['Pop', 'Rock', 'Alternative', 'Worship'], Variations: [openVariation(ADD9[r])] }); }

// 6th
const SIXTH = { 'C': { muted: [6], open: [1], pos: [{ s: 5, f: 3, fi: '3' }, { s: 4, f: 2, fi: '2' }, { s: 3, f: 2, fi: '1' }] }, 'A': { muted: [6], open: [1, 5], pos: [{ s: 4, f: 2, fi: '1' }, { s: 3, f: 2, fi: '2' }, { s: 2, f: 2, fi: '3' }] }, 'E': { muted: [], open: [6], pos: [{ s: 5, f: 2, fi: '2' }, { s: 4, f: 2, fi: '3' }, { s: 3, f: 1, fi: '1' }, { s: 2, f: 2, fi: '4' }] } };
for (const r of Object.keys(SIXTH)) { chords.push({ Id: id(r, '6'), Root: r, Quality: '6th', Name: `${r}6`, Difficulty: 'Intermediate', Genres: ['Jazz', 'Blues', 'Country', 'Swing'], Variations: [openVariation(SIXTH[r])] }); }

const output = JSON.stringify(chords, null, 2);
const outPath = path.join(__dirname, '..', 'src', 'data', 'chords.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output, 'utf8');
console.log(`Generated ${chords.length} chords -> ${outPath}`);
const q = {}; for (const c of chords) q[c.Quality] = (q[c.Quality] || 0) + 1;
console.log(Object.entries(q).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
