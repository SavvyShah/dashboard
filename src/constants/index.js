const USER = {
	LOAD: 'USER_LOAD',
	LOAD_SUCCESS: 'USER_LOAD_SUCCESS',
	LOAD_FAIL: 'USER_LOAD_FAIL',
};

const APPS = {
	LOAD: 'APPS_LOAD',
	LOAD_METRICS_SUCCESS: 'APPS_LOAD_METRICS_SUCCESS',
	LOAD_METRICS_FAIL: 'APPS_LOAD_METRICS_FAIL',
	APPEND: 'APPS_APPEND',
	LOAD_OWNERS: 'APPS_LOAD_OWNERS',
	LOAD_OWNERS_SUCCESS: 'APPS_LOAD_OWNERS_SUCCESS',
	LOAD_OWNERS_FAIL: 'APPS_LOAD_OWNERS_FAIL',
	REMOVE_APP: 'REMOVE_APP',
	REMOVE_APP_METRICS: 'REMOVE_APP_METRICS',
	REMOVE_APP_OWNER: 'REMOVE_APP_OWNER',
};

const CREATE_APP = {
	LOAD: 'CREATING_APP',
	LOAD_SUCCESS: 'CREATE_APP_SUCCESS',
	LOAD_FAIL: 'CREATE_APP_FAIL',
	RESET: 'CREATE_APP_RESET',
};

const DELETE_APP = {
	LOAD: 'DELETE_APP_LOAD',
};

export {
 USER, APPS, CREATE_APP, DELETE_APP,
};
