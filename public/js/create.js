var lc;
var canvas;
var context;

$(document).ready(function() {
    return $.getJSON('/newpresentation', function(data) {
        $('body').data('id', data['id']);
        $('body').data('title', data['title']);
        $('body').data('size', data['size']);

        return SetCurrentPage(0);
    });
});

$('#changeTitle').on('click', function(e) {
    $('#presentationTitleInput').val($('body').data('title'));
});

$('#saveTitle').on('click', function(e) {
    var payload = {
        'title': $('#presentationTitleInput').val()
    };

    $.post('/title/' + $('body').data('id'), payload, function(response) {
        $('body').data('title', response['title']);
        return UpdateNavigationControls();
    }, 'json');
});

$('#changeComment').on('click', function(e) {
    $('#presentationCommentInput').val($('body').data('comment'));
});

$('#saveComment').on('click', function(e) {
    var payload = {
        'comment': $('#presentationCommentInput').val()
    };

    $.post('/comment/' + $('body').data('id') + '/' + $('body').data('index'), payload, function(response) {
        $('body').data('comment', response['comment']);
        return UpdateNavigationControls();
    }, 'json');
});

$('#createPage').on('click', function(e) {
    $.getJSON('/page/' + $('body').data('id'), function(response) {
        $('body').data('size', response['size']);
        return UpdateNavigationControls();
    }, 'json');
});

$('#next').on('click', function(e) {
    return SetCurrentPage($('body').data('index') + 1);
});

$('#prev').on('click', function(e) {
    return SetCurrentPage($('body').data('index') - 1);
});

function SetCurrentPage(pageNum, callback) {
    return $.getJSON('/page/' + $('body').data('id') + '/' + pageNum, function(response) {
        $('body').data('comment', response['comment']);
        $('body').data('index', response['id']);
        console.log(response);
        $("#pageView").attr("src", response['img_path']);
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

    $('#comment').text($('body').data('comment'));
    $('#presentationId').html($('body').data('id'));
    $('#presentationTitle').text($('body').data('title'));

    if (callback)
        return callback();
    return;
}

$('#editorModal').on('shown.bs.modal', function(e) {
    lc = LC.init(
        document.getElementsByClassName('lite')[0], {
            imageURLPrefix: './lib/img',
            backgroundColor: 'blue',
            imageSize: {
                width: 800,
                height: 600
            }
        }
    );

    canvas = document.getElementById('drawing-canvas');
    setImageCanvas();
    context = canvas.getContext('2d');
})