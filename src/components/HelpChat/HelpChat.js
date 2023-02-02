import React from 'react';
import ReactDOM from 'react-dom';
import { MailOutlined, QuestionOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, notification } from 'antd';
import { css } from 'emotion';
import get from 'lodash/get';

import { heading, subHeading } from './styles';

const helpIcon = css`
	i {
		font-size: 22px !important;
		position: relative;
	}
`;

class HelpButton extends React.Component {
	constructor() {
		super();
		this.state = {
			modal: false,
			issue: '',
			details: '',
			isLoading: false,
		};
	}

	handleCancel = () => {
		this.setState({
			modal: false,
		});
	};

	handleChange = e => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	toggleLoading = () => {
		this.setState(({ isLoading }) => ({
			isLoading: !isLoading,
		}));
	};

	handleSubmitIssue = async () => {
		const { issue, details } = this.state;
		const { user } = this.props;

		const errorMessage = (
			<div>
				<p>
					There was an error in sending the issue, but we have saved
					your issue details. Click below to send a tracked e-mail to{' '}
					<a
						href={`mailto:support@appbase.io?Subject=${issue}&body=${details}`}
					>
						support@appbase.io
					</a>
					.
				</p>
				<Button
					href={`mailto:support@appbase.io?Subject=${issue}&body=${details}`}
					icon={<MailOutlined />}
					size="large"
					type="primary"
				>
					Send Mail
				</Button>
			</div>
		);
		if (issue) {
			try {
				this.toggleLoading();
				const response = await fetch(
					'https://api.hsforms.com/submissions/v3/integration/submit/4709730/389ccf8c-b434-4060-970c-0e6e8defc9c7',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							fields: [
								{
									name: 'email',
									value: get(user, 'email'),
								},
								{
									name: 'firstname',
									value: get(user, 'name'),
								},
								{
									name: 'subject',
									value: issue,
								},
								{
									name: 'content',
									value: details,
								},
							],
						}),
					},
				);

				if (response.status >= 400) {
					notification.error({ message: errorMessage, duration: 10 });
					this.toggleLoading();
				} else {
					this.toggleLoading();
					const data = await response.json();
					const displayMessage = data.inlineMessage
						.replace('<p>', '')
						.replace('</p>', '');
					message.success(displayMessage);
					this.setState({
						issue: '',
						details: '',
						modal: false,
					});
				}
			} catch (e) {
				this.toggleLoading();
				notification.error({ message: errorMessage, duration: 10 });
			}
		} else {
			message.error('Please write the issue');
		}
	};

	handleClick = e => {
		const { key } = e;
		switch (key) {
			case 'chat': {
				if (window.Intercom) {
					window.Intercom('show');
				}
				break;
			}
			case 'support':
				window.open('https://appbase.io/pricing/#support', '_blank');
				break;
			case 'twitter':
				window.open('https://twitter.com/appbaseio', '_blank');
				break;
			case 'updates':
				window.open('https://appbase.io/', '_blank');
				break;
			case 'privacy':
				window.open('https://appbase.io/privacy/', '_blank');
				break;

			case 'whats_new':
				window.open(
					'https://www.notion.so/appbase/Appbase-io-Change-Log-506702ad91c147c3a6674e988ba59f91',
					'_blank',
				);
				break;
			default:
		}
	};

	render() {
		const {
			modal, issue, details, isLoading,
		} = this.state; // prettier-ignore
		const menu = (
			<Menu onClick={this.handleClick}>
				<Menu.Item
					key="chat"
					style={{ padding: '10px 15px' }}
					className="open_intercom"
				>
					<h3 className={heading}>
						Ask us anything!{' '}
						<span role="img" aria-label="Wave">
							👋
						</span>
					</h3>
					<p className={subHeading}>We reply to every issue.</p>
				</Menu.Item>
				<Menu.Item key="support">
					<h3 className={heading}>Get Support!</h3>
				</Menu.Item>
				<Menu.Item key="whats_new">
					<p className={subHeading}>See what{`'`}s new ✨</p>
				</Menu.Item>
				<Menu.Item key="twitter">
					<p className={subHeading}>@appbaseio - Twitter</p>
				</Menu.Item>
				<Menu.Item key="privacy">
					<p className={subHeading}>Terms & Privacy</p>
				</Menu.Item>
			</Menu>
		);
		return (
			<React.Fragment>
				<Dropdown
					overlay={menu}
					trigger={['click']}
					placement="topLeft"
				>
					<Button
						className={helpIcon}
						type="primary"
						size="large"
						shape="circle"
						icon={<QuestionOutlined />}
					/>
				</Dropdown>
			</React.Fragment>
		);
	}
}

const HelpChat = props =>
	ReactDOM.createPortal(
		<HelpButton {...props} />,
		document.getElementById('help'),
	);

export default HelpChat;
