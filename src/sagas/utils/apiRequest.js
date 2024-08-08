import { call } from 'redux-saga/effects';

import { API_BASE } from 'consts';
import request from 'utils/request';

function processUrl(url) {
    return url.startsWith('/') ? `${API_BASE}${url}` : url;
}

function* apiRequest(url, options) {
    const newOptions = Object.assign({ headers: {} }, options);
    url.startsWith('/') &&
        (newOptions.headers['Authorization'] = options.headers.Authorization);
    try {
        const payload = yield call(request, processUrl(url), newOptions);
        return payload;
    } catch (error) {
        // TODO: handle error
        throw error;
    }
}

export default apiRequest;
