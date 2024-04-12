import {util} from "/src/util.js";

export let ruleLiner = {
     render2d: args => {
        const cx = args.context;
        const rgb = args.rgb || [ 0, 255, 255 ];
        const labelRgb = args.labelRgb || [ 255, 255, 255 ];
        const viewRect = util.rect( args );
        const ruleFilter = args.ruleFilter || ( i => true );
        const labels = args.labels || [];
        const n = Array.isArray( args.n ) ?
            [ ...args.n, 1 ]
            : args.n ?
                [ args.n, 1 ]
                : [ 12, 4, 4 ];

        const offset = args.offset || 0;
        const horizontal = ( args.horizontal || !args.vertical ) ? 1 : 0;
        const vertical = horizontal ? 0 : 1;
        const ruleCount = util.reduce( n ).product();
        const ruleInterval = util.reduce( n ).quotient();

        for ( let i = 0; i < ruleCount; i ++ ) if ( ruleFilter( i )) {
            let px = horizontal * i * ruleInterval;
            let py = vertical * i * ruleInterval;
            let periods = n.map( (_,j) => n.slice(j) )
                .map( tail => util.reduce(tail).product() );

            let weight = util.reduce( periods.map( x => ( i % x ) ? 0 : 1 ) ).avg();
            let level = Math.round( 1 / weight );

            cx.fillStyle = util.rgba( ...rgb, weight );
            cx.fillRect(
                viewRect.x + ( viewRect.w * px ),
                viewRect.y + ( viewRect.h * py ),
                vertical ? viewRect.w : 1,
                horizontal ? viewRect.h : 1
            );

            let label = labels
                .map(( labelSet, j ) => labelSet[ ( i / periods[ j + 1 ] ) % labelSet.length ])
                .find( l => l );

            if ( label ) {
                cx.fillStyle = util.rgba( ...labelRgb, 1 );
                cx.font = "8pt monospace";
                cx.fillText(
                    label,
                    viewRect.x + ( viewRect.w * px ) + 2,
                    viewRect.y + ( viewRect.h * py ) - 2,
                );
            }
        }
     },
};