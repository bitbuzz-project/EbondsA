import { fork, all } from 'redux-saga/effects';

const combine = (sagas) =>
  function*() {
    yield all(sagas.map(fork));
  };

export default combine;
