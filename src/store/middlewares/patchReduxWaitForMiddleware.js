import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';

import { GENERIC_REQUEST_ERROR } from '../../consts';

export default () => (next) => (action) => {
  if (action[WAIT_FOR_ACTION] && !action[ERROR_ACTION]) {
    const newAction = { ...action, [ERROR_ACTION]: GENERIC_REQUEST_ERROR };
    return next(newAction);
  }

  return next(action);
};
