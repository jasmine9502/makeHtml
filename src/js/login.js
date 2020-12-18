const Datastore = require('nedb');

function login(userData) {
    let data_db;
    data_db = new Datastore({
        filename: 'data.db',
        autoload: true
    });
    data_db.find({ id: "user" }, function (err, docs) {
        if (docs[0]) {
            data_db.update({ id: "user" }, { $set: userData }, {},
                function (err, numAffected, affectedDocuments, upsert) {
                });
        } else {
            data_db.insert(userData, function (err, new_doc) {
                "use strict";
            });
        }
    });
}