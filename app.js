const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Myk@ku5uke',
  database: 'rcmartist'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  // console.log('success');
});


app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM artists',
    (error, results) => {
      // console.log(results);
      res.render('index.ejs');
    }
  );
});

// //脆弱なルーティング(sqlインジェクション実験用)
// //プレースホルダーを使用していないルーティング(エスケープをしていない)
// app.post('/search', (req,res) => {
//   if (req.body.artistName === ''){
//     res.render('index.ejs');
//   }else{
//     connection.query(
//       `SELECT * FROM artists WHERE name LIKE '%${req.body.artistName}%' `,
//       (error,results) => {
//         res.render('search.ejs',{artists:results});
//       }
//     );
//   } 
// });

// 脆弱でないルーティング
// プレースホルダーを使用しているルーティング(エスケープをしている)
app.post('/search', (req,res) => {
  if (req.body.artistName === '') {
    res.render('index.ejs');
  }else{
    connection.query(
      'SELECT * FROM artists WHERE name LIKE ?',
      ['%' + req.body.artistName + '%'],
      (error,results) => {
        res.render('search.ejs',{artists:results});
      }
    );
  }
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