import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Card, Skeleton, Spin } from 'antd';
import ndjsonStream from 'can-ndjson-stream';
import Editor from './Editor';
import { deployClusterStyles } from './styles';
import { ACC_API } from '../../batteries/utils';

const DeployLogs = ({ clusterId, history, showClusterDetails, dataUrl }) => {
	const [deployLogs, setDeployLogs] = useState([]);
	const [timeTaken, setTimeTaken] = useState(0);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getLogs();
	}, [clusterId]);

	const getLogs = async () => {
		const url = `${ACC_API}/v2/_deploy/${clusterId}/deploy_logs`;
		let time1 = new Date().getTime();
		setDeployLogs([]);
		try {
			const response = await fetch(
				`${ACC_API}/v2/_deploy/${clusterId}/deploy_logs`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/x-ndjson',
					},
				},
			);
			const ndjson = ndjsonStream(response.body);
			const reader = ndjson.getReader();
			let result = [];
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					let time2 = new Date().getTime();
					setTimeTaken((time2 - time1) / 1000);
					setIsLoading(false);
					break;
				}
				setIsLoading(false);
				result = [...result, { ...value }];
				setDeployLogs(result);
			}
			reader.releaseLock();
		} catch (err) {
			setIsLoading(false);
			setIsError(true);
		}
	};

	return (
		<div css={deployClusterStyles}>
			<Card
				title={
					<div className="card-title-container">
						{!isError ? (
							<div>
								Time Taken:{' '}
								{timeTaken
									? Math.round(timeTaken * 10) / 10
									: '- '}
								s
								{!timeTaken ? (
									<Spin
										size="small"
										style={{ marginLeft: 10 }}
									/>
								) : null}
							</div>
						) : null}
						{showClusterDetails ? (
							<div
								className="cluster-view-button"
								onClick={() =>
									history.push(`/clusters/${clusterId}`)
								}
							>
								View Cluster Details
							</div>
						) : null}
					</div>
				}
			>
				{isLoading ? <Skeleton active /> : <Editor logs={deployLogs} />}
			</Card>
		</div>
	);
};

DeployLogs.defaultProps = {
	showClusterDetails: true,
};

DeployLogs.propTypes = {
	showClusterDetails: PropTypes.bool,
};

export default withRouter(DeployLogs);
