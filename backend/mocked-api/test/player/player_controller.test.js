const playerController = require('../../controllers/player_controller');
const Player = require('../../models/Player');
jest.mock('../../models/Player')

const req = {
  body : {
    player : {
      email : 'fuladodetal@gmail.com',
      nick : 'fulado',
      password : 'detal'
    }
  }
}

const res = {
  status : (status) => {
    return ({send : (body) => {
      let response = {}
      response.status = status;
      response.body = body;
      return response;
    }})
  }
}

const mockToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYW"

Player.find.mockImplementation(() => ({exec : () => []}));
Player.schema.methods.generateAuthToken.mockImplementation(() => mockToken)
Player.collection.save.mockImplementation(() => {Player._id="my_id"})

test("My first test", async () => {
  let result = await playerController.signup(req, res);
  console.log(result);
  expect(result.status).toBe(201);
  expect(result.body.token).toBe(mockToken);
})