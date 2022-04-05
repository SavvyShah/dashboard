import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button, Tooltip, Alert, Popover } from 'antd';
import JsonView from '../../components/JsonView';
import ErrorPage from './ErrorPage';
import { deployClusterStyles, popoverContent } from './styles';

const overflow = {
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	color: '#1890ff',
};

const PipelineTemplateScreen = ({
	formData,
	setActiveKey,
	handleFormChange,
}) => {
	const [pipelineVariables, setPipelineVariables] = useState([]);

	useEffect(() => {
		validateFormData();
	}, [formData]);

	const validateFormData = () => {
		const newPipelineVariables = formData.map(obj => {
			const newObj = {
				...obj,
				error: obj.validate ? true : false,
				errorMessage: '',
			};
			return newObj;
		});
		setPipelineVariables(newPipelineVariables);
	};

	const validateInput = pipelineObj => {
		const validateObj = Array.isArray(pipelineObj.validate)
			? pipelineObj.validate[0]
			: pipelineObj.validate;

		console.log({
			method: validateObj.method,
			headers: validateObj.headers,
			body: validateObj.body || '{}',
			credentials: 'include',
		});
		fetch(validateObj.url, {
			method: validateObj.method,
			headers: validateObj.headers,
			body: validateObj.body || '{}',
			credentials: 'include',
		})
			.then(res => {
				if (res.ok) return res.json();
				return Promise.reject({
					status: res.status,
					statusText: res.statusText,
					url: res.url,
					redirected: res.redirected,
					body: res.body,
					headers: res.headers,
					type: res.type,
				});
			})
			.then(res => {
				const newPipelineVariables = pipelineVariables.map(obj => {
					if (obj.key === pipelineObj.key) {
						obj.error = false;
					}
					return obj;
				});
				setPipelineVariables(newPipelineVariables);
			})
			.catch(err => {
				if (err.status && err.status !== validateObj.expected_status) {
					handleError(
						pipelineObj,
						`Expected status is ${validateObj.expected_status}, but received ${err.status}`,
						err,
					);
				} else {
					handleError(
						pipelineObj,
						'Cannot make the API request. Is your input valid?',
					);
				}
				console.error('Error in Validate api', err);
			});
	};

	const handleError = (pipelineObj, errorMsg, response = '') => {
		const newPipelineVariables = pipelineVariables.map(obj => {
			if (obj.key === pipelineObj.key) {
				obj.error = true;
				obj.errorMessage = errorMsg;
				if (response) obj.response = response;
			}
			return obj;
		});
		setPipelineVariables(newPipelineVariables);
	};

	const handleInputChange = (key, val) => {
		// const newPipelineVariables = [...pipelineVariables];
		// newPipelineVariables.forEach(data => {
		// 	if (data.key === key) {
		// 		data.value = val;
		// 	}
		// });
		// setPipelineVariables(newPipelineVariables);
		handleFormChange(key, val);
	};

	const errorArray = pipelineVariables.filter(i => i.error === true);

	return (
		<div css={deployClusterStyles}>
			{pipelineVariables.length ? (
				pipelineVariables.map(data => (
					<div key={data.key} style={{ padding: 20 }}>
						<div className="title-container">
							{data.label}
							{data.description ? (
								<Tooltip title={data.description}>
									<span style={{ marginLeft: 5 }}>
										<Icon type="info-circle" />
									</span>
								</Tooltip>
							) : null}
						</div>
						<div>
							<Input
								value={data.value}
								className="input-container"
								onChange={e => {
									handleInputChange(data.key, e.target.value);
								}}
							/>
							{data.validate ? (
								<Button
									type="primary"
									onClick={() => validateInput(data)}
									className="validate-button"
								>
									validate
								</Button>
							) : null}
						</div>
						{data.errorMessage ? (
							<Alert
								style={{ marginTop: 15, width: '70%' }}
								message={
									<div className="error-alert-container">
										<div>{data.errorMessage}</div>
										{data.response ? (
											<Popover
												content={
													<div css={popoverContent}>
														<JsonView
															json={data.response}
														/>
													</div>
												}
												trigger="click"
											>
												<div
													css={{
														cursor: 'pointer',
														margin: '0 7px',
														maxWidth: '95%',
														...overflow,
													}}
												>
													View the whole response
												</div>
											</Popover>
										) : null}
									</div>
								}
								type="error"
							/>
						) : null}
					</div>
				))
			) : (
				<ErrorPage message="This repository may not contain global_vars property." />
			)}
			<Button
				block
				size="small"
				type="primary"
				className="deploy-button"
				data-cy="signin-button"
				disabled={errorArray.length}
				onClick={() => {
					setActiveKey('2');
				}}
			>
				Next
			</Button>
		</div>
	);
};

PipelineTemplateScreen.defaultProps = {
	formData: [],
};

PipelineTemplateScreen.propTypes = {
	formData: PropTypes.array,
};

export default PipelineTemplateScreen;
