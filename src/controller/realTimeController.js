const t_index_sz = 100;
const t_index = Array.from({ length: 100 }).fill( 0 );
let t_index_cursor = 0;
let t_from_args = args => args?.t || ( 1 * args ) || Date.now();

export let timer = {

    t: _ =>
        t_index[ t_index_cursor ],

    dt: args =>
        t_index[ t_index_cursor ] - t_index[( t_index_cursor - 1 ) % t_index_sz ],

    update: args =>
        ( t_index[( t_index_cursor + 1 ) % t_index_sz ] = t_from_args( args ))
        && ( t_index_cursor = ( t_index_cursor + 1 ) % t_index_sz ),
};