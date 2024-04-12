const SEMITONE_RATIO = 2 ** ( 1 / 12 );
const CENT_RATIO = 2 ** ( 1 / 1200 );
const KEY = [ "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B" ];
const KEY_ORDINAL = { C: 0, Cs: 1, D: 2, Ds: 3, E: 4, F: 5, Fs: 6, G: 7, Gs: 8, A: 9, As: 10, B: 11 };
const A0_HZ = 27.5;
const calc_freq_interval = ( freq, semitones ) =>
    ( SEMITONE_RATIO ** semitones ) * freq;

const boil = array => array.length === 1 ? array[0] : array;
const list = args => Array.isArray( args ) ? args : [ args ];

let semitones_a0_120 =
    Array.from(
      { length: 120 },
      ( _, i ) => calc_freq_interval( A0_HZ, i - 9 )
    );
let semitones_a0_120_key_names =
    semitones_a0_120
        .map( ( _, i ) =>
            `${ KEY[( i + 9 ) % 12 ] }${ Math.floor(( i + 9 ) / 12 ) }`);

const key_from_args = args => {
    if ( typeof args === "number" )  {
        return key_from_frequency( args );
    } else if ( typeof args === "string" ) {
        return key_from_name( args );
    }
}

const key_name_from_frequency = freq => {
    if ( freq < A0_HZ ) throw "Is it how this works tho";
    let ndx = Math.round( freq_utils( freq ).semitonesAbove( A0_HZ ) );
    return semitones_a0_120_key_names[ ndx ];
}

const key_from_frequency = freq =>
    key_from_name( key_name_from_frequency( freq ));

const key_from_name = name => {
    let keyBase = name[0].toUpperCase();
    let isSharp = "s+#".includes( name[1]?.toLowerCase() );
    let octave = "0987654321".includes( nameArg.slice( -1 )) ? ( 1 * nameArg.slice( -1 )) : 0;
    let keyName = `${keyBase}${isSharp ? "s" : ""}`
    let canonicalName = `${keyName}${octave}`;

    return {
        canonicalName: canonicalName,
        name: keyName,
        ordinal: KEY_ORDINAL[ keyName ] || 0,
        octave: octave || 0
    }
};

const range_from_args = ( ...args )  => {
    let [ low, high ] = [ args[0], args[1] || 0 ].sort();
    return {
        low: low,
        high: high,
        size: high - low
    }
}

//const freq_from_args = args => Array.isArray( args ) ? args : [ args .];

const key_utils = key => ({
    freq: ( octave = key.octave ) => {
        semitones_a0_120[ key.ordinal + ( octave * 12 )]
    }
});

const freq_utils = freqList => ({

    semitonesAbove: freq2 => boil(
        freqList.map( freq => 12 * Math.log2( freq / Math.max( freq2, A0_HZ ) ))
    ),

    pitchInfo: () => boil(
        freqList.map( freq => {
            let semitoneInterval = freq_utils( [freq] ).semitonesAbove( A0_HZ );
            let keyIndex = Math.round( semitoneInterval );
            let errCents = Math.round(( semitoneInterval - keyIndex ) * 20 ) * 5;
            return {
                key: semitones_a0_120_key_names[ keyIndex ],
                keyFreq: semitones_a0_120[ keyIndex ],
                cents: errCents,
            };
        })
    ),
});

const range_utils = range => ({
    pOf: x => ( range.size > 0 ) ?
            ( x - range.low ) / range.size
            : -1,
    pValue: p =>
        range.low + ( p * range.size ),
    includes: n => range.low <= n && range.high >= n,
    contains: n => range.low < n && range.high > n,
    high: range.high,
    low: range.low,
    size: range.size,
});

export let util = {

    key: args => key_utils( key_from_args( args )),

    freq: args => freq_utils( list( args )),

    range: ( ...args ) => range_utils( range_from_args( ...args )),

    trace: ( args, cond=true, fn="info" ) =>
        cond || console[ fn ]( args ),

    rgba: ( r, g, b, a ) => `rgba(${r},${g},${b},${a})`,

    rect: args => ({
        x: args.x || args[0] || 0,
        y: args.y || args[1] || 0,
        w: args.w || args[2] || 0,
        h: args.h || args[3] || 0,

        // lol
        args: () => ([
            args.x || args[0] || 0,
            args.y || args[1] || 0,
            args.w || args[2] || 0,
            args.h || args[3] || 0,
        ]),

    }),

    reduce: array => ({
        product: () => array.reduce( (p,c) => p * c, 1 ),
        quotient: () => array.reduce( (p,c) => p / c, 1 ),
        sum: () => array.reduce( (p,c) => p + c, 0 ),
        min: () => array.reduce( (p,c) => Math.min( p,c ), Infinity ),
        max: () => array.reduce( (p,c) => Math.max( p,c ), -Infinity ),
        avg: () => array.reduce( (p,c) => p + (c/array.length), 0 ),
    }),

    dbToVol: db => 10 ** ( db/2 ),

    volToDb: vol => 20 * Math.log10( vol )
};
