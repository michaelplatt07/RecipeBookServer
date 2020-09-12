#!/bin/bash
clear
echo "Loading data into database..."
echo "Loading course..."
mongoimport --db devRecipeDb --collection courses --file ../dumps/courses_dump.json
echo "Loaded courses"
echo
echo "Loading measurements..."
mongoimport --db devRecipeDb --collection measurements --file ../dumps/measurements_dump.json
echo "Loaded measurements"
echo
echo "Loading categories..."
mongoimport --db devRecipeDb --collection categories --file ../dumps/categories_dump.json
echo "Loaded categories"
echo
echo "Loading cuisines..."
mongoimport --db devRecipeDb --collection cuisines --file ../dumps/cuisines_dump.json
echo "Loaded cuisines"
echo
echo "Loading serving sizes..."
mongoimport --db devRecipeDb --collection serving_sizes --file ../dumps/serving_sizes_dump.json
echo "Loaded serving sizes"
echo
echo "Loading categories..."
mongoimport --db devRecipeDb --collection categories --file ../dumps/categories_dump.json
echo
echo "Finished loading dev database."
