var express = require('express');

var app = express();

app.use(express.static(__dirname));

var mongoose = require('mongoose');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var http = require('http').Server(app);
// var io = require('socket.io')(http);

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});


var io = require('socket.io').listen(server)

// var dbUrl = 'mongodb://manish7297:aHyghAc52MVpPfh@ds257981.mlab.com:57981/simple-chat';
var dbUrl = 'mongodb+srv://manish7297:aHyghAc52MVpPfh@cluster0.hv823.mongodb.net/simple-chat?retryWrites=true&w=majority';

io.on('connection', () =>{
    console.log('a user is connected')
   })

mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected',err);
 } , {useNewUrlParser: true })

var Message = mongoose.model('Message',{ name : String, message : String})


app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err){
        res.sendStatus(500);
        }
        io.emit('message', req.body);
        res.sendStatus(200);

    })
})


