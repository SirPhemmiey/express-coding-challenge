const fake = require('faker');

const data = {
  name: fake.name.firstName(),
  email: fake.internet.email(),
  role: fake.internet.jobTitle(),
  password: fake.internet.password()
};

module.exports = data;
