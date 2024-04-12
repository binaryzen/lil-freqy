import {util} from "/src/util.js";

export let peakStats = args => {

    const bins = args.bins;
    const buffer = args.buffer;
    const rate = args.rate || 48000;
    const binValueRange = args.binValueRange || util.range( 0, 255 );
    const dataFreqRange = args.dataFreqRange || util.range( 0, 24000 );
    const viewFreqRange = args.viewFreqRange || util.range( 55, 7040 );

    let peakValue = 0, peakBin = 0, peakFreq = 0;

    let binFreqs = Array.from( bins,

        ( value, i ) => {

            let p = binValueRange.pOf( value );
            let freq = dataFreqRange.pValue( i / bins.length );

            if ( viewFreqRange.includes( freq ) && Math.abs( p ) > Math.abs( peakValue )) {
                peakValue = p;
                peakBin = i;
                peakFreq = freq;
            }

            return freq;
        }
    );

    return ({
        bins:bins,
        buffer:buffer,
        rate:rate,
        binFreqs:binFreqs,
        peakValue:peakValue,
        peakBin:peakBin,
        peakFreq:peakFreq,
        binValueRange:binValueRange,
        dataFreqRange:dataFreqRange,
        viewFreqRange:viewFreqRange,
        viewSemitones:util.freq( viewFreqRange.high ).semitonesAbove( viewFreqRange.low ),
    });

};