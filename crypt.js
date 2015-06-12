'use strict';
var fs = require( 'fs' );
var AES = require( 'crypto-js/aes' );
var utf8 = require( 'crypto-js/enc-utf8' );
var chalk = require( 'chalk' );

var argv = require( 'minimist' )( process.argv.slice(2), {
	string: [ 'file', 'e', 'd' ],
	boolean: [ 's' ]
} );

if ( argv.file && ( argv.e || argv.d ) ) {

	try {

		var data = fs.readFileSync( argv.file, 'utf8' );
		if ( argv.e ) {

			data = AES.encrypt( data, argv.e ).toString();

		} else if ( argv.d ) {

			try { data = AES.decrypt( data, argv.d ).toString( utf8 ); }
			catch ( err ) { throw( 'Invalid key' ); }

		}

		if ( argv.s && data ) fs.writeFileSync( argv.file, data );
		console.log( chalk.blue( data ) );

	} catch ( err ) {

		process.stdout.write( '\u0007' ); // beep
		console.error( chalk.red.bold( err ) );
		process.exit( 0 );

	}


} else {

	console.log( [

		'',
		'AES-Cipher:',
		'',
		'   --file={FILE}                   {FILE} to process',
		'   --e={KEY}                       {KEY} to encrypt ',
		'   --d={KEY}                       {KEY} to decrypt ',
		'   -s                              overwrite file'

	].join( '\n' ) );

}
