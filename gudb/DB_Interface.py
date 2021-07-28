import mysql.connector
from mysql.connector import errorcode


"""
DB_Interface:
Class to directly talk and interact with the MySQL server.
Handles operations such as creating/using databases, table creations/insertions, etc.
"""
class DB_Interface:
    """
    Initialization function:
    Takes a given database name and uses that database after connecting to the server
    IMPORTANT! This assumes that the database has already been created
    """
    def __init__(self, database_name):
        self.cnx = mysql.connector.connect(
            host="mysql",
            user="root",
            password="test_pass"
        )

        self.cursor = self.cnx.cursor()

        self.db = database_name
        self.use_database(self.db)

    """
    Function to use a given database
    Tries to use the database, fails if it doesn't exist
    """
    def use_database(self, database_name):
        try:
            self.cursor.execute(f"USE {database_name}")
            return True
        except mysql.connector.Error as err:
            print(f"Database {database_name} does not exist.")
            return False

    """
    Function to get all tables for a given database
    """
    def get_tables(self):
        try:
            self.cursor.execute("SHOW TABLES")
            return self.cursor.fetchall()
        except mysql.connector.Error as err:
            print(f"Something went wrong! {err}")
            return False

    """
    Given a list of table names (str), will try to drop each table in the list. 
    """
    def drop_tables(self, tables):
        for table in tables:
            try:
                self.cursor.execute(f"DROP TABLE {table}")
                print(f"Table '{table}' has been dropped")
            except mysql.connector.Error as err:
                print(f"Table {table} could not be dropped: {err}")

    """
    Function to create a table
    Takes a table name as a string and a description of the new table's columns as a dictionary
        -> table_description = {
            col_1: column information [varchar(11) etc]
        }
    NOTE: table_description's last entry must be 'primary_key': 'xxx' for some column xxx
    """
    def create_table(self, table_name, table_description):
        # Create the SQL query to create the given table
        sql = f"CREATE TABLE `{table_name}` ("
        for column, desc in table_description.items():
            if column != 'primary_key':
                sql += f"`{column}` {desc},"
            else:
                sql += f"PRIMARY KEY (`{desc}`)"
        sql += ") ENGINE=InnoDB"

        # Try to create the table (unless it already exists or for some other error)
        try:
            print(f"Creating table '{table_name}': ", end="")
            self.cursor.execute(sql)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")


    """
    Function to add a row to a table
    The provided data is JSON formatted (python dictionary)
    """
    def add_row(self, table_name, row_data):
        # Get a comma separated list of the row names
        # then, reformat so each char is surrounded by ` (ex. name => `name`)
        # and turn that reformatted list into a comma separated string 
        list_of_cols = list(row_data.keys())
        formatted_cols = ["`" + col + "`" for col in list_of_cols]
        query_cols = ", ".join(formatted_cols)

        # Tuple of values to insert
        tupled_values = tuple(list(row_data.values()))  
        
        # Get the proper number of "%s"'s based on the number of columns
        # We want [:-2] to slice the last ", " from the string
        f_strings = ("%s, " * len(tupled_values))[:-2]

        sql = f"INSERT IGNORE INTO {table_name} (" + query_cols + ") VALUES (" + f_strings + ")"

        # Try to run the query
        try:
            self.cursor.execute(sql, tupled_values)
            self.cnx.commit() 
        except mysql.connector.Error as err:
            print(f"Row could not be inserted: {err}")
            print(sql, tupled_values)

    def get_rows(self, table_name, num_rows=-1):
        num_to_get = "*" if num_rows == -1 else f"TOP({num_rows})"
        query = f"SELECT {num_to_get} FROM {table_name}"

        try:
            self.cursor.execute(query)
            return self.cursor.fetchall()
        except mysql.connector.Error as err:
            print(f"Rows could not be retrieved: {err}")
            return False

        
