const expressMocks = require('../mocks/express');
const playerController = require('../../controllers/player_controller');
const httpUtils = require('../../util/http-utils');

/**
 * @description helper for signing up the user and returns 
 * @param {Object} credentials - to perform login
 * @returns {[req, res]} mocks for inspections
 */
const doSignup = credentials => {
  const [req, res] = [expressMocks.req(), expressMocks.res()];
  req.body = { player: credentials };
  playerController.signup(req, res);
  return [req, res];
}

const defaultCredentials = Object.freeze({
  email: 'foo@bar.mail',
  password: 'hardpass',
  nick: 'arraymassa'
});

it('should succesfully create an user', async () => {
  const [req, res] = doSignup(defaultCredentials);
  expect(res.status).toBeCalled();
  expect(httpUtils.status.isSuccess(res.mock.calls[0][0])).toBeTruthy();
  
  expect(res.json).toBeCalled();
});


it('should throw an error when creating two users with same credentials', async () => {
  // TODO: mock db to add some state;
  doSignup(defaultCredentials);
  const [req, res] = doSignup(defaultCredentials);
  
  expect(res.status).toBeCalled();
  expect(httpUtils.status.isSuccess(res.mock.calls[0][0])).toBeTruthy();
  
  expect(res.json).toBeCalled();
});