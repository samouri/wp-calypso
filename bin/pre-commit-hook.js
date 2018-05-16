#!/usr/bin/env node

/**
 * A blank docblock to prevent prettier from formatting this file
 */

/**
 * External dependencies
 */
const execSync = require( 'child_process' ).execSync;
const spawnSync = require( 'child_process' ).spawnSync;
const chalk = require( 'chalk' );

console.log(
	'\nBy contributing to this project, you license the materials you contribute ' +
		'under the GNU General Public License v2 (or later). All materials must have ' +
		'GPLv2 compatible licenses — see .github/CONTRIBUTING.md for details.\n\n'
);

// Make quick pass over config files on every change
require( '../server/config/validate-config-keys' );

/**
 * Parses the output of a git diff command into javascript file paths.
 *
 * @param   {String} command Command to run. Expects output like `git diff --name-only […]`
 * @returns {Array}          Paths output from git command
 */
function parseGitDiffToPathArray( command ) {
	return execSync( command, { encoding: 'utf8' } )
		.split( '\n' )
		.map( name => name.trim() )
		.filter( name => /\.(jsx?|scss)$/.test( name ) )
}

const dirtyFiles = new Set( parseGitDiffToPathArray( 'git diff --name-only --diff-filter=ACM' ) );
const files = parseGitDiffToPathArray( 'git diff --cached --name-only --diff-filter=ACM' );

dirtyFiles.forEach( file => console.log(
	chalk.red( `${ file } will not be auto-formatted because it has unstaged changes.` )
) );

const toPrettify = files.filter( file => ! dirtyFiles.has( file ) );
toPrettify.forEach( file => console.log( `Prettier formatting file: ${ file } because it contains the @format flag` ) );

execSync( `npx prettier --write --requirePragma ${ toPrettify.join( ' ' ) }` );
execSync( `git add ${ toPrettify.join( ' ' ) }` );

// linting should happen after formatting
const lintResult = spawnSync(
	'eslint-eslines',
	[ ...files.filter( file => ! file.endsWith( '.scss' ) ), '--', '--diff=index' ],
	{
		shell: true,
		stdio: 'inherit',
	}
);

if ( lintResult.status ) {
	console.log(
		chalk.red( 'COMMIT ABORTED:' ),
		'The linter reported some problems. ' +
			'If you are aware of them and it is OK, ' +
			'repeat the commit command with --no-verify to avoid this check.'
	);
	process.exit( 1 );
}
