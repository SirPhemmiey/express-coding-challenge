const request = require('supertest');
const { expect } = require('chai');
const app = require('../../index');
const code = require('../../constants/codes');
const message = require('../../constants/messages');

let token = null;
describe('Books Operations', () => {
  beforeEach('This gets the auth token and runs before the test below', function (done) {
    this.timeout(5000);
    const loginData = {
      email: 'oluwafemiakinde@kwasu.edu.ng',
      password: '12345'
    };
    request(app)
      .post('/users/signin')
      .send(loginData)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.data.token;
        expect(res.body.data.token).to.be.not.empty;
        expect(res.body.status).to.eq(message.SUCCESS);
        expect(res.body).to.be.an('object');
        return done();
      });
  });

  it('Should get list of books that the user has access to via their Institution', (done) => {
    request(app)
      .get('/books/get')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(code.OK)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq(message.SUCCESS);
        expect(res.body.data).to.have.key(['books']);
        expect(res.body.data.books).to.be.an('array');
        return done();
      });
  });

  it('Should add a book to the collection', (done) => {
    const bookData = {
      isbn: '978-055359370112',
      author: 'LA. LA. LA',
      title: 'Spondoral',
      institution: '5d02a726b45d10c03e4c6049'
    };
    request(app)
      .post('/books/add')
      .send(bookData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq(message.SUCCESS);
        expect(res.body.data).to.have.key(['message']);
        expect(res.body.data.message).to.eq(message.SUCCESS);
        expect(res.body).to.be.an('object');
        return done();
      });
  });

  it('Should throw a missing argument error', (done) => {
    const bookData = {
      isbn: '978-055359370121',
      author: 'Dan More',
      title: 'Mister'
    };
    request(app)
      .post('/books/add')
      .send(bookData)
      .expect(code.INVALID_INPUT_PARAMS)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq(message.FAIL);
        expect(res.body).to.be.an('object');
        return done();
      });
  });
});
