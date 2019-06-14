const request = require('supertest');
const { expect } = require('chai');
const nock = require('nock');
const dotenv = require('dotenv');
const app = require('../../index');
const code = require('../../constants/codes');
const message = require('../../constants/messages');

dotenv.config();

const host = `http://localhost:${process.env.PORT}`;

describe('Unit Testing - User Operations', () => {
  it('Should sign the user in', function (done) {
    const loginData = {
      email: 'oluwafemiakinde@kwasu.edu.ng',
      password: '12345'
    };
    nock(host)
      .post('/users/login', loginData)
      .reply(200, {
        status: 'success',
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkMDI3YTZmNmFlN2ZjYWU3MzRmMmEzMSIsImVtYWlsIjoib2x1d2FmZW1pYWtpbmRlQGt3YXN1LmVkdS5uZyJ9LCJpYXQiOjE1NjA0ODMwMDgsImV4cCI6MTU2MDU2OTQwOH0.9-HYwDf1KArk4nRQZ40l-sCfjQXECmF2cudowvoEL3s'
        }
      });
    this.timeout(5000);

    request(host)
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

  it('Should create a new user', function (done) {
    nock(host)
      .post('/users/create')
      .reply(201, {
        success: 'success',
        data: { message: 'success' }
      });
    this.timeout(5000);
    const userData = {
      name: 'Peter John',
      email: 'peterjohn@kwasu.edu.ng',
      role: 'student',
      password: '12345'
    };
    request(host)
      .post('/users/create')
      .send(userData)
      .expect(code.CREATED)
      .end((err, res) => {
        console.log({ err });
        if (err) return done(err);
        expect(res.body.status).to.eq(message.SUCCESS);
        expect(res.body).to.have.key(['status', 'data']);
        expect(res.body.data.message).to.be.eq(message.SUCCESS);
        return done();
      });
  });

  it('Should throw an error if the email exist', function (done) {
    const userData = {
      name: 'Peter Andrew',
      email: 'peterandrew@kwasu.edu.ng',
      role: 'student',
      password: '12345'
    };
    nock(host)
      .post('/users/create', userData)
      .reply(code.OK, {
        code: code.UNPROCESSABLE_ENTITY,
        message: message.ALREADY_EXIST
      });
    this.timeout(5000);

    request(app)
      .post('/users/create')
      .send(userData)
      .expect(code.UNPROCESSABLE_ENTITY)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq(message.FAIL);
        expect(res.body.code).to.eq(code.UNPROCESSABLE_ENTITY);
        expect(res.body).to.have.keys(['status', 'code', 'message']);
        expect(res.body.message).to.be.eq(message.ALREADY_EXIST);
        return done();
      });
  });

  it('Should deny creating a user because the email domain does not exist', function (done) {
    const userData = {
      name: 'Peter Andrew',
      email: 'peterandrew@gmail.com',
      role: 'student',
      password: '12345'
    };
    nock(host)
      .post('/users/create', userData)
      .reply(code.OK, {
        code: code.INTERNAL_SERVER_ERROR,
        message: message.DOMAIN_DOES_NOT_EXIST
      });
    this.timeout(5000);
    request(host)
      .post('/users/create')
      .send(userData)
      .expect(code.INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq(message.FAIL);
        expect(res.body.code).to.eq(code.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.keys(['status', 'code', 'message']);
        expect(res.body.message).to.be.eq(message.DOMAIN_DOES_NOT_EXIST);
        return done();
      });
  });
});
