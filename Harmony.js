
	/**
	 * Harmony
	 *
	 * JavaScript library for sol-fa calculations
	 *
	 * @author  Shushik <silkleopard@yandex.ru>
	 * @version 3.0
	 *
	 * @constructor
	 *
	 * @param string tonality
	 */
	function
		Harmony(tonality) {
			tonality = tonality || false;

			if (tonality) {
				this.main_tonality_get(tonality);
			}
		}

		/**
		 * Expand the main object with properties and methods
		 */
		Harmony.prototype = {

			/**
			 * @private
			 * @property
			 *
			 * Don`t touch it :-)
			 */
			_conf : {
				// Clefs
				clefs : {
					flat    : '♭',
					flats   : [
						'B',
						'E♭',
						'A♭',
						'D♭',
						'G♭',
						'C♭',
						'F♭'
					],
					sharp   : '♯',
					sharps  : [
						'F♯',
						'C♯',
						'G♯',
						'D♯',
						'B',
						'E♯',
						'H♯'
					],
					natural : '♮'
				},
				// Semitones
				semitones : {
					flats : [
						'A',
						'B',
						'H',
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
					sharps : [
						'A',
						'B',
						'H',
						'H♯',
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
					]
				},
				// Quint circle of tonalities
				tonalities : {
				//  alias  | number of semitones
					'C♭'  : -7,
					'A♭m' : -7,
					'G♭'  : -6,
					'E♭m' : -6,
					'D♭'  : -5,
					'H♭m' : -5,
					'A♭'  : -4,
					'Fm'  : -4,
					'E♭'  : -3,
					'Cm'  : -3,
					'H♭'  : -2,
					'Gm'  : -2,
					'F'   : -1,
					'Dm'  : -1,
					'C'   : 0,
					'Am'  : 0,
					'G'   : 1,
					'Em'  : 1,
					'D'   : 2,
					'Hm'  : 2,
					'A'   : 3,
					'F♯m' : 3,
					'E'   : 4,
					'C♯m' : 4,
					'B'   : 5,
					'G♯m' : 5,
					'F♯'  : 6,
					'D♯m' : 6,
					'C♯'  : 7,
					'A♯m' : 7
				}
			},

			/**
			 * Clear created object properties
			 *
			 * @public
			 * @method
			 */
			all_clear : function() {
				var
					check = [
						'main',
						'minor',
						'clefs',
						'chords',
						'natural',
						'melodic',
						'harmonic',
						'relative',
						'chromatic'
					];

				// Iterate through the object
				for (var i = 0, len = check.length; i < len; i++) {
					if (this[check[i]]) {
						delete this[check[i]];
					}
				}
			},

			/**
			 * Get the main tonality
			 *
			 * @public
			 * @method
			 *
			 * @param string tonality
			 */
			main_tonality_get : function(tonality) {
				this.all_clear();

				if (this._conf.tonalities[tonality] !== false) {
					// Define main tonality title
					this.main = tonality;

					// Check if it`s a minor tonality
					if (this.main.match(/m/i)) {
						this.minor = true;
					}

					// Get tonality clefs and chromatic scale
					this.tonality_clefs_get();
					this.chromatic_scale_get();
				}
			},

			/**
			 * Get the relative tonality
			 *
			 * @public
			 * @method
			 */
			relative_tonality_get : function() {
				if (this.main) {
					if (this.minor) {
						// If it`s a minor step 1.5 tones up from tonic
						this.relative = this.chromatic[3];
					} else {
						// In other case step 1.5 tones down
						this.relative = this.chromatic[9];
						this.relative += 'm';
					}
				}
			},

			/**
			 * Get main tonality clefs
			 *
			 * @public
			 * @method
			 */
			tonality_clefs_get : function() {
				if (this.main) {
					var
						num  = this._conf.tonalities[this.main],
						type = '',
						char = '';

					if (num < 0) {
						// Flat tonality
						num  = 0 - num;
						type = 'flat';
						char = '♭';
					} else {
						// Sharp or pure tonality
						type = 'sharp';
						char = '♯';
					}

					// Define clefs object
					this.clefs = {
						num  : num,
						type : type,
						char : char
					};

					// If tonality is not pure, get the clefs list
					if (num > 0) {
						this.clefs.list = this._conf.clefs[type + 's'].slice(0, num);
					}
				}
			},

			/**
			 * Get chromatic scale
			 *
			 * @public
			 * @method
			 */
			chromatic_scale_get : function() {
				if (this.main) {
					var
						check = this.clefs.list ? true : false,
						base  = [].concat(this._conf.semitones[this.clefs.type + 's']);

					// There are some double semitones in config arrays in for
					// some tonalities where pure semitone becomes sharp or flat.
					//
					// These doubles shold be removed before the chromatic scale building
					if (this.clefs.char == '♭') {
						if (
							check &&
							this.clefs.list.indexOf('C♭') > -1
						) {
							// Use «C♭» instead of «H»
							base.splice(2, 1);
						} else {
							base.splice(3, 1);
						}

						if (
							check &&
							this.clefs.list.indexOf('F♭') > -1
						) {
							// Use «F♭» instead of «E»
							base.splice(7, 1);
						} else {
							base.splice(8, 1);
						}
					} else {
						if (
							check &&
							this.clefs.list.indexOf('H♯') > -1
						) {
							// Use «H♯» instead of «C»
							base.splice(4, 1);
						} else {
							base.splice(3, 1);
						}

						if (
							check &&
							this.clefs.list.indexOf('E♯') > -1
						) {
							// Use «E♯» instead of «F»
							base.splice(9, 1);
						} else {
							base.splice(8, 1);
						}
					}

					// Clean indexes in base semitones array
					base = base.slice(0, 12);

					var
						tonic = this.main.replace(/(^.(♯|♭)?).*/i, '$1'),
						beg   = base.indexOf(tonic),
						end   = (beg - 0) + 12,
						cnt   = 0;

					// Define the chromatic property
					this.chromatic = [];

					// Generate the chromatic semitones scale
					for (var i = beg; i < end; i++) {
						var
							index = (i >= 12 ? i - 12 : i);

						this.chromatic.push(base[index]);
					}
				}
			},

			/**
			 * Expand chromatic scale
			 *
			 * @public
			 * @method
			 *
			 * @param number octaves
			 */
			chromatic_scale_get_expanded : function(octaves) {
				octaves = octaves || 2;

				var
					octave   = this.chromatic.slice(0, 12),
					expanded = [];

				// Link copied chromatic scale chosen number of times
				for (var i = 0; i < octaves; i++) {
					expanded = expanded.concat(octave);
				}

				// Replace current chromatic scale with expanded
				// chromatic scale
				this.chromatic = expanded;
			},

			/**
			 * Get natural major or minor
			 *
			 * @public
			 * @method
			 */
			natural_scale_get : function() {
				if (this.main) {
					this.natural = {};

					if (this.minor) {
						this.natural.scale = [
							this.chromatic[0],
							this.chromatic[2],
							this.chromatic[3],
							this.chromatic[5],
							this.chromatic[7],
							this.chromatic[8],
							this.chromatic[10],
							this.chromatic[0]
						];
					} else {
						this.natural.scale = [
							this.chromatic[0],
							this.chromatic[2],
							this.chromatic[4],
							this.chromatic[5],
							this.chromatic[7],
							this.chromatic[9],
							this.chromatic[11],
							this.chromatic[0]
						];
					}
				}
			},

			/**
			 * Get harmonic major or minor
			 *
			 * @public
			 * @method
			 */
			harmonic_scale_get : function() {
				if (this.main) {
					this.harmonic = {};

					if (this.minor) {
						this.harmonic.scale = [
							this.chromatic[0],
							this.chromatic[2],
							this.chromatic[3],
							this.chromatic[5],
							this.chromatic[7],
							this.chromatic[8],
							this.chromatic[11],
							this.chromatic[0]
						];
					} else {
						this.harmonic.scale = [
							this.chromatic[0],
							this.chromatic[2],
							this.chromatic[4],
							this.chromatic[5],
							this.chromatic[7],
							this.chromatic[8],
							this.chromatic[11],
							this.chromatic[0]
						];
					}
				}
			},

			/**
			 * Get melodic minor
			 *
			 * @public
			 * @method
			 */
			melodic_scale_get : function() {
				if (this.minor) {
					this.melodic = {};

					this.melodic.scale = [
						this.chromatic[0],
						this.chromatic[2],
						this.chromatic[3],
						this.chromatic[5],
						this.chromatic[7],
						this.chromatic[9],
						this.chromatic[11],
						this.chromatic[0]
					];
				}
			},

			/**
			 * Get basic degrees in natural, harmonic or melodic
			 * tonality scale. Basic degrees are: tonic, subdominant
			 * and dominant
			 *
			 * @public
			 * @method
			 *
			 * @param string type
			 */
			tonality_degrees_get : function(type) {
				type = type || 'natural';

				// If the scale for chosen type doesn`t exist, build it
				if (!this[type] || !this[type].scale) {
					this[(type + '_scale_get')]();
				}

				// Define the degrees array
				this[type].degrees = [];
				this[type].degrees.tonic       = this[type].scale[0];
				this[type].degrees.dominant    = this[type].scale[4];
				this[type].degrees.subdominant = this[type].scale[3];
			},

			/**
			 * Get all degrees in natural, harmonic or melodic
			 * tonality scale
			 *
			 * @public
			 * @method
			 *
			 * @param string type
			 */
			all_degrees_get : function(type) {
				this.tonality_degrees_get(type);

				this[type].degrees.mediant     = this[type].scale[2];
				this[type].degrees.supertonic  = this[type].scale[1];
				this[type].degrees.submediant  = this[type].scale[5];
				this[type].degrees.leadingnote = this[type].scale[6];
			}

		};