import { LOCATION_CHANGE } from 'connected-react-router';

export default () => (next) => (action) => {
  const { type } = action;
  if (type === LOCATION_CHANGE) {
    window.scrollTo(0, 0);
  }
  return next(action);
};
