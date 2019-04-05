$(document).ready(function(){
    $('.filterable .btn-filter').click(function(){
        var $panel = $(this).parents('.filterable'),
        $filters = $panel.find('.filters input'),
        $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

    $('.filterable .filters input').keyup(function(e){
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;
        /* Useful DOM data and selectors */
        var $input = $(this),
        inputContent = $input.val().toLowerCase(),
        $panel = $input.parents('.filterable'),
        column = $panel.find('.filters th').index($input.parents('th')),
        $table = $panel.find('.table'),
        $rows = $table.find('tbody tr');
        /* Dirtiest filter function ever ;) */
        var $filteredRows = $rows.filter(function(){
            var value = $(this).find('td').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });
        /* Clean previous no-result if exist */
        $table.find('tbody .no-result').remove();
        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
        $rows.show();
        $filteredRows.hide();
        /* Prepend no-result row if all rows are filtered */
        if ($filteredRows.length === $rows.length) {
            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="'+ $table.find('.filters th').length +'">No result found</td></tr>'));
        }
    });
});


function getPortsInfo(domain, port_start, port_end) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:5000/ports-info');

    // request state change event
    xhr.onreadystatechange = function() {

      // request completed?
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        // request successful
        checkPorts(domain, port_start, port_end, xhr.responseText);
      }
      else {
        // request error
        console.log('HTTP error', xhr.status, xhr.statusText);
      }
    };

    // start request
    xhr.send();

}

function saveVar(content) {
    return content;
}

function checkPorts(domain, port_start, port_end, portsInfo) {

    // Build URL
    var url = 'http://127.0.0.1:5000/check-ports?domain=';
    url += domain + '&port_start=' + port_start + '&port_end=' + port_end;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    // request state change event
    xhr.onreadystatechange = function() {

        // request completed?
        if (xhr.readyState !== 4) return;

        if (xhr.status === 200) {

            // request successful
            portsOpen = JSON.parse(xhr.responseText);

            // Transform portsInfo string to dictionary object
            var portsInfoDic = JSON.parse(portsInfo);

            // Get table in html file
            let tableElement = document.getElementById("open-ports");

            // Iterate over open ports
            for (let i = 0; i < portsOpen.length; i++) {
                var htmlcontent =
                      "<tr>" +
                          "<td>" + portsOpen[i] + "</td>" +
                          "<td>" + portsInfoDic[portsOpen[i]]["protocol"] + "</td>" +
                          "<td>" + portsInfoDic[portsOpen[i]]["tcp/udp"] + "</td>" +
                          "<td>" + portsInfoDic[portsOpen[i]]["description"] + "</td>" +
                      "</tr>";

                // Add row in html file
                var newRow = tableElement.insertRow(tableElement.rows.length);
                newRow.innerHTML = htmlcontent;

            }
        }
        else {
            // request error
            console.log('HTTP error', xhr.status, xhr.statusText);
        }
    };

    // start request
    xhr.send();
}