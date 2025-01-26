const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
    it('should return a user with valid email', () => {
      const user = getUserByEmail("user1@example.com", testUsers);
      const expectedOutput = "userRandomID";
      assert.strictEqual(user.id, expectedOutput);
    });
  
    it('should return undefined with an invalid email', () => {
      const user = getUserByEmail("nonexistent@example.com", testUsers);
      assert.isUndefined(user);
    });
  });