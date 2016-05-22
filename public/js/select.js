$(document).ready(function() {
    $("#input-id").rating();
    $('#list').click(function(event) {
        event.preventDefault();
        $('#products .item').addClass('list-group-item');
    });
    $('#grid').click(function(event) {
        event.preventDefault();
        $('#products .item').removeClass('list-group-item');
        $('#products .item').addClass('grid-group-item');
    });
    $('.viewBtn').click(function(e) {
        console.log(event.target.id);
        location.href = '/view/' + event.target.id;
    });
});