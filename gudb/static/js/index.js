const TABLES_URL = "/_get_tables";
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
        //console.log(this.value);
        $.getJSON(ROWS_URL, { table: this.value, num_rows: 'all' })
            .done(function(response) {
                let rows = response.result;

                //rows.forEach(row => console.log(row));

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
                console.log("Row request failed!");
                console.log(err);
            })
    });
});

