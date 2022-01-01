import requests
import json
import os
from bs4 import BeautifulSoup

import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.INFO)

# TODO(map) This dict probably isn't needed
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

if 'sample' in URL:
    test_url = os.getcwd() + '/test/' + URL
    html = open(test_url, "r")
else:
    page = requests.get(URL)
    html = page.content

soup = BeautifulSoup(html, 'html.parser')

converted_recipe['text_friendly_name'] = soup.find(class_ = 'o-AssetTitle__a-HeadlineText').text.strip()
converted_recipe['description'] = '' # TODO(map) There doesn't appear to be one?

meta_info = soup.find(class_ = 'recipeInfo').text.strip().split()
cook_time = 0
# TODO(map) Get test case to make sure that this logic passes in the event that there are
# minutes only and no hours
for index, info in enumerate(meta_info):
    if info == 'Total:':
        cook_time += int(meta_info[index + 1]) * 60
        cook_time += int(meta_info[index + 3])
        converted_recipe['cook_time'] = dict([('minutes', str(cook_time))])
    elif info == 'Yield:':
        converted_recipe['serving_sizes'] = meta_info[index + 1]

directions_body = soup.find(class_='o-Method__m-Body')
directions = directions_body.find_all('li')
for direction in directions:
    step_list.append(direction.text.strip())

ingredients_body = soup.find(class_ = 'o-Ingredients__m-Body')
ingredients = ingredients_body.find_all(class_ = 'o-Ingredients__a-Ingredient--CheckboxLabel')
ingredient_list = list(map(lambda ingredient: ingredient.text.strip(), ingredients))
ingredient_list.remove('Deselect All')

converted_recipe['steps'] = step_list
converted_recipe['ingredients'] = ingredient_list

print(json.dumps(converted_recipe))
sys.stdout.flush()
