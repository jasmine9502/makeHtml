const Datastore = require('nedb');

function personal() {
    window.location.href = 'personal.html';
}

function newNews() {
    let data_db;
    data_db = new Datastore({
        filename: 'data.db',
        autoload: true
    });
    data_db.find({ id: "user" }, function (err, docs) {
        if (docs[0]) {
            var url = docs[0]["newsNum"];
            console.log(url);
            window.open("news.html?id="+url,"","width=1300px,height=900px");
        } else {
            data_db.insert(formatData, function (err, new_doc) {
                "use strict";
                console.log(err, new_doc);
            });
        }
    });
}

function newProduct() {
    let data_db;
    data_db = new Datastore({
        filename: 'data.db',
        autoload: true
    });
    data_db.find({ id: "user" }, function (err, docs) {
        if (docs[0]) {
            var url = docs[0]["productNum"];
            console.log(url);
            window.open("product.html?id="+url,"","width=1300px,height=900px");
        } else {
            data_db.insert(formatData, function (err, new_doc) {
                "use strict";
                console.log(err, new_doc);
            });
        }
    });
}

function logout() {
    window.history.back(-1); 
}


