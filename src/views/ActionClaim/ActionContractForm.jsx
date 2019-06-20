// adopted from https://github.com/trufflesuite/drizzle-react-components/blob/develop/src/ContractForm.js

import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const translateType = type => {
	switch (true) {
		case /^uint/.test(type):
			return 'number';
		case /^string/.test(type) || /^bytes/.test(type):
			return 'text';
		case /^bool/.test(type):
			return 'checkbox';
		default:
			return 'text';
	}
};

class ClaimStatuses extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.state = {
			dataKey: this.contracts.Fin4BaseToken.methods.getStatusesOfMyClaims.cacheCall()
		};
	}

	render() {
		if (!this.props.contracts.Fin4BaseToken.initialized) {
			return <span>Initializing...</span>;
		}

		if (
			!(
				this.state.dataKey in
				this.props.contracts.Fin4BaseToken.getStatusesOfMyClaims
			)
		) {
			return <span>Fetching...</span>;
		}

		var pendingSpinner = this.props.contracts.Fin4BaseToken.synced ? '' : ' 🔄';

		var displayData = this.props.contracts.Fin4BaseToken.getStatusesOfMyClaims[
			this.state.dataKey
		].value;
		var claimIdsArr = displayData[0];
		var isApprovedArr = displayData[1];

		const displayListItems = claimIdsArr.map((claimId, index) => {
			return (
				<li key={index}>
					claim #{`${claimId}`}: {`${isApprovedArr[index]}`}
					{pendingSpinner}
				</li>
			);
		});

		return <ul>{displayListItems}</ul>;
	}
}

ClaimStatuses.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ClaimStatuses, mapStateToProps);