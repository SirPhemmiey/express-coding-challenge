const request = require('supertest');
const { expect } = require('chai');
const app = require('../../index');
const code = require('../../constants/codes');
const message = require('../../constants/messages');

require('../helper/seeder');

describe('User Operations', () => {
    it('Should create a new user', function(done) {
        this.timeout(5000);
        const userData = {
            name: 'Peter John',
            email: 'peterjohn@kwasu.edu.ng',
            role: 'student',
            password: '12345'
        };
        request(app)
            .post('/users/create')
            .send(userData)
            //.expect(code.CREATED)
            .end((err, res) => {
                if (err) return done(err);
                console.log("NEW US>>", res.body);
                expect(res.body.status).to.eq(message.SUCCESS);
                expect(res.body).to.have.key(['status', 'data']);
                expect(res.body.data.message).to.be.eq(message.SUCCESS);
                return done();
            });
    });

    it('Should throw an error if the email exist', function(done) {
        this.timeout(5000);
        const userData = {
            name: 'Peter Andrew',
            email: 'peterjohn@kwasu.edu.ng',
            role: 'student',
            password: '12345'
        };
        request(app)
            .post('/users/create')
            .send(userData)
            //.expect(code.UNPROCESSABLE_ENTITY)
            .end((err, res) => {
                if (err) return done(err);
                console.log("THROEE>>", res.body);
                expect(res.body.status).to.eq(message.FAIL);
                expect(res.body.code).to.eq(code.UNPROCESSABLE_ENTITY);
                expect(res.body).to.have.keys(['status', 'code', 'message']);
                expect(res.body.message).to.be.eq(message.ALREADY_EXIST);
                return done();
            });
    });

    it('Should deny creating a user because the email domain does not exist', function(done) {
        this.timeout(5000);
        const userData = {
            name: 'Peter Jogn',
            email: 'peterjohn@gmail.com',
            role: 'student',
            password: '12345'
        };
        request(app)
            .post('/users/create')
            .send(userData)
            //.expect(code.INTERNAL_SERVER_ERROR)
            .end((err, res) => {
                if (err) return done(err);
                console.log("DENY>>", res.body);
                expect(res.body.status).to.eq(message.FAIL);
                expect(res.body.code).to.eq(code.INTERNAL_SERVER_ERROR);
                expect(res.body).to.have.keys(['status', 'code', 'message']);
                expect(res.body.message).to.be.eq(message.DOMAIN_DOES_NOT_EXIST);
                return done();
            });
    });

    it('Should sign the user in', function(done) {
        this.timeout(5000);
        const loginData = {
            email: 'peterjohn@kwasu.edu.ng',
            password: '12345'
        };
        request(app)
            .post('/users/signin')
            .send(loginData)
            //.expect(code.OK)
            .end((err, res) => {
                if (err) return done(err);
                console.log("SIGN IN>>", res.body);
                expect(res.body.data.token).to.be.not.empty;
                expect(res.body.status).to.eq(message.SUCCESS);
                expect(res.body).to.be.an('object');
                return done();
            });
    });
});