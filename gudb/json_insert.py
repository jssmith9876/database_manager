from DB_Interface import *
import json

DB_NAME = 'starfinder'
TABLES = {}

###
#  Tables to add
###
# TABLES['alignments'] = (
#     "CREATE TABLE `alignments` ("
#     "  `id` int(11) NOT NULL AUTO_INCREMENT,"
#     "  `index` varchar(32) NOT NULL,"
#     "  `name` varchar(32) NOT NULL,"
#     "  `url` varchar(64) NOT NULL,"
#     "  PRIMARY KEY (`id`)"
#     ") ENGINE=InnoDB"
# )

TABLES['alignments'] = {
    'id': 'int(11) NOT NULL AUTO_INCREMENT',
    'index': 'varchar(32) NOT NULL',
    'name': 'varchar(32) NOT NULL',
    'url': 'varchar(64) NOT NULL',
    'primary_key': 'id'
}



my_db = DB_Interface(DB_NAME)

# Drop all tables FOR TESTING
my_db.drop_tables(list(TABLES.keys()))

for table_name in TABLES:
    table_description = TABLES[table_name]
    my_db.create_table(table_name, table_description)




# # Connect to MySQL as root
# cnx = mysql.connector.connect(
#     host="mysql",
#     user="root",
#     password="test_pass"
# )
# cursor = cnx.cursor()

# # Function to create database
# def create_database(cursor):
#     try:
#         cursor.execute(
#             f"CREATE DATABASE {DB_NAME} DEFAULT CHARACTER SET 'utf8'"
#         )
#     except mysql.connecor.Error as err:
#         print(f"Failed creating database {DB_NAME}: {err}")
#         exit(1)

# # Try to connect to the database
# # if the database does not exist, create it
# try:
#     cursor.execute(f"USE {DB_NAME}")
# except mysql.connector.Error as err:
#     print(f"Database {DB_NAME} does not exist.")
#     if err.errno == errorcode.ER_BAD_DB_ERROR:
#         create_database(cursor)
#         print(f"Database {DB_NAME} was created successfully!")
#         cnx.database = DB_NAME
#     else:
#         print(err)
#         exit(1)

# # Try to add tables to the database
# for table_name in TABLES:
#     table_description = TABLES[table_name]
#     try:
#         print(f"Creating table {table_name}: ", end="")
#         cursor.execute(table_description)
#     except mysql.connector.Error as err:
#         if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
#             print("already exists.")
#         else:
#             print(err.msg)
#     else:
#         print("OK")

# cursor.close()
# cnx.close()