const ObjectID = require('mongodb').ObjectID;

exports.sampleUser = {
    _id : ObjectID("5c080b0e92b3f41495142cf4"),
    "username": "testUser",
    "password": "$2a$10$/VULTax5OODCACI8Zh329.kYDwrBc7Wii4c1wFAYMWulzU2ERBkeK",
    "active": false
};

exports.sampleRecipe1 = {
    _id: ObjectID("5b69bea0d125e430b8d6eca2"),
    "search_name": "mikes_mac_and_cheese",
    "text_friendly_name": "Mikes Mac and Cheese",
    "ingredients": [
        {
            "name": "elbow_noodles",
            "text_friendly_name": "elbow noodles",
            "quantity": 12,
            "measurement": "oz"
        },
        {
            "name": "cheddar_cheese",
            "text_friendly_name": "cheddar cheese",
            "quantity": 6,
            "measurement": "oz"
        },
        {
            "name": "gouda_cheese",
            "text_friendly_name": "gouda cheese",
            "quantity": 6,
            "measurement": "oz"
        },
        {
            "name": "milk",
            "text_friendly_name": "milk",
            "quantity": 2,
            "measurement": "oz"
        }
    ],
    "steps": [
        "Bring water to a boil",
        "Cook noodels until al dente.",
        "Add the milk and cheeses and melt down.",
        "Stir constantly to ensure even coating and serve."
    ],
    "courses": [
        "dinner",
        "lunch",
        "side"
    ],
    "prep_time": {
        "minutes": 15,
        "hours": 0
    },
    "cook_time":{
        "minutes": 25,
        "hours": 1
    },
    "cuisines": [
        "italian"
    ],
    "categories": [
        "pasta",
        "poultry"
    ],
    "serving_sizes": "1 - 2",
    "submitted_by": "User1",
    "searchable": true,  
    "rating": 0
};

exports.sampleRecipe2 = {
    _id: ObjectID("5b69bea0d125e430b8d6eca3"),
    "search_name": "ice_cream",
    "text_friendly_name": "Ice Cream",
    "ingredients": [
        {
            "name": "sugar",
            "text_friendly_name": "sugar",
            "quantity": 8,
            "measurment": "Tbsp"},
        {
            "name": "vanilla",
            "text_friendly_name": "vanilla",
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
    "prep_time": {
        "minutes": 5,
        "hours": 0
    },
    "cook_time": {
        "minutes": 40,
        "hours": 2
    },
    "cuisines": [
        "american"
    ],
    "categories": [
        "meat"
    ],
    "serving_sizes": "3 - 4",
    "submitted_by": "User1",
    "searchable": true,  
    "rating": 0
};

exports.sampleCuisines = [
    {
        name: "American",
        search_name: "american"
    }
    ,{
        name: "Japanese",
        search_name: "japanese"
    }  
];

exports.sampleIngredients = [
    {
        "name": "elbow_noodles",
        "text_friendly_name": "elbow noodles",
        "most_used_measurement": "oz",
        "total_measurements_added": 1,
        "measurement_ratios": [
            {
                "measurement": "oz",
                "percentage": 1,
                "count": 1
            }
        ],
    },
    {
        "name": "cheddar_cheese",
        "text_friendly_name": "cheddar cheese",
        "most_used_measurement": "oz",
        "total_measurements_added": 1,
        "measurement_ratios": [
            {
                "measurement": "oz",
                "percentage": 1,
                "count": 1
            }
        ],
    },
    {
        "name": "gouda_cheese",
        "text_friendly_name": "gouda cheese",
        "most_used_measurement": "oz",
        "total_measurements_added": 1,
        "measurement_ratios": [
            {
                "measurement": "oz",
                "percentage": 1,
                "count": 1
            }
        ],
    },
    {
        "name": "milk",
        "text_friendly_name": "milk",
        "most_used_measurement": "oz",
        "total_measurements_added": 1,
        "measurement_ratios": [
            {
                "measurement": "oz",
                "percentage": 1,
                "count": 1
            }
        ],
    }
];


exports.sampleMeasurements = [
    {
        name: "Tbsp"
    },
    {
        name: "c"
    },
    {
        name: "tsp"
    },
    {
        name: "oz"
    }
];

exports.sampleCourses = [
    {
        name: "Breakfast",
        search_name: "breakfast"
    },
    {
        name: "Lunch",
        search_name: "lunch"
    }
];

exports.sampleCategories = [
    {
        name: "Poultry",
        search_name: "poulty"
    },
    {
        name: "Meat",
        search_name: "meat"
    }
];

exports.sampleServingSizes = [
    {
        display_range: "1 - 2",
        search_range: "1, 2"
    },
    {
        display_range: "3 - 4",
        search_range: "3, 4"
    }
];
