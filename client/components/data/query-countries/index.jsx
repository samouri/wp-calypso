/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
//import { isKeyringConnectionsFetching } from 'state/sharing/keyring/selectors';
import { requestDomainCountries } from 'state/countries/actions';

class QueryCountries extends Component {
	static propTypes = {
		isRequesting: PropTypes.bool.isRequired,
		requestCountries: PropTypes.func.isRequired,
	};

	componentWillMount() {
		if ( !this.props.isRequesting ) {
			this.props.requestCountries();
		}
	}

	render() {
		return null;
	}
}

export default connect(
	state => ( {
		isRequesting: false,
	} ),
	{
		requestCountries: requestDomainCountries,
	}
)( QueryCountries );
