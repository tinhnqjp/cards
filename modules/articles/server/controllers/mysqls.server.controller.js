'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mysql = require('mysql'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'mysql',
    database : 'jaic_db'
  });
/**
 * List of Articles
 */
exports.list = function (req, res) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM student where id=?', [2], function (error, results, fields) {
      connection.release();
      if (error) throw error;
      res.json(results);
    });
  });
};