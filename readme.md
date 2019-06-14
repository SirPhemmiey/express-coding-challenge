# Express Code Challenge

## Prerequisites

* [Node.JS (10.12 or higher)](https://nodejs.org/en/)
* [MySQL (5.7 or higher)](https://www.mysql.com/downloads/)
* [Redis](https://redis.io/)

### Installing
* Run: ```git clone https://github.com/SirPhemmiey/express-coding-challenge```
* Navigate to the project directory ```cd express-coding-challenge```
* Run: ```npm install``` or ```yarn``` to install dependencies
* Create a .env file in your root directory and copy content from ```.env.sample``` file to ```.env``` file and set environment variables with the appropriate values
* Set your approprate mongoDb connection


### Running
* Run: ```npm start``` or ```yarn start```

## Endpoints

https://documenter.getpostman.com/view/3683187/S1Zw6V89

### Authentication:

`POST /users/signin`

Example Request body:
```
{
	"email": "oluwafemiakinde@kwasu.edu.ng",
	"password": "12345"
}
```
Authenticates a user then returns a token.

Required fields: `email`, `password`

## Create User:

`POST /users/create`

Example Request body:
```
{
	"name": "Oluwafemi Akinde",
	"email": "oluwafemiakinde@kwasu.edu.ng",
	"role": "student",
	"password": "12345"
}
```
No authentication required, returns a success message

Required fields: `name`, `email`, `role`, `password`

## Add a book:

`POST /books/add`

Example Request body:
```
{
	"isbn": "978-0553593700",
	"author": "Pater L. L. Parker",
	"title": "Spiderman",
	"institution": "5d02a726b45d10c03e4c6049"
}
```

No Authentication required, returns a success message

Required fields: `isbn`, `author`, `title`, `institution`

## Add an institution:

`POST /institution/add`

Example Request body:
```
{
	"name": "University of Rwanda",
	"url": "https://rwanda.edu.ng",
	"emailDomain": "rwanda.edu.ng"
}
```

No Authentication required, returns a success message

Required fields: `name`, `url`, `emailDomain`


## Get all Institutions:

`GET /Institution/get`

No Authentication required, returns a success message and institution array

## Get all books:

`GET /books/get`

No Authentication required, returns a success message and books array


### Running Test

* Run the command `yarn test` OR `npm test` to run the test

### Code Coverage

* To see code coverage, go to ```/coverage/index.html``` and view with a browser



