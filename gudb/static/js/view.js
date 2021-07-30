const TABLES_URL = "/_get_tables";
const COLS_URL = "/_get_table_columns"
const ROWS_URL = "/_get_rows";

const where_template = `
<div class="where_filter_{i}">
    <span>and</span>
    <select class="column_dropdown where_selector">
        <option value="none" selected>N.A.</option>
    </select>
    <span>=</span>
    <input type="text" disabled>
</div>`;

/*
TODO:
    FRONTEND THINGS
    -- Add a '-' button to the newly added WHERE filters so the user can 
       delete them.
    -- Add some text to the view page to give some instruction.
    -- Keep adding styling and ideas as you go. (Maybe something with 
       the 'select' fields? idk)
    -- Maybe add area where user can input their own SQL query? Then the 
       backend can just relay that query to the DB_Interface.
    -- Update styling on result table that appears so that the box 
       surrounding the table fits to the shape.

    BACKEND THINGS
    -- Refactor the /_get_rows function so that it accepts data from 
       the filter form instead of from a GET request (if the form idea
       doesn't end up panning out we can figure out a way to handle it
       with requests).
*/


let num_where_filters = 0;

const populateColumnDropdowns = (newTable, dropdown_id = -1) => {
    // Send a request to get the columnds
    $.getJSON(COLS_URL, { table: newTable })
    .done(response => {
        let columns = response.columns;

        // If we want to update/populate ALL column dropdowns
        if (dropdown_id === -1) {
            // Clear the current options (except for default)
            const default_option = "<option value='none' selected>N.A.</option>";

            $("select.column_dropdown").empty();
            $("select.column_dropdown").append(default_option);

            columns.forEach(col => {
                let col_option = `<option value="${col}">${col}</option>`;
                $("select.column_dropdown").append(col_option);
            });
            
        // Otherwise, we just want to update one
        } else {
            columns.forEach(col => {
                let col_option = `<option value="${col}">${col}</option>`;
                $(`.where_filter_${dropdown_id} > .column_dropdown`).append(col_option);
            });
        }
    }).fail(err => {
        console.log("The get_columns request failed!");
        console.log(err);
        return;
    });
}

// Adds a another filter for the WHERE clause of the SQL query
const addWhereFilter = () => {
    num_where_filters++;
    let newFilter = where_template.replaceAll("{i}", num_where_filters);
    $("#where_filters").append(newFilter);
}

$(document).ready(() => {

    // Send a GET request to get the tables
    $.getJSON(TABLES_URL)
    .done(response => {
        let tables = response.result;
        
        // For each table, make it an option and add to the tables drop down
        tables.forEach(table => {
            let table_option = `<option value="${table[0]}">${table[0]}</option>`;
            $("#tables_dropdown").append(table_option);
        });
    }).fail(err => {
        console.log("The get_tables request failed!");
        console.log(err);
    });

    // When the user selects a table from  the dropdown,
    // populate the columns dropdown for the WHERE selector
    $("#tables_dropdown").change((event) => {
        populateColumnDropdowns(event.currentTarget.value);
    });

    $("#where_adder").click(() => {
        // Append the new template
        addWhereFilter();
    
        // Get the text of the selected table and repopulate dropdowns
        const newTable = $("#tables_dropdown").find(":selected").text();
        populateColumnDropdowns(newTable, dropdown_id=num_where_filters);
    });

    // When the user selects a column that isn't N.A., enable the text field
    // Similarly, if the user selects N.A., disable text field
    $("#where_filters").on('change', '.column_dropdown.where_selector', (event) => {
        // Get this dropdown's input field
        let dropdown_text = $(event.currentTarget).siblings("input");

        if (event.currentTarget.value != 'none') {
            $(dropdown_text).prop("disabled", false);
        } else {
            $(dropdown_text).val("");
            $(dropdown_text).prop("disabled", true);
        }
    });


    /*
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
            
    });*/
});



