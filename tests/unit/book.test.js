// const chai = require('chai');
// const nock = require('nock');
// const app = require('../../index');

// const { expect } = chai;
// const token = null;
// describe('Unit Testing - Book Operations', () => {
//   beforeEach((done) => {
//     this.timeout(5000);
//     const loginData = {
//       email: 'oluwafemiakinde@kwasu.edu.ng',
//       password: '12345'
//     };
//     nock('http://localhost:8001')
//       .post('/users/signin', loginData)
//       .reply(200, {
//         status: 'success',
//         data: {
//           token:
//             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkMDI3YTZmNmFlN2ZjYWU3MzRmMmEzMSIsImVtYWlsIjoib2x1d2FmZW1pYWtpbmRlQGt3YXN1LmVkdS5uZyJ9LCJpYXQiOjE1NjA0NTAwNjYsImV4cCI6MTU2MDUzNjQ2Nn0.c_dcOp6BiXolsPJhLvF7wT51t9KA8KSHb_MMlZBFuts'
//         }
//       });
//     return done();
//   });

//   // it("okok", done => {

//   // })

//   // it('Should get list of books that the user has access to via their Institution', (done) => {
//   //   nock('http://localhost:8001')
//   //     .get('/books/get')
//   //     .reply(200, {
//   //       status: 'success',
//   //       data: {
//   //         books: [
//   //           {
//   //             _id: '5d02ada44ca61a6360ee5ff4',
//   //             isbn: '978-0553593711',
//   //             title: 'A Game of Titles',
//   //             author: 'Martha W. L. Oken',
//   //             institution: '5d02a726b45d10c03e4c6049'
//   //           },
//   //           {
//   //             _id: '5d02bd19078e416ee5e6b3e1',
//   //             isbn: '978-0553593700',
//   //             title: 'Spiderman',
//   //             author: 'Pater L. L. Parker',
//   //             institution: '5d02a726b45d10c03e4c6049'
//   //           }
//   //         ]
//   //       }
//   //     });
//   // });
// });

const request = require('supertest');
const { expect } = require('chai');
const nock = require('nock');
const dotenv = require('dotenv');
const app = require('../../index');
const code = require('../../constants/codes');
const message = require('../../constants/messages');

dotenv.config();

const host = `http://localhost:${process.env.PORT}`;

describe('Books Operations', () => {
  beforeEach('This gets the auth token and runs before the test below', function (done) {
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
      .get('/users/login')
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
    nock(host)
      .get('/books/get')
      .reply(200, {
        status: 'success',
        data: {
          books: [
            {
              _id: '5d02ada44ca61a6360ee5ff4',
              isbn: '978-0553593711',
              title: 'A Game of Titles',
              author: 'Martha W. L. Oken',
              institution: '5d02a726b45d10c03e4c6049'
            },
            {
              _id: '5d02bd19078e416ee5e6b3e1',
              isbn: '978-0553593700',
              title: 'Spiderman',
              author: 'Pater L. L. Parker',
              institution: '5d02a726b45d10c03e4c6049'
            }
          ]
        }
      });
    request(host)
      .get('/books/get')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.eq(message.SUCCESS);
        expect(res.body.data).to.have.key(['books']);
        expect(res.body.data.books).to.be.an('array');
        return done();
      });
  });

  // it('Should add a book to the collection', (done) => {
  //   const bookData = {
  //     isbn: '978-055359370112',
  //     author: 'LA. LA. LA',
  //     title: 'Spondoral',
  //     institution: '5d02a726b45d10c03e4c6049'
  //   };
  //   request(app)
  //     .post('/books/add')
  //     .send(bookData)
  //     .expect(201)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       expect(res.body.status).to.eq(message.SUCCESS);
  //       expect(res.body.data).to.have.key(['message']);
  //       expect(res.body.data.message).to.eq(message.SUCCESS);
  //       expect(res.body).to.be.an('object');
  //       return done();
  //     });
  // });

  // it('Should throw a missing argument error', (done) => {
  //   const bookData = {
  //     isbn: '978-055359370121',
  //     author: 'Dan More',
  //     title: 'Mister'
  //   };
  //   request(app)
  //     .post('/books/add')
  //     .send(bookData)
  //     .expect(code.INVALID_INPUT_PARAMS)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       expect(res.body.status).to.eq(message.FAIL);
  //       expect(res.body).to.be.an('object');
  //       return done();
  //     });
  // });
});
