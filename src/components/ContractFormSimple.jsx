import React, { useState, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { contractCall } from './Contractor';
import { TextField } from '@material-ui/core';
import Button from './Button';
import AddIcon from '@material-ui/icons/Add';
import update from 'react-addons-update';
import AddressQRreader from './AddressQRreader';

// this is called like that in historical reference to the ContractForm that we (DLT4PI 2019)
// copied from some truffle/drizzle repo and bend it to our needs for way too long :)
function ContractFormSimple(props, context) {
	const { t } = useTranslation();

	const [isReady, setIsReady] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		if (isReady) {
			return;
		}
		let dataObj = [];
		for (let i = 0; i < props.fields.length; i++) {
			let label = props.fields[i][0];
			if (props.fixValues && props.fixValues[label]) {
				dataObj.push(props.fixValues[label]);
			} else {
				dataObj.push('');
			}
		}
		setData(dataObj);
		setIsReady(true);
	});

	const doContractCall = () => {
		contractCall(
			context,
			props,
			props.store.getState().fin4Store.defaultAccount,
			props.contractName,
			props.contractMethod,
			data,
			props.pendingTxStr ? props.pendingTxStr : props.contractMethod + '()',
			props.callbacks,
			props.skipDryRun ? props.skipDryRun : false
		);
	};

	const updateVal = (index, val) => {
		setData(
			update(data, {
				[index]: { $set: val }
			})
		);
	};

	return (
		<span style={{ fontFamily: 'arial' }}>
			{isReady ? (
				<>
					{props.fields.map((field, index) => {
						let label = field[0]; // TODO translate
						let type = field[1];
						if (props.fixValues && props.fixValues[label]) {
							return;
						}
						if (type === 'address') {
							return <AddressQRreader key={index} onChange={val => updateVal(index, val)} label={label} />;
						}
						return (
							<TextField
								key={index}
								type={type}
								label={label}
								value={data[index]}
								onChange={e => updateVal(index, e.target.value)}
								style={inputFieldStyle}
							/>
						);
					})}
					<Button icon={AddIcon} onClick={doContractCall} center="true">
						{t('contract-form-simple.submit-button')}
					</Button>
				</>
			) : (
				'Loading...'
			)}
		</span>
	);
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

ContractFormSimple.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(ContractFormSimple, mapStateToProps);
