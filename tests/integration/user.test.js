const request = require('supertest');
const { expect } = require('chai');
const app = require('../../index');

describe('User Operations', () => {
  // beforeEach('', function (done) {
  //   this.timeout(5000);
  //   return done();
  // });
  // it('Should sign the user in', (done) => {
  //   const loginData = {
  //     email: 'oluwafemiakinde@kwasu.edu.ng',
  //     password: '12345'
  //   };
  //   request(app)
  //     .post('/users/signin')
  //     .send(loginData)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       expect(res.body.data.token).to.be.not.empty;
  //       expect(res.body.status).to.eq('success');
  //       expect(res.body).to.be.an('object');
  //       return done();
  //     });
  // });

  it('Should create a new user', function (done) {
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
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.code).to.eq(201);
        expect(res.body).to.have.key(['code', 'message']);
        expect(res.body.message).to.be.eq('success');
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
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.code).to.eq(500);
        expect(res.body).to.have.key(['code', 'message']);
        expect(res.body.message).to.be.eq(
          'Your email domain does not exist. Please make sure your institution has been added'
        );
        return done();
      });
  });
});
