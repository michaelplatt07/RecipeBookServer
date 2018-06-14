# My Recipe Book
This is designed to be a NodeJS application that can be used to manage your recipe book.  The application is lightweight and separates the logic that queries the database from the front end display.

## Database
Currently I'm setting this up to connect to a Mongo database.  I chose this database because I found that JSON is a nice format for storing recipes.  A sample recipe could look something like this:

```
{
  "search_name": "ice_cream", 
  "text_friendly_name": "Ice Cream",
  "ingredients": [
      {
        "name": "sugar",
	"text_friendly_name": "sugar",
    	"quantity": 8,
    	"measurment": "tbsp"
      },
      {
	"name": "chocolate",
	"text_friendly_name": "chocolate",
      	"quantity": 2,
      	"measurment": "tsp"
      },
      {
	"name": "milk",
      	"text_friendly_name": "milk",
      	"quantity": 12,
      	"measurment": "oz"
      }
  ],
  "steps": [
      "Mix everything together.",
      "Tumble until solid."
  ],
  "course": [
      "dessert"
  ],
  "prep_time":
  {
    "minutes": 5,
    "hours": 0
  },
  "cook_time":
  {
    "minutes": 40,
    "hours": 2
  },
  "cuisine": [
       "american"
  ],
  "submitted_by": "User1",
  "searchable": true
}
```

The JSON format provides a nice and easy way to query the data needed and packaged up a single recipe into a single JSON object.

## Node API
This is the part of the application that has all the queries to the database.  The queries will have the standard functionality such as getting a random recipe, getting a list of recipes, getting a single recipe, storing recipes, updating, etc.  All of the CRUD components will live here.

This is also designed to be front end agnostic, meaning that any front end should be able to link into the application assuming it can make calls to NodeJS applications.  It shouldn't matter if Angular or React or any other framework is being used.  Doing so will allow for modularity and reuse of the API application in the future.

It is started by running the command `node server.js` inside the appropriate directory.

## Node UI
This is the front end/request handling part of the application.  The `express.js` file handles all incoming requests and makes the appropriate call to the `server.js` in the API application.  All routing is handled here as well.  This is built currently using Express coupled with `.ejs` files.  The `ejs` files can easily be replaced with Angular files or React, though Angular will probably be used in this particular application.

## Installing
1. Check out the application via GIT.
2. Get the MongoDB from the following URL: https://www.mongodb.com/cloud/atlas?jmp=nav
3. Make sure Mongo is installed and up and running.  This can be done through the following commands:
   TODO(map) : Finish updating the install instructions.
4. Install the modules using `npm install` on the root directory of this project.


## Testing
To run the unit tests for this application, navigate to the root directory.  From there, you can run the command `npm test` which will kickstart an entire suite of tests that cover the entire application.