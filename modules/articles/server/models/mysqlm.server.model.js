'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  mysql = require('mysql'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

var con;
exports.connect = function () {
  con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'jaic_db'
  });
  
  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      console.log(err)
      return;
    }
    console.log('Connection established');
  });
};

exports.delete = function () {
  con.query(
    'DELETE FROM student WHERE id = ?', [3], (err, result) => {
      if (err) throw err;
  
      console.log(`Deleted ${result.affectedRows} row(s)`);
    }
  );
};

exports.insert = function () {
  var student = { name: 'tinh2', id: 3 };
  con.query('INSERT INTO student SET ?', student, (err, res) => {
    if(err) throw err;
  
    console.log('Last insert ID:', res.insertId);
  });
};

exports.update = function () {
  con.query(
    'UPDATE student SET name = ? Where id = ?',
    ['South Africa', 3],
    (err, result) => {
      if (err) throw err;
  
      console.log(`Changed ${result.changedRows} row(s)`);
    }
  );
};

exports.select = function () {
  con.query('SELECT * FROM student Where id = ?', ['4'],(err,rows) => {
    if(err) throw err;

    console.log('Data received from Db:\n');
    rows.forEach( (row) => {
      console.log(`${row.id} is in ${row.name}`);
    });
  });
};

exports.end = function () {
  con.end((err) => {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
  });
};
