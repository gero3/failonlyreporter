var chalk = require( 'chalk' );



var failOnlyReporter = function ( runner ) {

	this.testCount = 0;

	runner.on( 'testEnd', this.onTestEnd.bind( this ) );
	runner.on( 'runEnd', this.onRunEnd.bind( this ) );

};

failOnlyReporter.init = function ( runner ) {

	return new failOnlyReporter( runner );

};


failOnlyReporter.prototype.onTestEnd = function ( test ) {

	this.testCount = this.testCount + 1;

	if ( test.status === 'failed' ) {

		console.log( chalk.red( `not ok ${this.testCount} ${test.fullName.join( ' > ' )}` ) );
		test.errors.forEach( ( error ) => this.logError( error ) );

	}

};

failOnlyReporter.prototype.onRunEnd = function ( globalSuite ) {

	console.log( `1..${globalSuite.testCounts.total}` );
	console.log( `# pass ${globalSuite.testCounts.passed}` );
	console.log( chalk.yellow( `# skip ${globalSuite.testCounts.skipped}` ) );
	console.log( chalk.cyan( `# todo ${globalSuite.testCounts.todo}` ) );
	console.log( chalk.red( `# fail ${globalSuite.testCounts.failed}` ) );

};

failOnlyReporter.prototype.logError = function ( error, severity ) {

	console.log( '  ---' );
	console.log( `  message: "${( error.message || 'failed' ).replace( /"/g, '\\"' )}"` );
	console.log( `  severity: ${severity || 'failed'}` );

	if ( error.hasOwnProperty( 'actual' ) ) {

		var actualStr = error.actual !== undefined ? ( '"' + JSON.stringify( error.actual, null, 2 ).replace( /"/g, '\\"' ).replace( /\n/g, '\\n' ) + '"' ) : 'undefined';
		console.log( `  actual: ${actualStr}` );

	}

	if ( error.hasOwnProperty( 'expected' ) ) {

		var expectedStr = error.expected !== undefined ? ( '"' + JSON.stringify( error.expected, null, 2 ).replace( /"/g, '\\"' ).replace( /\n/g, '\\n' ) + '"' ) : 'undefined';
		console.log( `  expected: ${expectedStr}` );

	}

	if ( error.stack ) {

		console.log( `  stack: "${error.stack.replace( /"/g, '\\"' ).replace( /\n/g, '\\n' )}"` );

	}

	console.log( '  ...' );

};



module.exports = failOnlyReporter;
