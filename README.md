# My Recipe Book
This is designed to be a NodeJS application that can be used to manage your recipe book.  The application is lightweight and separates the logic that queries the database from the front end display.

## Running/Configuring Application


## Database
Currently I'm setting this up to connect to a Mongo database.  I chose this database because I found that JSON is a nice format for storing recipes.  A sample recipe could look something like this:

```
{
  "search_name": "ice_cream", // This is created by the application and wouldn't be passed.
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
  "courses": [
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
  "cuisines": [
       "american"
  ],
  "submitted_by": "User1", // This would be grabbed from the headers.
  "searchable": true
}
```

Users can build grocery lists by selected a variety of recipes and opting to build their shopping list.  A grocery list would look something like this:
```
{
	"user": "test.user",
	"recipes": [
		   "id 1",
		   "id 2",
		   "id 3"
	]
}
```

In an attempt to standardize how the grocery list will display relevant units of information for ingredients, the application updates its ingredients collection every time a new recipe is added.  It parses out each ingredient, gets the measurement, and runs through a series of calculations to determine what the most commonly used measurment for an ingredient would be (ie. cups for milk, tsp for pepper, etc.).  A sample of an entry in the ingredients collection would look like so:
```
{
	"text_friendly_name" : "Ingredient 2",
	"name" : "ingredient_2",
	"most_used_measurement" : "c",
	"total_measurements_added" : 3,
	"measurement_ratios" : [
		{
			"measurement" : "oz",
			"percentage" : "0.33",
			"count" : 1
		},
		{
			"measurement" : "c",
			"percentage" : "0.67",
			"count" : 2
		}
	]
}
```
<b>NOTE:</b> This collection should never be modified by the admin of the application as the values are updated automatically by the application.  In the even an admin does want to update an entry, they can do so to modify percentages, counts, etc. to get the desired results.

## Installing
1. Check out the application via GIT.
2. Get the MongoDB from the following URL: https://www.mongodb.com/cloud/atlas?jmp=nav
3. Make sure Mongo is installed and up and running.
4. Install the modules using `npm install` on the root directory of this project.
5. Import the default database documents in the `/dumps` directory with the following command:
    * `mongoimport --db <db_name> --collection <collection_name> --file <file_name.json>`
    * You can dump more recent versions of the files with this command: `mongoexport --db <db_name> --collection <collection_name> --file <file_name.json>`
6. Once the modules have been installed the application should be all set to run.  Navigate to the directory of the application and run via the command `npm start`.

## Testing
To run the unit tests for this application, navigate to the root directory.  From there, you can run the command `npm test` which will kickstart an entire suite of tests that cover the entire application.

## Allowing Emails through NodeMailer
This will not currently work unless the email account for the NARA gmail has the "Less Secure App Access" enabled.  This feature can be found by searching for that name under the profile management.

## Generating Certs
Follow these steps to generate keys and certifications to be used in the API.

NOTE: This has only been tested for Linux distributions.

1. `sudo openssl genrsa -des3 -out server.key 2048`
2. `sudo openssl req -new -key server.key -out server.csr`
3. `sudo openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt`
4. `sudo openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365`
5. `sudo openssl rsa -in keytmp.pem -out key.pem`

## Testing
Testing can be ran through the `npm test` command.  If this test is ran, there will be an output directory called `coverage` that will be created in the project.  Within this directory there is an `index.html` file.  Open this file to see a prettified version of the code coverage broken down by each file.  There is additional documentation that can be found on the NYC site linked here: https://www.npmjs.com/package/nyc

## Docker
Within the project is a `Dockerfile` file that can be used to build a docker container within the application.  This docker file will take care of setting up a few things including:

1. MongoDB
2. NodeJs V 10
3. NVM
4. Exposes ports 3000 and 27017 (allows host to connect front end to application should they deisre)
5. Copies the server code to the container
6. Installs VIM and Emacs for text editors

To create the docker image locally simply use the command `docker build -t USER_NAME/IMAGE_NAME .` where your username and image name replace the place holders

### Current shortcomings with Dockerfile
1. Mongo isn't autmatically started.  The developer has to go into the container and run `mongod` to start it, then he/she will be able to connect to the local mongo host.
2. There is no docker image on docker hub.  This needs to be pushed up so people can simply download the image instead of having to build locally.
