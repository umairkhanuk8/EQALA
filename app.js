const express=require('express');
var app = express();


var server =app.listen(4000,()=>{
    console.log('Listen at port 4000');
   })

const path = require('path');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
var errorCheck=false;

app.use(express.static(__dirname + '/public')); // Public folder is use to style the website..
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');
let currentLoginUserID;
let nowcollabrationid;

// 

// 
var appc = require('http').Server(app),
  io = require('socket.io').listen(server),
 mysql = require('mysql'),
  connectionsArray = [];


  connection = mysql.createConnection({
    connectionLimit: '10',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'liveserverdb',
    port: 3306
  });


var connections = require('express-myconnection'),
  mysqli = require('mysql');







app.post('/loginathuntication', (req, res) => {

     
  connection.query('SELECT * FROM login WHERE name = ? AND password = ?', [req.body.Username, req.body.Password], (error, res2, field) => {

   

        if (res2.length > 0) {

        currentLoginUserID =res2[0].id;
         
         console.log(currentLoginUserID);
          connection.query("SELECT * FROM `live` WHERE userid = ?",[currentLoginUserID],
            (error, res2) => {
                  if(error){
                      console.log(error);
                      return;
                  }

                  res.render('myqalams.ejs',{
                    "result" :res2
                  });
              })


        }  else {
          
          res.render('login.ejs', {
            "errorCheck":false,
          });

        }
      })
    });




app.get('/login', (req, res) => {
 
    res.render('login.ejs',{
     "errorCheck":true,
    });
  })


app.post('/login', (req, res) => {

    //console.log(req.body.email);
    //username
    //password
   connection.query('SELECT * FROM login WHERE name = ? OR email = ?', 
    [req.body.username, req.body.email], (error, res2, field) => {

   

        if (res2.length > 0) {
          
         res.render('login.ejs', {
            "Username": res2[0].name,
            "usernameexit":"Name/Email Is Already Exit",
             "errorCheck":true,
          });
        }  else {
          
         var values =[req.body.username,req.body.password,req.body.email];

        connection.query("INSERT INTO `login`(`name`, `password`, `email`) VALUES  (?)", [values],
          (error, res2) => { 

            if (error) {

            res.send(error);
            }

            res.render('login.ejs', {
            "errorCheck":true,
            "recordInserted":"Done the Record Inserted",
            });

          })

        
        }
      })
  } )


app.get('/', (req, res) => {

    res.render('index.ejs');
  })


app.get('/pins', (req, res) => {

    res.render('pins.ejs');
  })

  
app.get('/fork', (req, res) => {

    res.render('fork.ejs');
  })
  

//select * from login ORDER BY id DESC LIMIT 1
//SELECT MAX(id) FROM collabration


// app.get('/collabrate', (req, res) => {


// connection.query('select * from collabration ORDER BY id DESC LIMIT 1',(error, res2, field) => {

//         if (res2.length > 0) {
//            res.render('collabrate.ejs',{
//              "user":currentLoginUserID,
//              "collabrationid":res2[0].id
//             });
          
//         }  else {
          
//            res.render('collabrate.ejs',{
//              "user":currentLoginUserID,
//              "collabrationid":1
//             });
       
//         }
//       })
// })
  
// var router = express.Router();

// var curut2 = router.route('/collabrate/:collabrationid/:id');



// curut2.put(function(req,res,next){
  


//     //get data
//     var data = [
//         userid:currentLoginUserID,
//         htmldata:req.body.htmldata,
//         cssdata:req.body.cssdata,
//         jsdata:req.body.jsdata
//      ];

//     //inserting into mysql
//     req.getConnection(function (err, conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("UPDATE collabration set ? WHERE id = ? ",[data,currentLoginUserID], function(err, rows){

//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//           res.sendStatus(200);

//         });

//      });

// });



app.get('/collabrationMode', (req, res) => {

    io.on('connection', (socket) => {

    console.log('connected')
   
   socket.on('htmldata', (evt) => {
        console.log("html data :"+ evt);
        socket.broadcast.emit('htmldata', evt)
    })

    socket.on('cssdata', (evt) => {
        //log(evt)
        socket.broadcast.emit('cssdata', evt)
    })

    socket.on('jsdata', (evt) => {
        //log(evt)
        socket.broadcast.emit('jsdata', evt)
    })


})


    io.on('disconnect', (evt) => {
        console.log('some people left')
    })



    res.render('editorforcollabrate.ejs',{
            "user":currentLoginUserID
          });
     
        
})




app.get('/collabrate/:collabrationid/:id', (req, res) => {

  // console.log("collabrate");
  // console.log(req.params.id);
  // console.log(req.params.collabrationid);


//  if (currentLoginUserID > -1 ) {
    if (true ) {
       
                      nowcollabrationid=req.params.collabrationid;
                      res.render('editorforcollabrate.ejs');
                    }



  else {
    
                res.send("Login before");
  }

})
  

app.get('/myqalams', (req, res) => {

    connection.query("SELECT * FROM `live` WHERE userid = ?",[currentLoginUserID],
            (error, res2) => {
                  if(error){
                      console.log(error);
                      return;
                  }

                  res.render('myqalams.ejs',{
                    "result" :res2
                  });
              })
  })
  

app.get('/ProEditor', (req, res) => {

    res.render('ProEditor.ejs');
  })


  app.get('/all', (req, res) => {

    connection.query("SELECT * FROM `live` WHERE userid != ?",[currentLoginUserID],
    (error, res2) => {
          if(error){
              console.log(error);
              return;
          }

          res.render('allQalams.ejs',{
            "result" :res2
          });
      })


   
  })
  

  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }


  app.post('/forkpin',(req, res) => {

    connection.query("SELECT * FROM `live` WHERE id=" +req.body.forkid ,
    (error, res2) => {
          if(error){
              console.log(error);
              return;
          }
          res.render('pins.ejs',{
            "result" :res2
          });
      })

  })
  
  let loginuserid=1;

  app.post('/newpin',(req, res) => {

    connection.query("SELECT `htmldata`, `cssdata`, `jsdata` FROM `live` WHERE id=" +req.body.savepin,(error, res2) => 
    {
          if(error){
              console.log(error);
              return;
          }

          console.log('====================================');
        //  console.log(res2);
          console.log('====================================');

          var valuesinserted = [
             currentLoginUserID, 
            req.body.htmldata,
            req.body.cssdata,
            req.body.jsdata
          ]
    
          console.log(valuesinserted);
          connection.query("INSERT INTO `live`(`userid`, `htmldata`, `cssdata`, `jsdata`) VALUES (?) " ,[valuesinserted],
          (error, res2) => 
          {
          


          connection.query("SELECT * FROM `live` WHERE userid = ?",[currentLoginUserID],
            (error, res2) => {
                  if(error){
                      console.log(error);
                      return;
                  }

                  res.render('myqalams.ejs',{
                    "result" :res2
                  });
              })




            });

         
      })

  })



  app.post('/data', (req, res) => {
    // console.log(req.body.htmldata);

     //console.log(escapeHtml(req.body.htmldata));
     
     let htmldatas ="asd";
    //  const $ = cheerio.load(req.body.htmldata);

    var valuesinserted = [
        currentLoginUserID,
        req.body.htmldata,
        req.body.cssdata,
        req.body.jsdata
      ]

        //      console.log($);
            //INSERT INTO `pin`(`id`, `html`) VALUES ([value-1],[value-2])
      connection.query("INSERT INTO `live`( `userid`,`htmldata`,`cssdata`,`jsdata`) VALUES (?)", [valuesinserted],
      (error, res2) => {
            if(error){
                console.log(error);
                return;
            }

            connection.query("SELECT * FROM `live` WHERE userid = ?",[currentLoginUserID],
            (error, res2) => {
                  if(error){
                      console.log(error);
                      return;
                  }

                  res.render('myqalams.ejs',{
                    "result" :res2
                  });
              })

        })
  })
  

 app.post('/collabrateData', (req, res) => {
    
     console.log(req.body.htmldata);

     //console.log(escapeHtml(req.body.htmldata));
     
     let htmldatas ="asd";
    //  const $ = cheerio.load(req.body.htmldata);

    var valuesinserted = {
        htmldata:req.body.htmldata,
        cssdata:req.body.cssdata,
        jsdata:req.body.jsdata
      }

        //      console.log($);
            //INSERT INTO `pin`(`id`, `html`) VALUES ([value-1],[value-2])
      connection.query("UPDATE  `collabration`set ? WHERE userid = ?", [valuesinserted,2],
      (error, res2) => {
            if(error){
                console.log(error);
                return;
            }
            res.render('editorforcollabrate.ejs');
        })
  })
  

  