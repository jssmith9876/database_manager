const TABLES_URL = "/_get_tables";
const COLS_URL = "/_get_table_columns";
const ROWS_URL = "/_get_rows";
const GEN_QUERY_URL = "/_gen_query";
const QUERY_URL = "/_send_query";

const where_template = `
<div class="where_filter_{i}">
    <select class="and_or_select">
        <option value="and" selected>and</option>
        <option value="or">or</option>
    </select>
    <select class="column_dropdown where_selector">
        <option value="none" selected>N.A.</option>
    </select>
    <span>=</span>
    <input type="text" class="condition_value" disabled>
    <input type="button" class="delete" value="&ndash;">
</div>`;

/*
TODO:
    FRONTEND THINGS
    -- Add some text to the view page to give some instruction.
    -- Keep adding styling and ideas as you go. (Maybe something with 
       the 'select' fields?)
    -- Update styling on result table that appears so that the box 
       surrounding the table fits to the shape.

    BACKEND THINGS
    -- Make sure get functions still work after frontend changes
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

// Generates a html table from a given table name and rows
const generateTable = (rowData, tableName=null) => {

    // Clear the table that is already there
    $("#table_columns").empty();
    $("#row_results").empty();


    // Get the table columns for the header
    if (tableName != null) {
        $.getJSON(COLS_URL, { table: tableName })
        .done(response => {
            let columns = response.columns;
            let tableHeader = "<tr>";
            
            columns.forEach(column => {
                tableHeader += `<th>${column}</th>`;
            });
            tableHeader += "</tr>";

            $("#table_columns").append(tableHeader);
        });
    }

    // Add the rows to the table
    rowData.forEach(row => {
        let newRow = "<tr>";
        row.forEach(element => {
            newRow += `<td>${element}</td>`;
        });
        newRow += "</tr>";

        $("#row_results").append(newRow);
    });
}

const getFilterData = () => {
    let whereFilters = $("#where_filters > div");

    // Get the where filters that actually have values
    let whereResults = [];
    // Get the operator connectors (AND/OR) from the WHERE clause
    let whereOperators = [];
    whereFilters.each(function() {
        let conditionVar = $(this).find(".where_selector").val();
        if (conditionVar === "") {
            return;
        }

        let conditionValue = $(this).find(".condition_value").val();
        if (conditionValue === "") {
            return;
        }

        whereOperators.push($(this).find(".and_or_select").val());

        //whereResults[conditionVar] = conditionValue;
        whereResults.push([conditionVar, conditionValue]);
    });
    


    // Get all of the filter information
    let filterData = {
        selectTop: $("input[name='num_rows']").val(),
        selectTable: $("#tables_dropdown").val(),
        whereConditions: whereResults,
        whereOperators: whereOperators,
        orderBy: {
                    "column": $("select[name='order_by'").val(),
                    "direction": $("select[name='order_direction']").val()
                    }
    };

    return filterData;
}

const switchMethods = () => {
    let filter_box = $("#filter_box");
    let query_box = $("#query_box");
    let switchButton = $("#switch_methods");

    // If the filter box was hidden
    if ($(filter_box).css('display') == 'none') {
        $(filter_box).css('display', 'block');
        $(query_box).css('display', 'none');

        // Update the button text
        $(switchButton).prop('value', 'Switch to Written Query');
    } 
    // Otherwise, the query box was hidden
    else {
        $(filter_box).css('display', 'none');
        $(query_box).css('display', 'block');

        // Update the button text
        $(switchButton).prop('value', 'Switch to Filtered Query');
    }
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

    $("#where_filters").on('click', '.delete', (event) => {
        // Get the div of the button that was just clicked and remove it
        const button_div = $(event.currentTarget).parent();
        $(button_div).remove();
    });

    // Button to switch between filter box and query box
    $("input[type='submit']#switch_methods").click(() => {
        switchMethods();
    });

    // Filter box submit button click event
    $("input[type='submit']#filter_submit").click(() => {
        let filterData = getFilterData();

        // Get the table rows from the backend
        $.getJSON(ROWS_URL, { filters: JSON.stringify(filterData) })
        .done(response => {
            // Generate the table
            generateTable(response.result, tableName=filterData['selectTable']);
        }).fail(err => {
            console.log("Table request failed!");
            console.log(err);
        });
    });

    // Written query submit button click event
    $("input[type='submit']#query_submit").click(() => {
        let written_query = $("#written_query").val();
        
        $.post(QUERY_URL, { query: written_query })
        .done(response => {
            // Generate the table
            generateTable(response.result)
        }).fail(err => {
            console.log("Query request failed!");
            console.log(err);
        })
    });

    // Generate SQL Query button click event
    $("input[type='submit']#generate_sql").click(() => {
        let filterData = getFilterData();

        $.getJSON(GEN_QUERY_URL, { filters: JSON.stringify(filterData) })
        .done(response => {
            // Change to the written query view, and fill it in with the
            // newly generated query.
            switchMethods();
            $("#written_query").val(response.result);
        }).fail(err => {
            console.log("Query generation failed!");
            console.log(err);
        })
    });

});



