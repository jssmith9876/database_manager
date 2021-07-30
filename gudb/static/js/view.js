const TABLES_URL = "/_get_tables";
const COLS_URL = "/_get_table_columns"
const ROWS_URL = "/_get_rows";

const where_template = `
    <span>and</span>
    <select name="where_selector_{i}" class="column_dropdown">
        <option value="none" selected>N.A.</option>
    </select>
    <span>=</span>
    <input type="text" id="where_equality_{i}">`;

function populateColumnDropdowns(newTable) {
    // Clear the current options (except for default)
    const default_option = "<option value='none' selected>N.A.</option>";
    $(".column_dropdown").empty();
    $(".column_dropdown").append(default_option)

    // Send the request to get the columns
    $.getJSON(COLS_URL, { table: newTable })
        .done(function(response) {
            let columns = response.columns;

            columns.forEach(col => {
                let col_option = `<option value="${col}">${col}</option>`;
                $(".column_dropdown").append(col_option);
            });
        }).fail(function(err) {
            console.log("The get_columns request failed!");
            console.log(err);
        });
}

$(document).ready(function() {

    // Send a GET request to get the tables
    $.getJSON(TABLES_URL)
        .done(function(response) {
            let tables = response.result;
            
            // For each table, make it an option and add to the tables drop down
            tables.forEach(table => {
                let table_option = `<option value="${table[0]}">${table[0]}</option>`;
                $("#tables_dropdown").append(table_option);
            });
        }).fail(function(err) {
            console.log("The get_tables request failed!");
            console.log(err);
        });
   
    // When the user selects a table from  the dropdown,
    // populate the columns dropdown for the WHERE selector
    $("#tables_dropdown").change(function() {
        populateColumnDropdowns(this.value);
    });

    // When the user selects a column that isn't N.A., enable the text field
    // Similarly, if the user selects N.A., disable text field
    $(".column_dropdown").change(function() {
        if (this.value != 'none') {
            $("#where_equality").prop("disabled", false);
        } else {
            $("#where_equality").val("");
            $("#where_equality").prop("disabled", true);
        }
    });

    $("#where_adder").click(function() {
        // Append the new template
        $("#where_filters").append(where_template);

        // Get the text of the selected table and repopulate dropdowns
        const newTable = $("#tables_dropdown").find(":selected").text();
        populateColumnDropdowns(newTable);
    });

    // Update the table based on the selected dropdown
    // $("#tables_dropdown").change(function() {
        
    //     // Clear the table's current entries
    //     $("#table_columns").empty()
    //     $("#row_results").empty();

    //     const newTable = this.value;

    //     // Get the columns for the table
    //     $.getJSON(COLS_URL, { table: newTable })
    //         .done(function(response) {
    //             let columns = response.columns;
                
    //             // Add the columns to the table header
    //             let table_header = "<tr>";
    //             columns.forEach(column => {
    //                 table_header += "<th>" + column + "</th>";
    //             });
    //             table_header += "</tr>";
    //             $("#table_columns").append(table_header);


    //             // Get the rows from the table afterwards
    //             $.getJSON(ROWS_URL, { table: newTable, num_rows: 'all' })
    //             .done(function(response) {
    //                 let rows = response.rows;

    //                 // Put all of the rows into the table
    //                 rows.forEach(row => {
    //                     let newRow = "<tr>";
    //                     row.forEach(element => {
    //                         newRow += `<td>${element}</td>`;
    //                     });
    //                     newRow += "</tr>";
    //                     $("#row_results").append(newRow);
    //                 });
    //             }).fail(function(err) {
    //                 console.log("Column request failed!");
    //                 console.log(err);
    //             });

    //     }).fail(function(err) {
    //         console.log("Row request failed!");
    //         console.log(err);
    //     })
            
    // });
});

