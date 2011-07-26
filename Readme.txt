
	Harmony, JavaScript library for the sol-fa calculations


	Goods

	— Simple using;
	— Methods chaining support;
	— Indepentence from big libraries like jQuery;
	— Building chromatic scales for the chosen tonality;
	— Building natural, harmonic, melodic scales;
	— Getting tonality clefs;
	— Counting steps, intervals.


	System requirements

	— JavaScript;
	— Browser, which is not too old :-)


	Code examples


	 1. Init for the further use

	<code>
		var
			Tonality = new Harmony;

		/*
			Some code here
		*/

		Tonality.main_tonality_get('C');

		console.log(Tonality);
	</code>

	Tonality aliases table

	 Alias
	=======
	 C♭
	 A♭m
	 G♭
	 E♭m
	 D♭
	 H♭m
	 A♭
	 Fm
	 E♭
	 Cm
	 H♭
	 Gm
	 F
	 Dm
	 C
	 Am
	 G
	 Em
	 D
	 Hm
	 A
	 F♯m
	 E
	 C♯m
	 B
	 G♯m
	 F♯
	 D♯m
	 C♯
	 A♯m
	=======


	 2. Get the relative Tonality

	<code>
		var
			Tonality = new Harmony('Am');

		Tonality.relative_tonality_get();

		console.log(Tonality);
	</code>


	 3. Expand chromatic scale for 5 octaves

	<code>
		var
			Tonality = new Harmony('Hm').chromatic_scale_get_expanded();

		console.log(Tonality);
	</code>


	 4. Get natural, harmonic or melodic scale for chosen tonality.
	    Melodic scale could be built for minor tonalities only

	<code>
		var
			Tonality = new Harmony('Hm').natural_scale_get().harmonic_scale_get().melodic_scale_get();

		console.log(Tonality);
	</code>


	 5. Altername method to get tonality scale of the chosen type

	<code>
		var
			Tonality = new Harmony('Hm').tonality_scale_get('melodic');

		console.log(Tonality);
	</code>


	 6. Get the basic tonality degrees for the chosen type.
	    The scale of the chosen type will be built automaticly

	<code>
		var
			Tonality = new Harmony('Hm').tonality_degrees_get('melodic');

		console.log(Tonality);
	</code>


	 6. Get all the tonality degrees for the chosen type

	<code>
		var
			Tonality = new Harmony('Hm');

		Tonality.tonality_scale_get('harmonic');
		Tonality.all_degrees_get('harmonic');

		console.log(Tonality);
	</code>


	 7. Get an interval

	<code>
		var
			Tonality = new Harmony('Hm').interval_get('m3');

		console.log(Tonality);
	</code>

	Interval aliases table

	 Alias | Value
	============================
	 P1    | perfect unison
	 A1    | augmented unison
	 d2    | diminished second
	 m2    | minor second
	 M2    | major second
	 A2    | augmented second
	 d3    | diminished third
	 m3    | minor third
	 M3    | major third
	 A3    | augmented third
	 d4    | major third
	 P4    | major third
	 A4    | augmented fourth
	 T     | tritone
	 d5    | diminished fifth
	 P5    | perfect fifth
	 A5    | augmented fifth
	 d6    | diminished sixth
	 m6    | minor sixth
	 M6    | major sixth
	 A6    | augmented sixth
	 d7    | diminished seventh
	 m7    | minor seventh
	 M7    | major seventh
	 A7    | augmented seventh
	 d8    | diminished octave
	 P8    |perfect octave
	============================