
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

async function readDatabase() {

  const tables = {
      account: [
          { account_number: '101', balance: 2000 },
          { account_number: '102', balance: 4000 },
      ],

      account_changes: [
          {
              account_number: '101',
              amount: 100,
              changed_date: '2020-05-31',
              remark: 'testing1',
          },
          {
              account_number: '102',
              amount: -100,
              changed_date: '2020-05-31',
              remark: 'testing2',
          },
      ],  
  };

  try {

      await connect();

      await Promise.all(
         Object.keys(tables).map(entity => {
            tables[entity].map(async item => {
                await execQuery(`INSERT INTO ${entity} SET ?`, item);
            });
         }),
      );

    connection.end();

  } catch(error) {
      console.log(error);
      connection.end();
  }
}

readDatabase(); 