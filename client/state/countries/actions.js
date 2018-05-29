/**
 * Internal dependencies
 */
import {
	COUNTRIES_DOMAINS_FETCH,
	COUNTRIES_PAYMENTS_FETCH,
	COUNTRIES_SMS_FETCH
} from 'state/action-types';

export const requestDomainCountries = () => ( { type: COUNTRIES_DOMAINS_FETCH } );
export const requestPaymentCountries = () => ( { type: COUNTRIES_PAYMENTS_FETCH } );
export const requestSmsCountries = () => ( { type: COUNTRIES_SMS_FETCH } );
