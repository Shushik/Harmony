/**
 * Harmony
 *
 * JavaScript library for sol-fa calculations
 *
 * @author  Shushik <silkleopard@yandex.ru>
 * @version 4.0
 */
;var Harmony = Harmony || (function() {

    /**
     * @constructor
     *
     * Static properties and methods
     *
     * @property _flat
     * @property _bekar
     * @property _sharp
     * @function _chord
     * @function _index
     * @function _minor
     * @function _tonality
     * @function _modifiers
     * @function alter
     * @function chord
     * @function clefs
     * @function scale
     * @function degrees
     * @function interval
     * @function relative
     * @function chromatic
     * @function tonalities
     *
     * @param {string}           tonality
     * @param {undefined|number} octaves
     *
     * @return {object}
     */
    function
        self(tonality, octaves) {
            if (!(this instanceof self)) {
                return new self(tonality, octaves);
            }

            this.init(tonality, octaves);
        }

    /**
     * Instance properties and methods
     *
     * @property main
     * @property type
     * @property clefs
     * @property major
     * @property minor
     * @property melodic
     * @property natural
     * @property harmonic
     * @property relative
     * @property chromatic
     * @function init
     */
    self.prototype = {};

    /**
     * Build the tonality
     *
     * @param {string} tonality
     * @param {number} octaves
     */
    self.prototype.init = function(tonality, octaves) {
        tonality = self._tonality(tonality);
        octaves  = typeof octaves == 'number' && octaves > 1 ? octaves : 0;

        var
            type   = self._minor(tonality, true) ? 'minor' : 'major',
            degree = '';

        /**
         * Minor or major
         *
         * @type {boolean}
         */
        this[type] = true;

        /**
         * Name of the main tonality
         *
         * @type {string}
         */
        this.main = self._tonality(tonality, true);

        /**
         * Type of the tonality
         *
         * @type {string}
         */
        this.type = type;

        /**
         * Name of the relative tonality
         *
         * @type {string}
         */
        this.relative = self.relative(this.main, true);

        /**
         * Clefs of the tonality
         *
         * @type {object}
         */
        this.clefs = self.clefs(this.main, true);

        /**
         * Scale and degrees for natural harmony
         *
         * @type {object}
         */
        this.natural = {
            scale   : self.scale(this.main, 'natural', octaves),
            degrees : self.degrees(this.main, 'natural')
        }


        /**
         * Scale and degrees for harmonic harmony
         *
         * @type {object}
         */
        this.harmonic = {
            scale   : self.scale(this.main, 'harmonic', octaves),
            degrees : self.degrees(this.main, 'harmonic')
        }

        /**
         * Scale and degrees for melodic harmony (minor only)
         *
         * @type {object}
         */
        if (this.minor) {
            this.melodic = {
                scale   : self.scale(this.main, 'melodic', octaves),
                degrees : self.degrees(this.main, 'melodic')
            }
        }

        /**
         * Chromatic scale
         *
         * @type {object}
         */
        this.chromatic = self.chromatic(this.main, octaves);
    }

    /**
     * Flat sign
     *
     * @static
     * @private
     *
     * @type {string}
     */
    self._flat = '♭';

    /**
     * Bekar sign
     *
     * @static
     * @private
     *
     * @type {string}
     */
    self._bekar = '♮';

    /**
     * Sharp sign
     *
     * @static
     * @private
     *
     * @type {string}
     */
    self._sharp = '♯';

    /**
     * Extract the chord or interval
     *
     * @static
     * @private
     *
     * @param {string} str
     *
     * @return {string}
     */
    self._chord = function(str) {
        return str.replace(/^[A-H][♭♯]?/, '');
    }

    /**
     * indexOf alias for IE8 mostly
     *
     * @static
     * @private
     *
     * @param {string} hayfork
     * @param {object} haystack
     *
     * @return {number}
     */
    self._index = function(hayfork, haystack) {
        var
            straw  = 0,
            straws = 0;

        // Filter non-arrays
        if (haystack instanceof Array) {
            // Check the built-in method existance
            if (haystack.indexOf) {
                // Use built-in method
                return haystack.indexOf(hayfork);
            } else {
                // Use custom method
                straws = haystack.length;

                // Search in array
                for (; straw < straws; straw++) {
                    if (haystack[straw] === hayfork) {
                        return straw;
                    }
                }
            }
        }

        return -1;
    }

    /**
     * Check if the tonality is minor or not
     *
     * @static
     * @private
     *
     * @param {string}            str
     * @param {undefined|boolean} _tech
     *
     * @return {boolean}
     */
    self._minor = function(str, _tech) {
        str = _tech ? str : self._tonality(str);

        return str.match(/^\D{1,2}m/) ? true : false;
    }

    /**
     * Extract the tonality, replace #, b, H and italic names
     *
     * @static
     * @private
     *
     * @param {string} str
     *
     * @return {string}
     */
    self._tonality = function(str) {
        str = typeof str == 'string' ? str : 'Am';

        var
            name = str.match(/^([A-H][b#♭♯]?m?(aj)?)/);

        // No tonality name pattern found
        if (!name) {
            return 'Am';
        }

        name = name.
               shift().
               replace(/maj/, '').
               replace(/#/, self._sharp).
               replace(/b/, self._flat).
               replace(/H/, 'B');

        return name;
    }

    /**
     * Extract the chord or interval modifiers
     *
     * @static
     * @private
     *
     * @param {string} str
     *
     * @return {object}
     */
    self._modifiers = function(str) {
        return str.match(/(\+|\-|\/|add|aug|dim|maj|sus)(\d{0,2})/g);
    }

    /**
     * Build a chord in a given tonality
     *
     * @static
     *
     * @param {string}           full
     * @param {undefined|string} type
     *
     * @return {string|object}
     */
    self.chord = function(full, type) {
        var
            minor     = false,
            loop      = 0,
            step      = 0,
            alter     = 0,
            make      = '',
            chord     = '',
            tonality  = self._tonality(full),
            scale     = self.scale(tonality, type, 2, true),
            schema    = [0],
            chromatic = self.chromatic(tonality, 2, true).split(','),
            modifiers = null;

        // Get a clean chord name
        minor = self._minor(tonality);
        chord = self._chord(full);

        // Add the upper semitones for triad
        schema[1] = self._index(scale[2], chromatic);
        schema[2] = self._index(scale[4], chromatic);

        // Add the steps for the non-triad chords
        step = chord.match(/^(m?(m?aj)?)?(65|64|34|9|7|6|4|2)/);

        if (step) {
            step = step[3];

            // 
            if (step == 6 || step == 65) {
                alter = 2;
            } else if (step == 64 || step == 34) {
                alter = 3;
            } else if (step == 2) {
                alter = 4;
            }

            // Seventh or alterations
            if (step != 6 && step != 64) {
                schema[3] = self._index(scale[6], chromatic) -
                            (minor || step != 7 ? 0 : 1);
            }

            // Nineth or alterations
            if (step == 9) {
                schema[4] = self._index(scale[8], chromatic);
            }
        }

        // Parse the chord modifiers
        modifiers = self._modifiers(chord);

        if (modifiers) {
            loop = modifiers.length;

            // Append modifiers
            while (--loop > -1) {
                make = modifiers[loop].replace(/\d+/, '');
                step = modifiers[loop].replace(/\D*/, '');

                // The «add» case has it's own steps behavior
                if (make == '/' || make == 'add') {
                    step = step - 0 + 1;
                    step = isNaN(step) ? 0 : step;
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
                        schema.push(chromatic[self._index(scale[step], chromatic)]);
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
            return self.alter(schema, alter);
        }

        return schema;
    }

    /**
     * Alter the chord or the interval
     *
     * @static
     *
     * @param {object} notes
     * @param {number} from
     *
     * @return {string|object}
     */
    self.alter = function(notes, from) {
        if (typeof notes != 'object') {
            return null;
        }

        var
            step = from - 1;

        return [].concat(notes.slice(step), notes.slice(0, step));
    }

    /**
     * Get the clefs list
     *
     * @static
     *
     * @param {string}            tonality
     * @param {undefined|boolean} _tech
     *
     * @return {string|object}
     */
    self.clefs = function(tonality, _tech) {
        tonality = _tech ? tonality : self._tonality(tonality);

        var
            clefs = self.tonalities(true)[tonality],
            cut   = '',
                notes = (clefs < 0 ? 'B♭,E♭,A♭,D♭,G♭,C♭,F♭' : 'F♯,C♯,G♯,D♯,A♯,E♯,B♯');

        // Get a slice
        if (clefs) {
            cut = notes.match(new RegExp(
                '(([^,]+,?){' + (clefs < 0 ? (clefs * -1) : clefs) + '})'
            ))[0].replace(/,$/, '');
        }

        // Return the result as a string
        if (_tech) {
            return cut;
        }

        return cut ? cut.split(',') : [];
    }

    /**
     * Build an interval from a given tonic
     *
     * @static
     *
     * @param {string|object}     tonality
     * @param {string}            type
     * @param {number}            octaves
     * @param {undefined|boolean} _tech
     *
     * @return {object}
     */
    self.scale = function(tonality, type, octaves, _tech) {
        type     = typeof type == 'string' && type.match(/^(natural|harmonic|melodic)$/) ?
                   type :
                   'natural';
        octaves  = octaves || 1;
        tonality = _tech ? tonality : self._tonality(tonality);

        var
            minor     = self._minor(tonality),
            step      = 0,
            octave    = octaves - 1,
            schema    = minor ? '0,2,3,5,7,8,10' : '0,2,4,5,7,9,11',
            chromatic = self.chromatic(tonality, 1, false, true);

        // Change the schema for non-natural types of scales
        switch (type) {

            // Harmonic minor and major
            case 'harmonic':
                if (minor) {
                    schema = schema.replace(/10/, '11');
                } else {
                    schema = schema.replace(/9/, '8');
                }
            break;

            // Harmonic minor only
            case 'melodic':
                if (minor) {
                    schema = schema.replace(/8/, '9');
                    schema = schema.replace(/10/, '11');
                }
            break;

        }

        // Transform steps list into array and get its length
        schema = schema.split(',');
        step   = schema.length;

        // Replace steps positions with the semitones
        while (--step > -1) {
            schema[step] = chromatic[schema[step]];
        }

        // Add needed number of octaves
        if (octave > 0) {
            while (--octave > -1) {
                schema = schema.concat(schema.slice(0, 7));
            }
        }

        // Add the last note
        schema.push(schema[0]);

        return schema;
    }

    /**
     * Tonalities degrees
     *
     * @static
     *
     * @param {string}            tonality
     * @param {undefined|string}  type
     * @param {undefined|boolean} _tech
     *
     * @return {object}
     */
    self.degrees = function(tonality, type, _tech) {
        tonality = _tech ? tonality : self._tonality(tonality);

        var
            name   = '',
            scale  = self.scale(tonality, type, 1, true),
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
     * Build an interval from a given tonic
     *
     * @static
     *
     * @param {string}            full
     * @param {undefined|boolean} type
     *
     * @return {object}
     */
    self.interval = function(full, type) {
        var
            minor     = false,
            loop      = 0,
            step      = 0,
            interval  = '',
            tonality  = self._tonality(full),
            scale     = self.scale(tonality, type, 2, true),
            schema    = [0],
            chromatic = self.chromatic(tonality, 2, true).split(','),
            modifiers = null;

        minor     = self._minor(tonality);
        interval  = self._chord(full);
        modifiers = self._modifiers(interval);
        step      = interval.match(/^(m?)(\d{1,2})/);
        step      = step ? step[2] - 1 : 0;

        // For non single tone intervals
        if (step > 0) {
            // Add the upper semitone position
            schema[1] = self._index(scale[step], chromatic);

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
        loop = schema.length;

        while (--loop > -1) {
            schema[loop] = chromatic[schema[loop]];
        }

        return schema;
    }

    /**
     * Get a relative tonality
     *
     * @static
     *
     * @param {string}            tonality
     * @param {undefined|boolean} _tech
     *
     * @return {string}
     */
    self.relative = function(tonality, _tech) {
        tonality = _tech ? tonality : self._tonality(tonality);

        var
            chromatic = self.chromatic(tonality, 1, true).split(',');

        // If minor tonality
        if (self._minor(tonality)) {
            return chromatic[3];
        }

        return chromatic[9] + 'm';
    }

    /**
     * Get the 12 chromatic semitones
     *
     * @static
     *
     * @param {string}            tonality
     * @param {number}            octaves
     * @param {undefined|boolean} _tech
     *
     * @return {string|object}
     */
    self.chromatic = function(tonality, octaves, _tech) {
        octaves  = (typeof octaves == 'number' && octaves > 0) ?
                   octaves :
                   1;
        tonality = _tech ? tonality : self._tonality(tonality);

        var
            crop  = 0,
            check = self.tonalities(true)[tonality] < 0 ? true : false,
            clefs = self.clefs(tonality, true),
            scale = check ?
                    'A,B♭,B,C♭,C,D♭,D,E♭,E,F♭,F,G♭,G,A♭' :
                    'A,A♯,B,B♯,C,C♯,D,D♯,E,E♯,F,F♯,G,G♯',
            tonic = tonality.replace(/m/, '');

        if (check) {
            // Remove B or C flat
            if (clefs && clefs.indexOf('C♭') > -1) {
                scale = scale.replace('B,', '');
            } else {
                scale = scale.replace('C♭,', '');
            }

            // Remove F flat or E
            if (clefs && clefs.indexOf('F♭') > -1) {
                scale = scale.replace('E,', '');
            } else {
                scale = scale.replace('F♭', '');
            }
        } else {
            // Remove C or B sharp
            if (clefs && clefs.indexOf('B♯') > -1) {
                scale = scale.replace('C,', '');
            } else {
                scale = scale.replace('B♯,', '');
            }

            // Remove F or E sharp
            if (clefs && clefs.indexOf('E♯') > -1) {
                scale = scale.replace('F,', '');
            } else {
                scale = scale.replace('E♯,', '');
            }
        }

        // Get a tonic position and build a chromatic scale from a tonic
        crop  = scale.indexOf(tonic);
        scale = (scale.substring(crop) + ',' + scale.substring(0, crop)).
                replace(/,$/, '').replace(/,,/, ',');

        // Add needed number of octaves
        if (octaves > 1) {
            crop = scale.length;

            while (--octaves > 0) {
                scale += ',' + scale.substring(0, crop);
            }
        }

        // Add the ending tonic
        scale += ',' + tonic;

        // Return the result as a string
        if (_tech) {
            return scale;
        }

        // Return the result as an array
        return scale.split(',');
    }

    /**
     * Get a quint circle
     *
     * @static
     *
     * @param {undefined|boolean} _tech
     *
     * @return {object}
     */
    self.tonalities = function(_tech) {
        var
            tonality   = '',
            tonalities = {
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
                         };

        // Return the number of clefs
        if (_tech) {
            return tonalities;
        }

        // Get the clefs lists for all tonalities
        for (tonality in tonalities) {
            tonalities[tonality] = tonalities[tonality] ? self.clefs(tonality) : [];
        }

        return tonalities;
    }

    return self;

})();