import { call, take, fork } from 'redux-saga/effects';

const takeFirst = (patternOrChannel, saga, ...args) =>
  fork(function*() {
    while (true) {
      // eslint-disable-line
      const action = yield take(patternOrChannel);
      yield call(saga, ...args.concat(action));
    }
  });

export default takeFirst;
