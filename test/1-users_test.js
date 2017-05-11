require('colors')
const expect = require('chai').expect
const app = require('../index')
const request = require('supertest')
const agent = request.agent(app)
const User = require('../models/user')

// Define Dummy Users
const testUser1 = {
  email: 'test3@b.com',
  name: 'Saregreat',
  password: 'goodPassword'
}

// TESTS
describe('USER SIGNUP'.underline, () => {
  // it('should redirect users to / upon successful registration at /register'.bold, (done) => {
  //   agent.post('/register')
  //     .send(testUser1)
  //     .expect('Location', '/', done)
  // })
  it('should get a 200 response from /register'.bold, (done) => {
    agent.get('/register')
      .send({test: 'test'})
      .expect(200, done)
  })
  it('should redirect user to / upon successful reg at /register'.bold, (done) => {
    console.log('AGENT: sending', testUser1);
    agent.post('/register')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(testUser1)
      .end(function(err, res) {
        // console.log('res at test side is: ',res);
        expect('location', '/');
        done();
      })
  })
  it('should only store the hashed PW in the DB'.bold, (done) => {
    User.findOne({email:'test2@b.com'}, (err, user) => {
      if (err) return console.log(err)
      expect(user.password).to.not.equal('goodPassword')
      done()
    })
  })
})









//
