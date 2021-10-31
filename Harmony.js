/**
 * JavaScript library for sol-fa calculations
 *
 * @author Shushik <silkleopard@yandex.ru>
 * @version 5.0
 */

/**
 * @const {number} DEFAULT_OCTAVES
 */
const DEFAULT_OCTAVES = 1;

/**
 * @const {string} SI_SYMBOL
 */
const SI_SYMBOL = 'B';

/**
 * @const {string} FLAT_SYMBOL
 */
export const FLAT_SYMBOL = '♭';

/**
 * @const {string} DOUBLE_FLAT_SYMBOL
 */
export const DOUBLE_FLAT_SYMBOL = '𝄫';

/**
 * @const {string} BEKAR_SYMBOL
 */
export const BEKAR_SYMBOL = '♮';

/**
 * @const {string} SHARP_SYMBOL
 */
export const SHARP_SYMBOL = '♯';

/**
 * @const {string} DOUBLE_SHARP_SYMBOL
 */
export const DOUBLE_SHARP_SYMBOL = '𝄪';

/**
 * @const {string} MELODIC_TONALITY
 */
export const MELODIC_TONALITY = 'melodic';

/**
 * @const {string} NATURAL_TONALITY
 */
export const NATURAL_TONALITY = 'natural';

/**
 * @const {string} HARMONIC_TONALITY
 */
export const HARMONIC_TONALITY = 'harmonic';

/**
 * @const {string} DEFAULT_TONALITY
 */
export const DEFAULT_TONALITY = 'Am';

/**
 * @const {string} TONIC_STEP
 */
export const TONIC_STEP = 'tonic';

/**
 * @const {string} MEDIANT_STEP
 */
export const MEDIANT_STEP = 'mediant';

/**
 * @const {string} DOMINANT_STEP
 */
export const DOMINANT_STEP = 'dominant';

/**
 * @const {string} SUBMEDIANT_STEP
 */
export const SUBMEDIANT_STEP = 'submediant';

/**
 * @const {string} SUPERTONIC_STEP
 */
export const SUPERTONIC_STEP = 'supertonic';

/**
 * @const {string} LEADINGNOTE_STEP
 */
export const LEADINGNOTE_STEP = 'leadingnote';

/**
 * @const {string} SUBDOMINANT_STEP
 */
export const SUBDOMINANT_STEP = 'subdominant';

/**
 * @const {object} FLAT_SEMITONES
 */
const FLAT_SEMITONES = [
    'A', 'B♭', 'B', 'C♭', 'C', 'D♭', 'D',
    'E♭', 'E', 'F♭', 'F', 'G♭', 'G', 'A♭'
];

/**
 * @const {object} FLAT_CLEFS
 */
const FLAT_CLEFS = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭'];

/**
 * @const {object} SHARP_CLEFS
 */
const SHARP_CLEFS = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯'];

/**
 * @const {object} SHARP_SEMITONES
 */
const SHARP_SEMITONES = [
    'A', 'A♯', 'B', 'B♯', 'C', 'C♯', 'D',
    'D♯', 'E', 'E♯', 'F', 'F♯', 'G', 'G♯'
];

/**
 * @const {object} MAJOR_SEMITONES
 */
const MAJOR_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

/**
 * @const {object} MINOR_SEMITONES
 */
const MINOR_SEMITONES = [0, 2, 3, 5, 7, 8, 10];

/**
 * @const {object} TONALITIES
 */
const TONALITIES = {
    'C♭': -7,
    'A♭m': -7,
    'G♭': -6,
    'E♭m': -6,
    'D♭':  -5,
    'B♭m': -5,
    'A♭': -4,
    'Fm': -4,
    'E♭': -3,
    'Cm': -3,
    'B♭': -2,
    'Gm': -2,
    'F': -1,
    'Dm': -1,
    'C': 0,
    'Am': 0,
    'G': 1,
    'Em': 1,
    'D': 2,
    'Bm': 2,
    'A': 3,
    'F♯m': 3,
    'E': 4,
    'C♯m': 4,
    'A♯': 5,
    'G♯m': 5,
    'F♯': 6,
    'D♯m': 6,
    'C♯': 7,
    'A♯m': 7
};

export default class Self {

    /**
     * Check if the tonality is minor or not
     *
     * @static
     * @method parseIsMinor
     *
     * @param {string}  raw
     * @param {boolean} trust
     *
     * @returns {boolean}
     */
    static parseIsMinor(raw = DEFAULT_TONALITY, trust = false) {
        let rexp = /^[A-G][♭♯]?m/;
        let clean = Self.parseTonalityName(raw, trust);

        return clean.match(rexp) ? true : false;
    }

    /**
     * Check if the tonality has flats
     *
     * @static
     * @method parseHasFlats
     *
     * @param {string} raw
     * @param {boolean} trust
     *
     * @returns {boolean}
     */
    static parseHasFlats(raw = DEFAULT_TONALITY, trust = false) {
        let clean = Self.parseTonalityName(raw, trust);

        return TONALITIES[clean] < 0 ? true : false;
    }

    /**
     * Extract the chord or interval name
     *
     * @static
     * @method parseChordName
     *
     * @param {string} raw
     *
     * @returns {string}
     */
    static parseChordName(raw = DEFAULT_TONALITY) {
        let rexp = /^[A-G][♭♯]?/;
        let clean = Self.parseCommonSigns(raw);

        return clean.replace(rexp, '');
    }

    /**
     * Extract the chord or interval modifiers
     *
     * @static
     * @method parseChordModifiers
     *
     * @param {string} raw
     *
     * @returns {string}
     */
    static parseChordModifiers(raw) {
        let rexp = /(\+|\-|\/|add|aug|dim|maj|sus)([A-G](♭|♯)?|\d{0,2})/g;
        let clean = Self.parseCommonSigns(raw);

        return clean.match(rexp);
    }

    /**
     * Clean and fix common things
     *
     * @static
     * @method parseCommonSigns
     *
     * @param {string} raw
     * @param {boolean} trust
     *
     * @returns {string}
     */
    static parseCommonSigns(raw, trust) {
        // No need to go further
        if (trust) {
            return raw;
        }

        // No need to go further
        if (typeof raw != 'string') {
            return DEFAULT_TONALITY;
        }

        return raw.
               replace(/#/, SHARP_SYMBOL).
               replace(/b/, FLAT_SYMBOL).
               replace(/^H/, SI_SYMBOL);
    }

    /**
     * Check and fix scale type string
     *
     * @static
     * @method parseTonalityType
     *
     * @param {string} raw
     *
     * @returns {string}
     */
    static parseTonalityType(raw = NATURAL_TONALITY) {
        let rexp = new RegExp(
            `^(${NATURAL_TONALITY}|${HARMONIC_TONALITY}|${MELODIC_TONALITY})$`
        );

        return raw && typeof raw == 'string' && raw.match(rexp) ?
               raw :
               'natural';
    }

    /**
     * Extract the tonality, replace #, b, H and italic names
     *
     * @static
     * @method parseTonalityName
     *
     * @param {string} raw
     * @param {boolean} trust
     *
     * @returns {string}
     */
    static parseTonalityName(raw = DEFAULT_TONALITY, trust = false) {
        // No need to go further
        if (trust) {
            return raw;
        }

        let rexp = /^([A-G][b#♭♯]?m?(aj)?)/g;
        let clean = Self.parseCommonSigns(raw);

        // Try to reach tonality name
        clean = clean.match(rexp);

        // No need to go further
        if (!clean || !clean[0]) {
            return DEFAULT_TONALITY;
        }

        return clean[0];
    }

    /**
     * Extract the tonality tonic
     *
     * @static
     * @method parseTonalityTonic
     *
     * @param {string} raw
     * @param {boolean} trust
     *
     * @returns {string}
     */
    static parseTonalityTonic(raw = DEFAULT_TONALITY, trust = false) {
        let clean = trust ? raw : Self.parseTonalityName(raw);

        return clean.replace(/m$/, '');
    }

    /**
     * Get the clefs list
     *
     * @static
     * @method getClefs
     *
     * @param {string} tonality
     *
     * @returns {null|object}
     */
    static getClefs(tonality = DEFAULT_TONALITY) {
        let type = '';
        let clean = Self.parseTonalityName(tonality);
        let count = Self.countClefs(tonality);
        let list = null;

        // Tonality exists and has clefs
        if (count != -1) {
            if (TONALITIES[clean] < 0) {
                list = FLAT_CLEFS.slice(0, count);
            } else {
                list = SHARP_CLEFS.slice(0, count);
            }
        }

        return list;
    }

    /**
     * Get the clefs number
     *
     * @static
     * @method countClefs
     *
     * @param {string} tonality
     *
     * @returns {object}
     */
    static countClefs(tonality = DEFAULT_TONALITY) {
        const OUT_OF_RANGE = -8;

        let clean = Self.parseTonalityName(tonality);
        let clefs = clean in TONALITIES ? TONALITIES[clean] : OUT_OF_RANGE;

        if (clefs !== undefined) {
            if (clefs < 0) {
                clefs *= -1;
            }

            return clefs;
        }

        return -1;
    }

    /**
     * Tonalities degrees
     *
     * @static
     * @method degrees
     *
     * @param {string} tonality
     * @param {string} type
     *
     * @returns {object}
     */
    static getDegrees(tonality = DEFAULT_TONALITY, type = NATURAL_TONALITY) {
        let name = '';
        let scale = Self.getScale(tonality, type);
        let schema = {
            [TONIC_STEP]: 0,
            [MEDIANT_STEP]: 2,
            [DOMINANT_STEP]: 4,
            [SUBMEDIANT_STEP]: 5,
            [SUPERTONIC_STEP]: 1,
            [LEADINGNOTE_STEP]: 6,
            [SUBDOMINANT_STEP]: 3
        };

        // Insert semitones values into schema
        for (name in schema) {
            schema[name] = scale[schema[name]]
        }

        return schema;
    }

    /**
     * Get a relative tonality
     *
     * @static
     * @method getRelative
     *
     * @param {string} tonality
     *
     * @returns {string}
     */
    static getRelative(tonality = DEFAULT_TONALITY) {
        let scale = Self.getChromaticScale(tonality);

        // If minor tonality
        if (Self.parseIsMinor(tonality)) {
            return scale[3];
        }

        return scale[9] + 'm';
    }

    /**
     * Build an interval from a given tonic
     *
     * @static
     * @method getScale
     *
     * @param {string} tonality
     * @param {string} type
     * @param {number} octaves
     *
     * @returns {Array<string>}
     */
    static getScale(tonality = DEFAULT_TONALITY, type = NATURAL_TONALITY, octaves = DEFAULT_OCTAVES) {
        let step = 7;
        let clean = Self.parseTonalityName(tonality);
        let minor = Self.parseIsMinor(clean);
        let schema  = (minor ? MINOR_SEMITONES : MAJOR_SEMITONES).slice();
        let chromatic = Self.getChromaticScale(clean);

        // Change the schema for non-natural types of scales
        switch (Self.parseTonalityType(type)) {

            // Harmonic minor and major
            case HARMONIC_TONALITY:
                if (minor) {
                    schema[6] = 11;
                } else {
                    schema[5] = 8;
                }
            break;

            // Harmonic minor only
            case MELODIC_TONALITY:
                if (minor) {
                    schema[5] = 9;
                    schema[6] = 11;
                } else {
                }
            break;

        }

        // Replace steps positions with the semitones
        while (--step > -1) {
            schema[step] = chromatic[schema[step]];
        }

        // Add needed number of octaves
        if (octaves > 1) {
            while (--octaves > -1) {
                schema = schema.concat(schema.slice(0, 7));
            }
        }

        // Add a tonic to the end
        schema.push(schema[0]);

        return schema;
    }

    /**
     * Get the 12 chromatic semitones
     *
     * @static
     * @method getChromaticScale
     *
     * @param {string} tonality
     * @param {number} octaves
     *
     * @returns {Array<string>}
     */
    static getChromaticScale(tonality = DEFAULT_TONALITY, octaves = DEFAULT_OCTAVES) {
        let check = -1;
        let semitone = -1;
        let clean = Self.parseTonalityName(tonality);
        let tonic = Self.parseTonalityTonic(clean, true);
        let clefs = Self.getClefs(clean, true);
        let scale = null;

        // Remove unnesessary semitones
        if (clefs.length && clefs[0].indexOf(FLAT) != -1) {
            scale = FLAT_SEMITONES.slice();

            // Remove B or C flat
            if (clefs.indexOf('C♭') != -1) {
                scale.splice(2, 1);
            } else {
                scale.splice(3, 1);
            }

            // Remove F flat or E
            if (clefs.indexOf('F♭') != -1) {
                scale.splice(7, 1);
            } else {
                scale.splice(8, 1);
            }
        } else {
            scale = SHARP_SEMITONES.slice();

            // Remove C or B sharp
            if (clefs.length && clefs.indexOf('B♯') != -1) {
                scale.splice(4, 1);
            } else {
                scale.splice(3, 1);
            }

            // Remove F or E sharp
            if (clefs.length && clefs.indexOf('E♯') != -1) {
                scale.splice(9, 1);
            } else {
                scale.splice(8, 1);
            }
        }

        // Get a tonic position and build a chromatic scale from a tonic
        semitone = scale.indexOf(tonic);
        scale = [].concat(scale.slice(semitone), scale.slice(0, semitone));

        // Expand for needed number of octaves
        while (--octaves) {
            scale = [].concat(scale, scale.slice(0, 12));
        }

        // Add tonic to the end
        scale.push(scale[0]);

        return scale;
    }

    /**
     * Build an interval from a given tonic
     *
     * @static
     * @method interval
     *
     * @param {string} raw
     * @param {string} type
     *
     * @returns {Array<string>}
     */
    static getInterval(raw = DEFAULT_TONALITY, type = NATURAL_TONALITY) {
        let minor = Self.parseIsMinor(raw);
        let step = 0;
        let interval = Self.parseChordName(raw);
        let tonality = Self.parseTonalityName(raw);
        let scale = Self.getScale(tonality, Self.parseTonalityType(type), 2);
        let schema = [0];
        let chromatic = Self.getChromaticScale(tonality, 2);
        let modifiers = Self.parseChordModifiers(interval);

        step = interval.match(/^(m?)(\d{1,2})/);
        step = step ? step[2] - 1 : 0;

        // For non single tone intervals
        if (step) {
            // Add the upper semitone position
            schema[1] = chromatic.indexOf(scale[step]);

            if (modifiers) {
                // It's not a chord so there's no need to have
                // more than one modifier
                modifiers = modifiers[0];

                // Choose an modifier type
                switch (modifiers) {

                    case '+':
                    case 'aug':
                        schema[1] = schema[1] + 1;
                    break;

                    // Diminish
                    case '-':
                    case 'dim':
                        schema[1] = schema[1] - 1;
                    break;

                }
            }
        }

        // Iterate through the interval semitones
        step = schema.length;

        while (--step > -1) {
            schema[step] = chromatic[schema[step]];
        }

        return schema;
    }

    /**
     * Alter interval
     *
     * @static
     * @method alterInterval
     *
     * @param {object} notes
     * @param {number} offset
     *
     * @returns {Array<string>}
     */
    static alterInterval(notes, offset) {
        return Self.alterChord(notes, offset);
    }

    /**
     * Build a chord in a given tonality
     *
     * @static
     * @method getChord
     *
     * @param {string} raw
     *
     * @returns {Array<string>}
     *
     * @see http://music-education.ru/tri-vida-mazhora/
     * @see http://music-education.ru/tri-vida-minora/
     *
     * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=174&Itemid=244&lang=ru
     * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=45&Itemid=248&lang=ru
     * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=54&Itemid=249&lang=ru
     */
    static getChord(raw = DEFAULT_TONALITY, type = NATURAL_TONALITY) {
        let minor = Self.parseIsMinor(raw);
        let loop = 0;
        let alter = 0;
        let step = null;
        let chord = Self.parseChordName(raw);
        let tonality = Self.parseTonalityName(raw);
        let scale = Self.getScale(tonality, Self.parseTonalityType(type), 2);
        let schema = [0];
        let chromatic = Self.getChromaticScale(tonality, 2);
        let modifiers = Self.parseChordModifiers(chord);

        // Add the upper semitones for triad
        schema[1] = minor ? 3 : 4;
        schema[2] = 7;

        // Add the steps for the non-triad chords
        step = chord.match(/^(m?(m?aj)?)?(65|64|34|9|7|6|4|2)/);

        if (step) {
            step = step[3];

            alter = Self._getChordAlteredSemitone(step);

            Self._changeChordSchemaByStep(step, type, minor, schema);
        }

        if (modifiers) {
            loop = modifiers.length;

            // Append modifiers
            while (--loop > -1) {
                Self._changeChordSchemaByModifiers(modifiers[loop], schema);
            }
        }

        // Fill the chord schema with the semitones values
        loop = schema.length;

        while (--loop > -1) {
            schema[loop] = chromatic[schema[loop]];
        }

        if (alter) {
            return Self.alterChord(schema, alter);
        }

        return schema;
    }

    /**
     * Get chord altered semitone
     *
     * @static
     * @private
     * @method _getChordAlteredSemitone
     *
     * @param {number} step
     *
     * @returns {number} 
     */
    static _getChordAlteredSemitone(step) {
        // For alterated chords
        if (step == 65) {
            return 2;
        } else if (step == 64 || step == 34) {
            return 3;
        } else if (step == 2) {
            return 4;
        }

        return 0;
    }

    /**
     * Change chord schema by step
     *
     * @static
     * @private
     * @method _changeChordSchemaByStep
     *
     * @param {number} step
     * @param {string} type
     * @param {boolean} minor
     * @param {Array<string>} schema
     */
    static _changeChordSchemaByStep(step, type, minor, schema) {
        // Seventh or alterations
        if (step != 6 && step != 64) {
            if (type != NATURAL_TONALITY) {
                schema[3] = minor ? 11 : 9;
            } else {
                schema[3] = 10;
            }
        } else if (step == 6) {
            if (type != NATURAL_TONALITY) {
                schema[3] = minor ? 10 : 8;
            } else {
                schema[3] = 9;
            }
        }

//        // Nineth or alterations
//        if (step == 9) {
//            schema[4] = Self._index(scale[8], chromatic);
//        }
    }

    /**
     * Change chord schema by modifiers
     *
     * @static
     * @private
     * @method _changeChordSchemaByStep
     *
     * @param {string} modifier
     * @param {Array<string>} schema
     */
    _changeChordSchemaByModifiers(modifier, schema) {
        let make = modifier.replace(/\d+|[A-G](♭|♯)?/, '');
        let step = modifier.replace(/\D*/, '') - 0;

        if (step = modifier.match(/[A-G](♭|♯)?/)) {
            step = step[0];
        } else {
            step = modifiers[loop].replace(/\D*/, '') - 0;
        }

        // The «add» case has it's own steps behavior
        if (make == '/' || make == 'add') {
            if (typeof step == 'number') {
                step = step + 1;
                step = !isNaN(step) ? step : schema.length;
            }
        } else {
            step = (step ? step - 2 : (schema.length - 1));
            step = step - Math.ceil(step / 3);
        }

        // Choose an modifier type
        switch (make) {

            // Augment
            case '+':
            case 'aug':
            case 'maj':
                schema[step] = schema[step] + 1;
                break;

            // Diminish
            case '-':
            case 'dim':
                schema[step] = schema[step] - 1;
                break;

            // Slash
            case '/':
                if (typeof step == 'string') {
                    schema.unshift(chromatic.indexOf(step));
                } else {
                    schema.unshift(chromatic.indexOf(scale[step]));
                }
                break;

            // Add
            case 'add':
                if (typeof step == 'string') {
                    schema.push(chromatic.indexOf(step));
                } else {
                    schema.push(chromatic.indexOf(scale[step]));
                }
                break;

            // Suspend
            case 'sus':
                if (step === 0) {
                    schema[1] = schema[1] - 1;
                } else {
                    schema[1] = schema[1] + 1;
                }
                break;

        }
    }

    /**
     * Alter chord
     *
     * @static
     * @method alterChord
     *
     * @param {Array<string>} notes
     * @param {number} offset
     *
     * @returns {Array<string>}
     */
    static alterChord(notes, offset = 1) {
        // No need to go further
        if (!(notes instanceof Array)) {
            return null;
        }

        let step = offset;

        return [].concat(notes.slice(step), notes.slice(0, step));
    }

}
