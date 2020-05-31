//requier util & mysql modules
const util = require('util');
const mysql = require('mysql');


//conncetion parameters
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'transaction',
});

//assign util.promisify to connect & execQuery constants will creat a promise which will allow the connection to
//happen asynchronously . 
const connect = util.promisify(connection.connect.bind(connection));
const execQuery = util.promisify(connection.query.bind(connection));

async function transaction() {
  try {
    await connect();
    await execQuery('SET autocommit = 0');
    await execQuery('START TRANSACTION');
    await execQuery(
      `UPDATE account SET balance = balance - 100 WHERE account_number = '101'`,
    );
    await execQuery(
      `UPDATE account SET balance = balance + 100 WHERE account_number = '102'`,
    );
    await execQuery(`INSERT INTO account_changes SET ?`, {
      account_number: '101',
      amount: -100,
      changed_date: '2020-05-31',
      remark: 'item purchased',
    });
    await execQuery(`INSERT INTO account_changes SET ?`, {
      account_number: '102',
      amount: 100,
      changed_date: '2020-05-31',
      remark: 'payment done',
    });
    await execQuery('COMMIT');

    connection.end();
  } catch (error) {
    console.error(error);
    await execQuery('ROLLBACK');
    connection.end();
  }
}

transaction();