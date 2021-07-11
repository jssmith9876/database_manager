# starfinder-maker
Web application to assist in the creation of Starfinder characters. 

## TODO

#### For database (gudb):
* Crete class for database interaction and interface
* Start designing/creating client website to interact with database
    * Client website should be able to view, insert, and remove/alter data in the database
    * User will be able to select table from dropdown 
* Build backend that will connect client website and database interaction class using POST requests
* Begin adding data that will be necesary for the api

#### For API (api):
* Once data has been (or at least some data) has been added to the database, begin adding endpoints for tables in the 'starfinder' database.
* Might want to figure out a way to access the database interface class referenced in the Database TODO, or might be easier to make simple one for just retrieving the data.

#### For website (TBD):
* Begin designing frontend. Likely will be styled similarly to a standard character sheet? Or maybe designed around something similar to D&D-Beyond. Other features may be added later.
* Hook-up frontend to the API and add in content where it is meant to go (element 'Name' for titles, element 'url' for hrefs, etc.).
* Once main page has been implemented (character creation/viewing), add in login system with username/password and look into storing characters based on accounts.