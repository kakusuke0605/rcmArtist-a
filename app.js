const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '[Mysqlのパスワード]',
  database: 'rcmartist'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});


app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM artists',
    (error, results) => {
      console.log(results);
      res.render('index.ejs');
    }
  );
});

app.post('/search', (req,res) => {
  connection.query(
    'SELECT * FROM artists WHERE name LIKE ?',
    ['%' + req.body.artistName + '%'],
    (error,results) => {
      res.render('search.ejs',{artists:results});
    }
  );
});

app.get('/result/:max_range', (req,res) => {
  connection.query(
    'SELECT * FROM artists WHERE max_range <= ? and max_range >= ? - 2',
    [req.params.max_range,req.params.max_range],
    (error,results) => {
      res.render('result.ejs',{rcm:results});
    }
  );
});

app.listen(3000);