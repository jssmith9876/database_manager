from DB_Interface import *
import json

DB_NAME = 'starfinder'
TABLES = {}

###
#  Tables to add
###

TABLES['alignments'] = {
    'id': 'int(11) NOT NULL AUTO_INCREMENT',
    'index': 'varchar(32) NOT NULL',
    'name': 'varchar(32) NOT NULL',
    'url': 'varchar(64) NOT NULL',
    'primary_key': 'id'
}




my_db = DB_Interface(DB_NAME)

# Drop all tables FOR TESTING
#my_db.drop_tables(list(TABLES.keys()))

# Create the tables
for table_name in TABLES:
    table_description = TABLES[table_name]
    my_db.create_table(table_name, table_description)

# Insert the data into the database for the given table
CURR_TABLE = 'alignments'
with open("testinfo.json", 'r') as f:
    data = json.load(f)['results']

for row in data:
    my_db.add_row(CURR_TABLE, row)