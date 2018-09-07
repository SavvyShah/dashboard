import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	getUserStatus,
	getAppInfo,
	setCurrentApp,
} from '../../batteries/modules/actions';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import { displayErrors } from '../../utils/helper';

class PageContainer extends React.Component {
    componentDidMount() {
        // Fetch some common api calls
		const {
			appName,
			appId,
			checkUserStatus,
			fetchAppInfo,
			updateCurrentApp,
			shouldFetchAppInfo,
			shouldFetchUserStatus,
		} = this.props;
		updateCurrentApp(appName, appId);
		if (shouldFetchUserStatus) {
			checkUserStatus();
		}
		if (shouldFetchAppInfo) {
			fetchAppInfo(appId);
		}
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		displayErrors(errors, prevProps.errors);
	}

    render() {
		const { isLoading, component, ...rest } = this.props;
			if (isLoading) {
				return <Loader />;
			}
			return React.createElement(component, rest);
    }
}
PageContainer.defaultProps = {
	isLoading: false,
	errors: [],
	shouldFetchUserStatus: true,
	shouldFetchAppInfo: true,
};
PageContainer.propTypes = {
	appName: PropTypes.string.isRequired,
	appId: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	errors: PropTypes.array,
	shouldFetchUserStatus: PropTypes.bool,
	shouldFetchAppInfo: PropTypes.bool,
	component: PropTypes.func.isRequired,
	checkUserStatus: PropTypes.func.isRequired,
	fetchAppInfo: PropTypes.func.isRequired,
	updateCurrentApp: PropTypes.func.isRequired,
};
const mapStateToProps = (state, ownProps) => {
	const appName = get(ownProps, 'match.params.appname');
	return {
		appName,
		appId: get(state, 'apps', {})[appName],
		isLoading:
			get(state, '$getUserStatus.isFetching')
			|| get(state, '$getAppInfo.isFetching'),
		errors: [
			ownProps.shouldFetchUserStatus && get(state, '$getUserStatus.error'),
			ownProps.shouldFetchAppInfo && get(state, '$getAppInfo.error'),
		],
	};
};
const mapDispatchToProps = dispatch => ({
	checkUserStatus: () => dispatch(getUserStatus()),
	fetchAppInfo: appId => dispatch(getAppInfo(appId)),
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PageContainer);

