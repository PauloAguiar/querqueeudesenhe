var express = require('express');
var path = require('path');
var morgan = require('morgan');
var fileDB = require('json-file-db');
var fs = require('fs');
var fsE = require('fs-extra');
var bodyParser = require('body-parser')

var app = express();

if (!fs.existsSync('data')){
    fs.mkdirSync('data');
}
if (!fs.existsSync('data/presentation')){
    fs.mkdirSync('data/presentation');
}

var controlStorage = fileDB('./data/control.json');
var presentationStorage = fileDB('./data/presentations.json');

controlStorage.get(function(err, data) {
    if (data.length == 0) {
        controlStorage.put({
            'id': 'control',
            'presentation_id': 0,
            'img_id': 1,
        }, function(err) {
            if (err)
                return console.log("Error saving control file.\n" + err);
            console.log("Control file created!");
        });
    }
});

// Express app setup
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// Start serving static files for test purposes
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'))
console.log(__dirname);

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/create', function(req, res) {
    res.render('pages/create');
});

app.get('/newpresentation', function(req, res) {
    return controlStorage.getSingle('control', function(err, data) {
        if (err) {
            console.log('Error getting json from control storage.');
            return res.json({
                id: 0
            });
        }
        console.log(data);
        var newId = data['presentation_id'];
        data['presentation_id'] = newId + 1;
        console.log('a = ' + newId);
        return controlStorage.put(data, function(err) {
            var payload = {
                'id': newId,
                'title': 'Nova Apresentação',
                'size': 1,
            };

            return presentationStorage.put(payload, function(err) {
                if (err)
                    throw err;

                var currentPresentationStorage = fileDB('data/presentation/p_' + newId + '_items.json');
                var currentItem = {
                    'id': 0,
                    'comment': '',
                    'img_path': 'user_img/0.png',
                };

                return currentPresentationStorage.put(currentItem, function(err) {
                    if (err)
                        throw err;

                    console.log('Presentation #' + newId + ' created.');
                    return res.json(payload);
                });
            });
        });
    });
});

app.get('/item/:id/:index', function(req, res) {
    var id = req.params.id;
    var index = req.params.index;

    var currentPresentationStorage = fileDB('data/presentation/p_' + id + '_items.json');

    return currentPresentationStorage.getSingle({'id': Number(index)}, function(err, data) {
        if (err)
            throw err;

        console.log('Item #' + index + ' of Presentation #' + id + ' loaded.');
        return res.json(data);
    });
});

app.post('/comment/:id/:index', function(req, res) {
    var id = req.params.id;
    var index = req.params.index;
    var payload = req.body;

    var currentPresentationStorage = fileDB('data/presentation/p_' + id + '_items.json');
    return currentPresentationStorage.getSingle({'id': Number(index)}, function(err, data) {
        if (err)
            throw err;
        data['comment'] = payload['comment'];
        return currentPresentationStorage.put(data, function(err) {
            if(err)
                throw err;
            return res.json(data);
        });
    });
});

app.post('/title/:id', function(req, res) {
    var id = req.params.id;
    var payload = req.body;

    return presentationStorage.getSingle({'id': Number(id)}, function(err, data) {
        if (err)
            throw err;

        data['title'] = payload['title'];
        return presentationStorage.put(data, function(err) {
            if(err)
                throw err;
            return res.json(data);
        });
    });
});

app.get('/page/:id', function(req, res) {
    var id = req.params.id;

    var currentPresentationStorage = fileDB('data/presentation/p_' + id + '_items.json');

    return presentationStorage.getSingle({'id': Number(id)}, function(err, data) {
        if (err)
            throw err;

        data['size'] = data['size'] + 1;
        return presentationStorage.put(data, function(err) {
            if (err)
                throw err;

            var newItem = {
                'id': data['size'] - 1,
                'comment': '',
                'img_path': 'user_img/blank.png',
            };

            return currentPresentationStorage.put(newItem, function(err) {
                if (err)
                    throw err;

                console.log('Presentation #' + id + ' updated.');
                return res.json(data);
            });
        });
    });
});

app.get('/page/:id/:index', function(req, res) {
    var id = req.params.id;
    var index = req.params.index;

    var currentPresentationStorage = fileDB('data/presentation/p_' + id + '_items.json');

    return currentPresentationStorage.getSingle({'id': Number(index)}, function(err, data) {
        if (err)
            throw err;

        console.log(data);
        return res.json(data);
    });
});

app.listen(app.get('port'),
    function() {
        console.log('listening on port ' + app.get('port'))
    });