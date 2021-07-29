const TABLES_URL = "/_get_tables";
const COLS_URL = "/_get_table_columns"
const ROWS_URL = "/_get_rows";

$(document).ready(function() {

    // Send a GET request to get the tables
    $.getJSON(TABLES_URL)
        .done(function(response) {
            let tables = response.result;
            
            // For each table, make it an option and add to the tables drop down
            tables.forEach(table => {
                let table_option = `<option value="${table[0]}">${table[0]}</option>`
                $("#tables_dropdown").append(table_option);
            });

        }).fail(function(err) {
            console.log("The request failed!");
            console.log(err);
        });


    // Update the table based on the selected dropdown
    $("#tables_dropdown").change(function() {
        
        // Clear the table's current entries
        $("#table_columns").empty()
        $("#row_results").empty();

        const newTable = this.value;

        // Get the columns for the table
        $.getJSON(COLS_URL, { table: newTable })
            .done(function(response) {
                let columns = response.columns;
                
                // Add the columns to the table header
                let table_header = "<tr>";
                columns.forEach(column => {
                    table_header += "<th>" + column + "</th>";
                });
                table_header += "</tr>";
                $("#table_columns").append(table_header);
                

                // Get the rows from the table afterwards
                $.getJSON(ROWS_URL, { table: newTable, num_rows: 'all' })
                .done(function(response) {
                    let rows = response.rows;

                    // Put all of the rows into the table
                    rows.forEach(row => {
                        let newRow = "<tr>";
                        row.forEach(element => {
                            newRow += `<td>${element}</td>`;
                        });
                        newRow += "</tr>";
                        $("#row_results").append(newRow);
                    });
                }).fail(function(err) {
                    console.log("Column request failed!");
                    console.log(err);
                });

        }).fail(function(err) {
            console.log("Row request failed!");
            console.log(err);
        })
            
    });
});

