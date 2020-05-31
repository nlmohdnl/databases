const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
});

const connect = util.promisify(connection.connect.bind(connection));
const execQuery = util.promisify(connection.query.bind(connection));

const dropDatabase = 'DROP DATABASE IF EXISTS transaction';
const createDatabase = 'CREATE DATABASE IF NOT EXISTS transaction';
const useDatabase = 'USE transaction';

async function createDBandTables() {

    const createAccountTable = `CREATE TABLE IF NOT EXISTS account 
    (account_number VARCHAR(25) PRIMARY KEY,
    balance DECIMAL(8, 2)  NOT NULL)`;

    const createAccountChangesTable = `CREATE TABLE IF NOT EXISTS account_changes
    (change_number INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(25) NOT NULL ,
    amount DECIMAL(8, 2) NOT NULL,
    changed_date DATETIME NOT NULL, 
    remark VARCHAR(200), 
    CONSTRAINT FK_Account_Number FOREIGN KEY (account_number) REFERENCES account(account_number))`;

    try {
        await connect();

        await Promise.all[(
            execQuery(dropDatabase),
            execQuery(createDatabase),
            execQuery(useDatabase),
            execQuery(createAccountTable),
            execQuery(createAccountChangesTable)
        )];

        connection.end();
    } catch (error) {
        console.error(error);
        connection.end();
    }
}

createDBandTables();