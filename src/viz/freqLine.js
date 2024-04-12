import {util} from "/src/util.js";

export let freqLine = {

    render2d: ( args ) => {

        let cx = args.context;
        let peakStats = args.model;
        let stackOctaves = args.stackOctaves || false;

        if ( stackOctaves === true ) stackOctaves = 2;

        let viewRect = util.rect( args );
        let rgbParamSeries = [
            "255, 0, 0",
            "200, 100, 50",
            "155, 200, 100",
            "100, 255, 155",
            "50, 255, 200",
            "0, 255, 255",
        ];

        peakStats.bins.map( ( value, i ) => {

            let freq = peakStats.binFreqs[ i ];
            if ( peakStats.viewFreqRange.contains( freq )) {

                let octaveIndex = Math.floor( util.freq( freq ).semitonesAbove( peakStats.viewFreqRange.low ) / 12 );
                let freqSemitoneIndex = util.freq( freq ).semitonesAbove( peakStats.viewFreqRange.low );

                let xPos = 0;
                let plotH = 1;
                let plotW = viewRect.w * ( peakStats.binValueRange.pOf( value ) ** 2 );
                let plotX = viewRect.x + ( viewRect.w * xPos );
                let pSet = [];

                if ( stackOctaves ) {
                    let scale = 1 / stackOctaves;
                    let d = ( freqSemitoneIndex / 12 ) % 1;
                    pSet = Array
                        .from(
                            { length:stackOctaves },
                            ( _, i ) => (( d + i ) * scale )
                        )
                        .map(
                            p => viewRect.y + viewRect.h * ( 1-p ) - ( plotH / 2 )
                        );
                } else {
                    pSet = [ freqSemitoneIndex / peakStats.viewSemitones ];
                }

                cx.fillStyle = `rgba( ${
                        rgbParamSeries[ octaveIndex ]
                    }, ${
                        peakStats.binValueRange.pOf( value )
                    }`;

                pSet.map( plotY =>
                    cx.fillRect( plotX, plotY, plotW, plotH )
                );
            }
        });
    }
};
