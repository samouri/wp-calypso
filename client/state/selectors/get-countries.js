/** @format */

/**
 * External dependencies
 */
import { get } from 'lodash';

export default function getCountries( state, type ) {
	return get( state, [ 'countries', type ], null );
}
