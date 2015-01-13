
	Harmony, JavaScript library for the sol-fa calculations
	Working example: http://silkleo.ru/temp/tonalities/


	Goods

	— Simple usage;
	— «Static» syntax;
	— Doesn't need any other JavaScript libraries;
	— Builds chromatic, natural, harmonic and melodic scales;
	— Builds intervals and chords;
	— Gets tonality clefs and degrees;
	— Alterates intervals.


	System requirements

	— JavaScript;
	— Browser, which is not too old :-)


	Code examples:


	1. Build a tonic triad in A minor and a «dominant» seventh in C major

	<code>
		console.log(Harmony.chord('Am'));
		// ['A', 'C', 'E']
	</code>

	<code>
		console.log(Harmony.chord('C7'));
		// ['C', 'E', 'G', 'B♭']
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 full     | Chord name (Am, C, G7, Gmaj7, F9, etc)
	------------------------------------------------------------------
	 type     | Type of a tonality scale (natural, harmonic, melodic)
	==================================================================


	2. Alter a chord or an interval from a chosen step

	<code>
		console.log(Harmony.chord('C6'));
		// ['E', 'G', 'C']
	</code>

	<code>
		console.log(Harmony.alter(Harmony.chord('C'), 2));
		// ['E', 'G', 'C']
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 notes    | An array from Harmony.chord()
	------------------------------------------------------------------
	 from     | New first step
	==================================================================


	3. Get clefs for a chosen tonality

	<code>
		console.log(Harmony.clefs('Fm'));
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 tonality | Tonality name (Am, C)
	==================================================================


	4. Build a scale of a chosen type

	<code>
		console.log(Harmony.scale('C'));
		// ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']
	</code>

	<code>
		console.log(Harmony.scale('C', 'harmonic', 2));
		// [
		// 	'C', 'D', 'E', 'F', 'G', 'G♯', 'B',
		// 	'C', 'D', 'E', 'F', 'G', 'G♯', 'B',
		// 	'C'
		// ]
	</code>

	<code>
		console.log(Harmony.scale('Am', 'melodic'));
		// ["A", "B", "C", "D", "E", "F♯", "G♯", "A"]
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 tonality | Tonality name (Am, C)
	------------------------------------------------------------------
	 type     | Type of a scale (natural, harmonic, melodic)
	------------------------------------------------------------------
	 octaves  | Number of octaves
	==================================================================


	5. Get degrees in a tonality

	<code>
		console.log(Harmony.degrees('C'));
		// {
		// 	tonic : 'C',
		// 	mediant : 'E',
		// 	dominant : 'G',
		// 	submediant : 'A',
		// 	supertonic : 'D',
		// 	leadingnote : 'B',
		// 	subdominant : 'F'
		// }
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 tonality | Tonality name (Am, C)
	------------------------------------------------------------------
	 type     | Type of a scale (natural, harmonic, melodic)
	==================================================================


	6. Build an interval

	<code>
		console.log(Harmony.interval('Cm3'));
		// ['C', 'E♭']
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 full     | Interval name (Am3, Am4aug, C6dim, Cm2)
	------------------------------------------------------------------
	 type     | Type of a scale (natural, harmonic, melodic)
	==================================================================


	7. Get a relative tonality

	<code>
		console.log(Harmony.relative('Em'));
		// 'G'
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 tonality | Tonality name (Am, C)
	==================================================================


    8. Get a chromatic scale for a given tonality

	<code>
		console.log(Harmony.chromatic('G'));
		// [
		// 	'G', 'G♯', 'A', 'A♯', 'B', 'C',
		// 	'C♯', 'D', 'D♯', 'E', 'F', 'F♯',
		// 	'G'
		// ]
	</code>

	Arguments:

	 Argument | Value
	==================================================================
	 tonality | Tonality name (Am, C)
	------------------------------------------------------------------
	 octaves  | Number of octaves
	==================================================================