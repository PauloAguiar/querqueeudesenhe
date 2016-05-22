$(document).ready(function() {
    $('body').data('id', $('.idHolder').attr('id'));
    $("#input-id").rating();

    return $.getJSON('/pres/' + $('body').data('id'), function(response) {
        $('body').data("size", response['size']);
        console.log(response);
        return SetCurrentPage(0);
    }, 'json');
});

function SetCurrentPage(pageNum, callback) {
    return $.getJSON('/page/' + $('body').data('id') + '/' + pageNum, function(response) {
        $('body').data('index', response['id']);
        console.log(response);
        $('body').data("img_path", response['img_path']);
        $("#pageView").attr("src", '/' + response['img_path']);
        return UpdateNavigationControls(callback);
    }, 'json');
}

function UpdateNavigationControls(callback) {
    var numOfPages = $('body').data('size');
    $('#numOfPages').text(numOfPages);
    var currentPage = $('body').data('index');
    $('#currentPage').text(currentPage + 1);

    if (currentPage > 0) {
        $('#prev').removeClass('disabled');
    } else if (!$('#prev').hasClass('disabled')) {
        $('#prev').addClass('disabled');
    }

    if (currentPage + 1 < numOfPages) {
        $('#next').removeClass('disabled');
    } else if (!$('#next').hasClass('disabled')) {
        $('#next').addClass('disabled');
    }

    if (callback)
        return callback();
    return;
}

$('#next').on('click', function(e) {
    return SetCurrentPage($('body').data('index') + 1);
});

$('#prev').on('click', function(e) {
    return SetCurrentPage($('body').data('index') - 1);
});

$('#rate').on('click', function(e) {
    console.log($('#input-id').val());
    var payload = {
        'rate': $('#input-id').val()
    };

    $.post('/rate/' + $('body').data('id'), payload, function(response) {
        console.log(response);
    }, 'json');
});
