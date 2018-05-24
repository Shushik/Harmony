/**
 * JavaScript library for sol-fa calculations
 *
 * @class   Harmony
 * @author  Shushik <silkleopard@yandex.ru>
 * @version 4.0
 * @license MIT
 *
 * @class Harmony
 */
var Harmony = Harmony || (function() {

    // Class definition
    class self {

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
        static parseIsMinor(raw = 'Am', trust = false) {
            raw = self.parseTonalityName(raw, trust);

            return raw.match(/^[A-G][♭♯]?m/) ? true : false;
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
        static parseChordName(raw = 'Am') {
            raw = self.parseCommonSigns(raw);
            return raw.replace(/^[A-G][♭♯]?/, '');
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
            raw = self.parseCommonSigns(raw);
            return raw.match(/(\+|\-|\/|add|aug|dim|maj|sus)(\d{0,2})/g);
        }

        /**
         * Clean and fix common things
         *
         * @static
         * @method parseCommonSigns
         *
         * @param {string}  raw
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
                return 'Am';
            }

            return raw.
                   replace(/#/, self._conf.sharp).
                   replace(/b/, self._conf.flat).
                   replace(/^H/, 'B');
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
        static parseTonalityType(raw = 'natural') {
            return raw && typeof raw == 'string' && raw.match(/^(natural|harmonic|melodic)$/) ?
                   raw :
                   'natural';
        }

        /**
         * Extract the tonality, replace #, b, H and italic names
         *
         * @static
         * @method parseTonalityName
         *
         * @param {string}  raw
         * @param {boolean} trust
         *
         * @returns {string}
         */
        static parseTonalityName(raw = 'Am', trust = false) {
            // No need to go further
            if (trust) {
                return raw;
            }

            // Try to reach tonality name
            raw = self.parseCommonSigns(raw);
            raw = raw.match(/^([A-G][b#♭♯]?m?(aj)?)/g);

            // No need to go further
            if (!raw[0]) {
                return 'Am';
            }

            return raw[0];
        }

        /**
         * Extract the tonality tonic
         *
         * @static
         * @method parseTonalityTonic
         *
         * @param {string}  raw
         * @param {boolean} trust
         *
         * @returns {object}
         */
        static parseTonalityTonic(raw = 'Am', trust = false) {
            raw = trust ? raw : self.parseTonalityName(raw);

            return raw.replace(/m$/, '');
        }

        /**
         * Get the clefs list
         *
         * @static
         * @method getClefs
         *
         * @param {string} tonality
         *
         * @returns {object}
         */
        static getClefs(tonality = 'Am') {
            tonality = self.parseTonalityName(tonality);

            var
                type  = '',
                count = self.countClefs(tonality),
                list  = null;

            // Tonality exists and has clefs
            if (count != -1) {
                type = self._conf.tonalities[tonality] < 0 ? 'flat' : 'sharp';
                list = self._conf.clefs[type].slice(0, count);

                return list;
            }

            return null;
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
        static countClefs(tonality = 'Am') {
            tonality = self.parseTonalityName(tonality);

            var
                clefs = tonality in self._conf.tonalities ? self._conf.tonalities[tonality] : -8;

            if (clefs != -8) {
                if (clefs < 0) {
                    clefs *= -1;
                }

                return clefs;
            }

            return -1;
        }

        /**
         * Alter chord
         *
         * @static
         * @method alterChord
         *
         * @param {object} notes
         * @param {string} notes
         *
         * @returns {object}
         */
        static translateClefs(notes, type = 'sharp') {
            if (!notes || !(notes instanceof Array)) {
                return null;
            }

            var
                note = notes.length,
                copy = notes.slice();

            while (--note > -1) {
                if (self._conf.synonyms.flat[copy[note]]) {
                    copy[note] = self._conf.synonyms.flat[copy[note]];
                }
            }

            return copy;
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
        static getDegrees(tonality = 'Am', type = 'natural') {
            var
                name   = '',
                scale  = self.getScale(tonality, type),
                schema = {
                             tonic       : 0,
                             mediant     : 2,
                             dominant    : 4,
                             submediant  : 5,
                             supertonic  : 1,
                             leadingnote : 6,
                             subdominant : 3
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
        static getRelative(tonality = 'Am') {
            var
                scale = self.getChromaticScale(tonality);

            // If minor tonality
            if (self.parseIsMinor(tonality)) {
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
         * @returns {object}
         */
        static getScale(tonality = 'Am', type = 'natural', octaves = 1) {
            tonality = self.parseTonalityName(tonality);
            type     = self.parseTonalityType(type);

            var
                step      = 7,
                minor     = self.parseIsMinor(tonality),
                schema    = (
                                minor ?
                                self._conf.semitones.minor :
                                self._conf.semitones.major
                            ).slice(),
                chromatic = self.getChromaticScale(tonality);

            // Change the schema for non-natural types of scales
            switch (type) {

                // Harmonic minor and major
                case 'harmonic':
                    if (minor) {
                        schema[6] = 11;
                    } else {
                        schema[5] = 8;
                    }
                break;

                // Harmonic minor only
                case 'melodic':
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
         * @returns {object}
         */
        static getChromaticScale(tonality = 'Am', octaves = 1) {
            tonality = self.parseTonalityName(tonality);

            var
                check    = -1,
                semitone = -1,
                tonic    = self.parseTonalityTonic(tonality, true),
                type     = '',
                clefs    = self.getClefs(tonality, true),
                scale    = null;

            type  = clefs.length && clefs[0].indexOf(self._conf.flat) != -1 ? 'flat' : 'sharp';
            scale = self._conf.semitones[type].slice();

            // Remove unnecessary semitones
            switch (type) {
                case 'flat':
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
                    break;

                case 'sharp':
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
                    break;
            }

            // Get a tonic position and build a chromatic scale from a tonic
            scale = Array.concat(scale.slice(tonic), scale.slice(0, tonic));

            // Expand for needed number of octaves
            while (--octaves) {
                scale = Array.concat(scale, scale.slice(0, 12));
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
         * @returns {object}
         */
        static getInterval(raw = 'Am', type = 'natural') {
            type = self.parseTonalityType(type);

            var
                minor     = self.parseIsMinor(raw),
                step      = 0,
                interval  = self.parseChordName(raw),
                tonality  = self.parseTonalityName(raw),
                scale     = self.getScale(tonality, type, 2),
                schema    = [0],
                chromatic = self.getChromaticScale(tonality, 2),
                modifiers = self.parseChordModifiers(interval);

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
         * @method alterChord
         *
         * @param {object} notes
         * @param {number} offset
         *
         * @returns {object}
         */
        static alterInterval(notes, offset) {
            return self.alterChord(notes, offset);
        }

        /**
         * Build a chord in a given tonality
         *
         * @static
         * @method getChord
         *
         * @param {string} raw
         *
         * @returns {object}
         *
         * @see http://music-education.ru/tri-vida-mazhora/
         * @see http://music-education.ru/tri-vida-minora/
         *
         * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=174&Itemid=244&lang=ru
         * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=45&Itemid=248&lang=ru
         * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=54&Itemid=249&lang=ru
         */
        static getChord(raw = 'Am', type = 'natural') {
            type = self.parseTonalityType(type);

            var
                minor     = self.parseIsMinor(raw),
                loop      = 0,
                alter     = 0,
                step      = null,
                make      = '',
                chord     = self.parseChordName(raw),
                tonality  = self.parseTonalityName(raw),
                scale     = self.getScale(tonality, type, 2),
                schema    = [0],
                chromatic = self.getChromaticScale(tonality, 2),
                modifiers = self.parseChordModifiers(chord);

            // Add the upper semitones for triad
            schema[1] = minor ? 3 : 4;
            schema[2] = 7;

            // Add the steps for the non-triad chords
            step = chord.match(/^(m?(m?aj)?)?(65|64|34|9|7|6|4|2)/);

            if (step) {
                step = step[3];

                // For alterated chords
                if (step == 6 || step == 65) {
                    alter = 2;
                } else if (step == 64 || step == 34) {
                    alter = 3;
                } else if (step == 2) {
                    alter = 4;
                }

                // Seventh or alterations
                if (step != 6 && step != 64) {
                    if (type != 'natural') {
                        schema[3] = minor ? 11 : 9;
                    } else {
                        schema[3] = 10;
                    }
                }

                // Nineth or alterations
    /*
                if (step == 9) {
                    schema[4] = self._index(scale[8], chromatic);
                }
    */
            }

            if (modifiers) {
                loop = modifiers.length;

                // Append modifiers
                while (--loop > -1) {
                    make = modifiers[loop].replace(/\d+/, '');
                    step = modifiers[loop].replace(/\D*/, '') - 0;

                    // The «add» case has it's own steps behavior
                    if (make == '/' || make == 'add') {
                        step = step + 1;
                        step = !isNaN(step) ? step : schema.length;
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

                        // Add
                        case '/':
                        case 'add':
                            schema.push(chromatic.indexOf(scale[step]))
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
            }

            // Fill the chord schema with the semitones values
            loop = schema.length;

            while (--loop > -1) {
                schema[loop] = chromatic[schema[loop]];
            }

            if (alter) {
                return self.alterChord(schema, alter);
            }

            return schema;
        }

        /**
         * Alter chord
         *
         * @static
         * @method alterChord
         *
         * @param {object} notes
         * @param {number} offset
         *
         * @returns {object}
         */
        static alterChord(notes, offset = 1) {
            // No need to go further
            if (!(notes instanceof Array)) {
                return null;
            }

            var
                step = offset - 1;

            return [].concat(notes.slice(step), notes.slice(0, step));
        }

    }

    /**
     * Config
     *
     * @static
     * @private
     * @member {object} _conf
     */
    self._conf = {
        flat : '♭',
        bekar : '♮',
        sharp : '♯',
        clefs : {
            flat : [
                'B♭',
                'E♭',
                'A♭',
                'D♭',
                'G♭',
                'C♭',
                'F♭'
            ],
            sharp : [
                'F♯',
                'C♯',
                'G♯',
                'D♯',
                'A♯',
                'E♯',
                'B♯'
            ]
        },
        synonyms : {
            flat : {
                'B♭' : 'A♯',
                'E♭' : 'D♯',
                'A♭' : 'G♯',
                'D♭' : 'C♯',
                'G♭' : 'F♯',
                'C♭' : 'B',
                'F♭' : 'E'
            },
            sharp : {
                'F♯' : 'G♭',
                'C♯' : 'D♭',
                'G♯' : 'A♭',
                'D♯' : 'E♭',
                'A♯' : 'B♭',
                'E♯' : 'F',
                'B♯' : 'C'
            }
        },
        semitones : {
            flat : [
                'A',
                'B♭',
                'B',
                'C♭',
                'C',
                'D♭',
                'D',
                'E♭',
                'E',
                'F♭',
                'F',
                'G♭',
                'G',
                'A♭'
            ],
            sharp : [
                'A',
                'A♯',
                'B',
                'B♯',
                'C',
                'C♯',
                'D',
                'D♯',
                'E',
                'E♯',
                'F',
                'F♯',
                'G',
                'G♯'
            ],
            major : [
                0,
                2,
                4,
                5,
                7,
                9,
                11
            ],
            minor : [
                0,
                2,
                3,
                5,
                7,
                8,
                10
            ]
        },
        tonalities : {
            'C♭'  : -7,
            'A♭m' : -7,
            'G♭'  : -6,
            'E♭m' : -6,
            'D♭'  : -5,
            'B♭m' : -5,
            'A♭'  : -4,
            'Fm'  : -4,
            'E♭'  : -3,
            'Cm'  : -3,
            'B♭'  : -2,
            'Gm'  : -2,
            'F'   : -1,
            'Dm'  : -1,
            'C'   : 0,
            'Am'  : 0,
            'G'   : 1,
            'Em'  : 1,
            'D'   : 2,
            'Bm'  : 2,
            'A'   : 3,
            'F♯m' : 3,
            'E'   : 4,
            'C♯m' : 4,
            'A♯'  : 5,
            'G♯m' : 5,
            'F♯'  : 6,
            'D♯m' : 6,
            'C♯'  : 7,
            'A♯m' : 7
        }
    };

    // Class export
    return self;

})();
