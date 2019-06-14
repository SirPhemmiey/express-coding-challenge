const request = require('supertest');
const { expect } = require('chai');
const app = require('../../index');
const code = require('../../constants/codes');
const message = require('../../constants/messages');

// const fakeData = require('./helpers');

describe('User Operations', () => {
  it('Should sign the user in', function (done) {
    this.timeout(5000);
    const loginData = {
      email: 'oluwafemiakinde@kwasu.edu.ng',
      password: '12345'
    };
    request(app)
      .post('/users/signin')
      .send(loginData)
      .expect(code.OK)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.token).to.be.not.empty;
        expect(res.body.status).to.eq(message.SUCCESS);
        expect(res.body).to.be.an('object');
        return done();
      });
  });


  // it('Should create a new user', function (done) {
  //   this.timeout(5000);
  //   const userData = {
  //     name: 'Peter John',
  //     email: 'peterjohn@kwasu.edu.ng',
  //     role: 'student',
  //     password: '12345'
  //   };
  //   request(app)
  //     .post('/users/create')
  //     .send(userData)
  //     .expect(code.CREATED)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       expect(res.body.code).to.eq(201);
  //       expect(res.body).to.have.key(['code', 'message']);
  //       expect(res.body.message).to.be.eq(message.SUCCESS);
  //       return done();
  //     });
  // });

  it('Should throw an error if the email exist', function (done) {
    this.timeout(5000);
    const userData = {
      name: 'Peter Andrew',
      email: 'peterandrew@kwasu.edu.ng',
      role: 'student',
      password: '12345'
    };
    request(app)
      .post('/users/create')
      .send(userData)
      .expect(code.UNPROCESSABLE_ENTITY)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.code).to.eq(code.UNPROCESSABLE_ENTITY);
        expect(res.body).to.have.key(['code', 'message']);
        expect(res.body.message).to.be.eq(message.ALREADY_EXIST);
        return done();
      });
  });

  it('Should deny creating a user because the email domain does not exist', function (done) {
    this.timeout(5000);
    const userData = {
      name: 'Peter Andrew',
      email: 'peterandrew@gmail.com',
      role: 'student',
      password: '12345'
    };
    request(app)
      .post('/users/create')
      .send(userData)
      .expect(code.INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.code).to.eq(code.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.key(['code', 'message']);
        expect(res.body.message).to.be.eq(message.DOMAIN_DOES_NOT_EXIST);
        return done();
      });
  });
});
