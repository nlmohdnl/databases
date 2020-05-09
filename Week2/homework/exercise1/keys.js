'use strict';

const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword'
});

// Promisify the bind function 

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {

  const CREATE_DATADASE = `CREATE DATABASE IF NOT EXISTS researchs;`;  
  const USE_DATABASE = `USE researchs;`;

  const CREATE_AUTHORS_TABLE = `
    CREATE TABLE IF NOT EXISTS Authors (
      author_no INT PRIMARY KEY,
      author_name VARCHAR(50),
      university VARCHAR(50),
      date_of_birth DATE,
      h_index FLOAT,
      gender ENUM('m', 'f')
    );`;

  const ADD_COLLABORATOR_COLUMN = `
    ALTER TABLE Authors
      ADD COLUMN collaborator INT;`;

  const ADD_COLLABORATOR_FOREIGN_KEY = `
    ALTER TABLE Authors
      ADD CONSTRAINT FK_Collaborator FOREIGN KEY (collaborator) REFERENCES Authors(author_no);`;

  connection.connect();

  try {
    // call the function that returns promise
    await execQuery(CREATE_DATADASE);
    await execQuery(USE_DATABASE);
    await execQuery(CREATE_AUTHORS_TABLE);
    await execQuery(ADD_COLLABORATOR_COLUMN);
    await execQuery(ADD_COLLABORATOR_FOREIGN_KEY);

  } catch (error) {
    console.error(error);
    connection.end();
  }

  connection.end();
}
seedDatabase()