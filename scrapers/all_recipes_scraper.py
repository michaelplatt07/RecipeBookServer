import requests
import json
from bs4 import BeautifulSoup

import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.INFO)

unicode_fraction_dict = {
    b'\xbd':'1/2',
    b'\x2153':'1/3',
    b'\x2154':'2/3',
    b'\xbc':'1/4',
    b'\xbe':'3/4',
    b'\x2155':'1/5',
    b'\x2156':'2/5',
    b'\x2157':'3/5',
    b'\x2158':'4/5',
    b'\x2159':'1/6',
    b'\x215a':'5/6',
    b'\x2150':'1/7',
    b'\x215b':'1/8',
    b'\x215c':'3/8',
    b'\x215d':'5/8',
    b'\x215e':'7/8',
    b'\x2151':'1/9',
    b'\x2152':'1/10',
    b'\x2189':'0/3'
}

converted_recipe = {}
step_list = []
ingredient_list = []

URL = sys.argv[1]
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')

converted_recipe['text_friendly_name'] = soup.find(class_ = 'intro').text.strip()
converted_recipe['description'] = soup.find(class_ = 'recipe-summary').text.strip()

meta_info = soup.find(class_ = 'recipe-info-section').text.strip().split()
logging.debug(meta_info)
# TODO(map) : This is ugly.  Consider refactoring to something better.  Might need to have client specific cases though.
# TODO(map) : Consider unifying the cases (maybe all lower) in case this isn't uniform across the site
# TODO(map) : Could have hours and minutes? May need to convert minutes to hour/minutes combination.  Find other recipes to test
for index, info in enumerate(meta_info):
    if info == 'prep:':
        converted_recipe['prep_time'] = dict([('minutes', meta_info[index + 1])])
    elif info == 'cook:':
        converted_recipe['cook_time'] = dict([('minutes', meta_info[index + 1])])
    elif info == 'Servings:':
        converted_recipe['serving_sizes'] = meta_info[index + 1]

# Start parsing the bulk of the recipe information. Mainly get the directions and ingredients here.
recipe_body = soup.find(id='recipe-body')
logging.debug("Prettified Version of Recipe")
logging.debug(recipe_body.prettify())

# Directions section
directions_body = soup.find(class_='instructions-section')
logging.debug("Prettified Version of Directions")
logging.debug(directions_body.prettify())
directions = directions_body.find_all('li')
logging.debug(directions)

# Ingredients section
ingredients_body = soup.find(class_='ingredients-section')
logging.debug("Prettified Version of Ingredients")
logging.debug(ingredients_body.prettify())
ingredients = ingredients_body.find_all('li')

# Build step data
for i, item in enumerate(directions):
    step_list.append(item.find('p').text)
    logging.debug('Formatted step: {} - {}'.format(i, item.find('p').text))

# Build and format ingredient data data
for ingredient in ingredients:
    ingredient_text = ingredient.text.strip().split()
    formatted_amount = ''
    remainder_text = ''
    for ingredient_component in ingredient_text:
        encoded_ingredient_component = ingredient_component.encode(encoding='UTF-8')
        if encoded_ingredient_component.isdigit(): # Just a plain old number
            formatted_amount += ' ' + encoded_ingredient_component.decode('UTF-8')
        elif b'\xc2' in encoded_ingredient_component: # Checking in byte strings for HTML formatted fractions
            ingredient_amount = encoded_ingredient_component.replace(b'\xc2', b'')
            if ingredient_amount in unicode_fraction_dict.keys():
                converted_fraction_text = unicode_fraction_dict.get(ingredient_amount)
                formatted_amount += ' ' + converted_fraction_text
        else:
            remainder_text += " " + ingredient_component
    ingredient_list.append(formatted_amount.strip() + ' ' + remainder_text.strip())
    logging.debug('Formatted ingredient: {} {}'.format(formatted_amount.strip(), remainder_text.strip()))

converted_recipe['steps'] = step_list
converted_recipe['ingredients'] = ingredient_list # TODO(map) : This still isn't done being formatted but for now gives something to work with

logging.debug(json.dumps(converted_recipe))
logging.info(json.dumps(converted_recipe))
print(converted_recipe)
sys.stdout.flush()
