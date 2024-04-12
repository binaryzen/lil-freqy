import {util} from "/src/util.js";

export let pitchInfo = {

    render2d: ( args ) => {

        let cx = args.context;
        let viewRect = util.rect( args );
        let peakStats = args.model;

        if ( peakStats.peakFreq ) {
            let pitchInfo = util.freq( peakStats.peakFreq ).pitchInfo();

            cx.font = "15px monospace";
            cx.fillStyle = util.rgba( 255, 255, 255, peakStats.peakValue );
            cx.fillText(
                `${
                    pitchInfo.key.replace( "s", "#" )
                } ${
                    pitchInfo.cents
                } ${
                    Math.round( peakStats.peakFreq * 10 ) / 10
                }`,
                viewRect.x,
                viewRect.y + 15,
            );
        }
    }
};
