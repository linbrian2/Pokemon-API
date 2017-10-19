# Pokémon API

## Overview

In this project, I implemented a website that allows to you visually explore Pokemon, and an API that will allow you to query different Pokemon. Simply follow the setup steps, and you will be able to use the command prompt to run `node index.js` from within the file's directory. This allows the server to listen in on requests. The different requests can be found below.

## Objectives

This project used Express.js to create both an API and a website. JSON parsing was used to help implement the API. 

## Setup 

Clone this project folder and run `npm install` inside the directory. 

These files are included:
- `index.js`: A skeleton of a working server that has Express.js required and initialized, middleware initialized, and the server listening on port `3000`.
- `poke.json`: A `json` file containing all Generation 1 Pokemon data.
- `poke-data-util.js`: Contains three utility functions for convenience. 

Install node.js from their website to enable the `node index.js` command later.

Install underscore by running `npm install underscore --save` from npm.

You are now ready to use the API!

## Requests 

Run `node index.js` from within the file's directory. This allows the server to listen on port `3000`. Go to your web browser and enter into the URL bar `http://localhost:3000/`. This is the home location, which allows you to navigate the website. You should append to the URL the following GET requests with fields like `/:pokemon_name` being replaced by `/Pikachu`. The non-GET requests should require an application like Postman to see though.

>It should be noted that invalid requests generally lead to an empty array being returned, or simply nothing happening.

1. `GET` `/` **5 points**

  Displays the homepage that has all of the pokemon in a table with two columns:

  1. Pokemon ID
  2. Link tag with Pokemon name that links to `/pokemon/:pokemon_id`

2. `GET` `/pokemon/:pokemon_id`

  Displays an HTML page with a table of all the Pokemon's data in two columns: 

  1. Attribute
  2. Value

  If the Pokemon ID does not exist, return an "Error: Pokemon not found". 

3. `GET` `/pokemon/image/:pokemon_id`

  Displays an HTML page with *just* an image of a given Pokemon ID: 

4. `GET` `/api/evochain/:pokemon_name` 

  Returns an array of all the Pokemon in the given Pokemon's evolution chain in alphabetical. Pokemon name must be correct capitalization for it to work.

5. `GET` `/api/type/:type` 

  Returns an array of all Pokemon of the given type in the order they appear (increasing ids). Type should be capitalized for it to work.

6. `GET` `/api/type/:type/heaviest` 

  Returns an object with the name and weight of the heaviest Pokemon of a given type. 

7. `POST` `/api/weakness/:pokemon_name/add/:weakness_name` 

  Adds the given weakness to the `weaknesses` array of a given pokemon if it does not yet exist. This also returns an object with the name and updated Pokemon weakness array. This change persists until the server is reset.

8. `DELETE` `/api/weakness/:pokemon_name/remove/:weakness_name` 

  Removes the given weakness from the `weaknesses` array of a given pokemon. This change persists until the server is reset.

## Credits

Credit to https://github.com/Biuni/PokemonGO-Pokedex/ for the `poke.json` file. 
