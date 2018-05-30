/** @format */

/**
 * External dependencies
 */
import config from 'config';
import page from 'page';

/**
 * Internal Dependencies
 */
import * as billingController from 'me/billing-history/controller';
import * as controller from './controller';
import * as paths from './paths';
import { makeLayout, redirectLoggedOut, render as clientRender } from 'controller';
import { sidebar } from 'me/controller';
import { siteSelection } from 'my-sites/controller';

export default function( router ) {
	if ( config.isEnabled( 'manage/payment-methods' ) ) {
		router(
			paths.addCreditCard,
			redirectLoggedOut,
			sidebar,
			controller.addCreditCard,
			makeLayout,
			clientRender
		);

		// redirect legacy urls
		router( '/payment-methods/add-credit-card', () => page.redirect( paths.addCreditCard ) );
	}

	router(
		paths.billingHistory,
		redirectLoggedOut,
		sidebar,
		billingController.billingHistory,
		makeLayout,
		clientRender
	);

	router(
		paths.billingHistoryReceipt(),
		redirectLoggedOut,
		sidebar,
		billingController.transaction,
		makeLayout,
		clientRender
	);

	router(
		paths.purchasesRoot,
		redirectLoggedOut,
		sidebar,
		controller.list,
		makeLayout,
		clientRender
	);

	router(
		paths.managePurchase(),
		redirectLoggedOut,
		sidebar,
		siteSelection,
		controller.managePurchase,
		makeLayout,
		clientRender
	);

	router(
		paths.cancelPurchase(),
		redirectLoggedOut,
		sidebar,
		siteSelection,
		controller.cancelPurchase,
		makeLayout,
		clientRender
	);

	router(
		'/me/purchases/:purchaseId/cancel-privacy-protection',
		redirectLoggedOut,
		sidebar,
		controller.cancelPrivacyProtection,
		makeLayout,
		clientRender
	);

	router(
		paths.confirmCancelDomain(),
		redirectLoggedOut,
		sidebar,
		siteSelection,
		controller.confirmCancelDomain,
		makeLayout,
		clientRender
	);

	router(
		paths.addCardDetails(),
		redirectLoggedOut,
		sidebar,
		siteSelection,
		controller.addCardDetails,
		makeLayout,
		clientRender
	);

	router(
		paths.editCardDetails(),
		redirectLoggedOut,
		sidebar,
		siteSelection,
		controller.editCardDetails,
		makeLayout,
		clientRender
	);

	/**
	 * Legacy route redirections
	 */

	// Remove site slugs
	router(
		'/me/purchases/:_/:purchaseId/:action(cancel-privacy-protection)',
		( { params: { action, purchaseId } } ) =>
			page.redirect( `/me/purchases/${ purchaseId }${ action ? `/${ action }` : '' }` )
	);

	// `/purchases` to `/me/purchases`
	router( '/purchases', () => page.redirect( paths.purchasesRoot ) );

	router(
		'/purchases/:siteName/:purchaseId/:action(cancel|cancel-private-registration|confirm-cancel-domain)?',
		( { params: { action, purchaseId, siteName } } ) => {
			switch ( action ) {
				case 'cancel':
					page.redirect( paths.cancelPurchase( siteName, purchaseId ) );
					break;

				case 'cancel-private-registration':
					page.redirect( `/me/purchases/${ siteName }/${ purchaseId }/cancel-privacy-protection` );
					break;

				case 'confirm-cancel-domain':
					page.redirect( paths.confirmCancelDomain( siteName, purchaseId ) );
					break;

				// Matches with no action (`/purchases/:siteName/:purchaseId`)
				default:
					page.redirect( paths.managePurchase( siteName, purchaseId ) );
					break;
			}
		}
	);

	router(
		'/purchases/:siteName/:purchaseId/payment/add',
		( { params: { siteName, purchaseId } } ) =>
			page.redirect( paths.addCardDetails( siteName, purchaseId ) )
	);

	router(
		'/purchases/:siteName/:purchaseId/payment/edit/:cardId',
		( { params: { siteName, purchaseId, cardId } } ) =>
			page.redirect( paths.editCardDetails( siteName, purchaseId, cardId ) )
	);

	// `/me/billing` to `/me/purchases/billing`
	router( '/me/billing/:receiptId?', ( { params: { receiptId } } ) =>
		page.redirect(
			receiptId ? paths.billingHistoryReceipt( receiptId ) : page.redirect( paths.billingHistory )
		)
	);
}
