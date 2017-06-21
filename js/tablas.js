
function Select(obj, table1) {
    var tbl = document.getElementById(table1)
    var firstRow = tbl.getElementsByTagName("TR")[0];
    var oldRow = tbl.rows[firstRow.getElementsByTagName("input")[0].value];
    if (oldRow != null) {
        oldRow.className = 'UnHighLight';
    }
    obj.className = 'selected';
    firstRow.getElementsByTagName("input")[0].value = obj.rowIndex;
}
function HighLight(obj, table1) {
    var firstRow = document.getElementById(table1).getElementsByTagName("TR")[0];
    if (firstRow.getElementsByTagName("input")[0].value != obj.rowIndex) {
        obj.className = 'highlight';
    }
}
function UnHighLight(obj, table1) {
    var firstRow = document.getElementById(table1).getElementsByTagName("TR")[0];
    if (firstRow.getElementsByTagName("input")[0].value != obj.rowIndex) {
        obj.className = 'UnHighLight'
    }
}
