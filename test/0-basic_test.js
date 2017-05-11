require('colors')
const expect = require('chai').expect
const app = require('../index')
const request = require('supertest')
const agent = request.agent(app)
const User = require('../models/user')

describe('BASIC GET TESTS'.underline, () => {
  it('should get a 200 response from /'.bold, (done) => {
    agent.get('/')
      .expect(200, done)
  })
})
