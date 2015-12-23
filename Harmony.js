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
     * @namespace Harmony
     *
     * Static properties and methods
     */
    var self = {}

    /**
     * Flat sign
     *
     * @static
     * @private
     * @member {string} _flat
     */
    self._flat = '♭';

    /**
     * Bekar sign
     *
     * @static
     * @private
     * @member {string} _bekar
     */
    self._bekar = '♮';

    /**
     * Sharp sign
     *
     * @static
     * @private
     * @member {string} _sharp
     */
    self._sharp = '♯';

    /**
     * Extract the type of the scale
     *
     * @static
     * @private
     * @method _type
     *
     * @param {string} str
     *
     * @returns {string}
     */
    self._type = function(str) {
        return (
            typeof type == 'string' && type.match(/^(natural|harmonic|melodic)$/) ?
            type :
            'natural'
        );
    }

    /**
     * Extract the chord or interval
     *
     * @static
     * @private
     * @method _chord
     *
     * @param {string} str
     *
     * @returns {string}
     */
    self._chord = function(str) {
        return str.replace(/^[A-H][♭♯]?/, '');
    }

    /**
     * Check if the tonality is minor or not
     *
     * @static
     * @private
     * @method _minor
     *
     * @param {string}   str
     * @param {boolean=} _tech
     *
     * @returns {boolean}
     */
    self._minor = function(str, _tech) {
        str = _tech ? str : self._tonality(str);

        return str.match(/^\D{1,2}m/) ? true : false;
    }

    /**
     * 
     *
     * @static
     * @private
     * @method _change
     *
     * @param {string} semitone
     * @param {string} modify
     *
     * @return {object}
     */
    self._change = function(semitone, modify) {
        if (modify == 'aug') {
            if (semitone.match(self._flat)) {
                return semitone.replace(self._flat, self._bekar);
            } else {
                return semitone + self._sharp;
            }
        } else if (modify == 'dim') {
            if (semitone.match(self._sharp)) {
                return semitone.replace(self._sharp, self._bekar);
            } else {
                return semitone + self._flat;
            }
        }
    }

    /**
     * Extract the tonality, replace #, b, H and italic names
     *
     * @static
     * @private
     * @method _tonality
     *
     * @param {string} str
     *
     * @returns {string}
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
     * @method _modifiers
     *
     * @param {string} str
     *
     * @returns {object}
     */
    self._modifiers = function(str) {
        return str.match(/(\+|\-|\/|add|aug|dim|maj|sus)(\d{0,2})/g);
    }

    /**
     * Build a chord in a given tonality
     *
     * @static
     * @method chord
     *
     * @param {string}  full
     * @param {string=} type
     *
     * @returns {string|object}
     *
     * @see http://music-education.ru/tri-vida-mazhora/
     * @see http://music-education.ru/tri-vida-minora/
     *
     * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=174&Itemid=244&lang=ru
     * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=45&Itemid=248&lang=ru
     * @see http://www.music-theory.ru/index.php?option=com_content&view=article&id=54&Itemid=249&lang=ru
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
            change    = {},
            schema    = [0],
            chromatic = self.chromatic(tonality, 2, true).split(','),
            modifiers = null;

        // Get a clean chord name
        minor = self._minor(tonality);
        chord = self._chord(full);

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
                if (self._type(type) != 'natural') {
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

        // Parse the chord modifiers
        modifiers = self._modifiers(chord);

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
            return self.alter(schema, alter);
        }

        return schema;
    }

    /**
     * Alter the chord or the interval
     *
     * @static
     * @method alter
     *
     * @param {object} notes
     * @param {number} from
     *
     * @returns {string|object}
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
     * @method clefs
     *
     * @param {string}   tonality
     * @param {boolean=} _tech
     *
     * @returns {string|object}
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
     * @method scale
     *
     * @param {string|object} tonality
     * @param {string}        type
     * @param {number}        octaves
     * @param {boolean}       [_tech]
     *
     * @returns {object}
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
     * @method degrees
     *
     * @param {string}   tonality
     * @param {string=}  type
     * @param {boolean=} _tech
     *
     * @returns {object}
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
     * @method interval
     *
     * @param {string}   full
     * @param {boolean=} type
     *
     * @returns {object}
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
     * @method relative
     *
     * @param {string}   tonality
     * @param {boolean=} _tech
     *
     * @returns {string}
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
     * @method chromatic
     *
     * @param {string}   tonality
     * @param {number}   octaves
     * @param {boolean=} _tech
     *
     * @returns {string|object}
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
     * @method tonalities
     *
     * @param {boolean=} _tech
     *
     * @returns {object}
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