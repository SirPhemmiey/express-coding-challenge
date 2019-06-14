const chai = require('chai');

const { expect } = chai;

const { getBooks, addBook } = require('../../controller/books');

describe('Books', () => {
    it("should get", (done) => {
        getBooks()
    });
});

// describe('Books', () => {
//   it('should get related books', (done) => {
//     // getBooks.
//   });
// });
