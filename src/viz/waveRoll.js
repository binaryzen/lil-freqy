import {util} from "/src/util.js";

const size = 2048;
const sampleRate = 128;
const amp_roll = Array.from({length:size});
const pitch_roll = Array.from({length:size});
let cursor = 0;

export let waveRoll = {
    render2d: ( args ) => {

        const viewRect = util.rect( args );
        const cx = args.context;
        const peakStats = args.model;
        const timer = args.timer;
        const indexInterval = Math.trunc( peakStats.rate / sampleRate );

        let sDelta = ( timer.dt() / 1000 );
        if ( isNaN( sDelta )) sDelta = 0;

        let copyCount = Math.trunc( sDelta * sampleRate );
/*        for ( let i = 0; i < copyCount; i ++ ) {
            amp_roll[ cursor + i ] =
                peakStats.buffer[ peakStats.buffer.length - 1 - ( i * indexInterval )];
        }*/
        amp_roll.map(( _, i ) => {
            let index = ( i + cursor ) % size;
            let amp = amp_roll[ index ];
            let pitch = pitch_roll[ index ];
            let pitchInfo = util.freq( pitch ).pitchInfo();
            let freqSemitoneIndex = util.freq( pitch ).semitonesAbove( peakStats.viewFreqRange.low );
            let plotH = 20 * Math.abs( amp ) ** 2;
            let plotW = viewRect.w * Math.max( 1 / size, 1 / viewRect.w );
            let yPos = [ freqSemitoneIndex / peakStats.viewSemitones ];
            let xPos = i / size;
            let plotY = viewRect.y + ( viewRect.h * yPos ) - ( plotH / 2 );
            let plotX = viewRect.x + ( viewRect.w * xPos ) - ( plotW / 2 );

            cx.fillStyle = util.rgba( 255, 255, 255, Math.abs( amp ));
            cx.fillRect( plotX, plotY, plotW, plotH );
        });
    }
}
