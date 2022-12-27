import React from 'react';
import { DownOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Button, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { css } from 'react-emotion';

import { setCurrentApp, getAppInfo } from '../../batteries/modules/actions';

const ownerButton = css`
	margin-right: 8px;
	i {
		margin-right: 2px !important;
	}
`;

const AppSwitcher = ({
	apps,
	currentApp,
	history,
	updateCurrentApp,
	match,
	appOwner,
	user,
	fetchAppInfo,
}) => {
	const {
		params: { route },
	} = match;
	const menu = (
		<Menu
			css={{ maxHeight: 250, overflowY: 'scroll' }}
			onClick={e => {
				const appName = e.key;
				updateCurrentApp(appName, apps[appName]);
				fetchAppInfo(appName);
				history.push(`/app/${appName}/${route || ''}`);
			}}
		>
			{Object.keys(apps).map(app => (
				<Menu.Item key={app}>{app}</Menu.Item>
			))}
		</Menu>
	);
	return (
		<React.Fragment>
			<Dropdown trigger={['click']} overlay={menu}>
				<Button style={{ border: 0, boxShadow: 'none', padding: 0 }}>
					<span>{currentApp || 'Loading...'}</span>
					<DownOutlined />
				</Button>
			</Dropdown>
			{appOwner &&
				(appOwner !== user ? (
					<Tooltip
						title={`Shared by ${appOwner}`}
						trigger={['hover']}
						placement="bottom"
					>
						<Button
							className={ownerButton}
							size="small"
							shape="circle"
							icon={<ShareAltOutlined />}
						/>
					</Tooltip>
				) : null)}
		</React.Fragment>
	);
};

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) =>
		dispatch(setCurrentApp(appName, appId)),
	fetchAppInfo: appName => dispatch(getAppInfo(appName)),
});

export default connect(null, mapDispatchToProps)(AppSwitcher);
