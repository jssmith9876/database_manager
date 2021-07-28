const TABLES_URL = "/_get_tables";

$(document).ready(function() {

    // Send a GET request to get the tables
    $.getJSON(TABLES_URL)
    .done(function(response) {
        tables = response.result;
        
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
        console.log(this.value);
    });
});

