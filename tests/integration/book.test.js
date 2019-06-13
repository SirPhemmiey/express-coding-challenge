const request = require('supertest');
const { expect } = require('chai');
const app = require('../../index');

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
        expect(res.body.status).to.eq('success');
        expect(res.body).to.be.an('object');
        return done();
      });
  });

  it('Should get list of books that the user has access to via their Institution', (done) => {
    request(app)
      .get('/books/get')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq('success');
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
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.eq('success');
        expect(res.body.status).to.eq('success');
        expect(res.body).to.be.an('object');
        return done();
      });
  });
});
