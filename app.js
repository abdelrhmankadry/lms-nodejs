var express = require('express');
var app = express();
const mongoose = require('mongoose');
require('dotenv').config({path:'.env'});
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
const db = process.env.MONGODB_URI
mongoose.connect(db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
        
    })

    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', (err) => {
        console.error(`Database Connection Error -> ${err.message}`);
    });

app.use(express.json());

const studentController = require('./controllers/studentsController')
const courseController = require('./controllers/coursesController')

app.use('/api/students', studentController.router);
app.use('/api/courses', courseController.router);



app.get('/web/courses', function(req, res) {
    res.render('course_form.html');
});

app.get('/web/students', function(req, res) {
    res.render('student_form.html');
});


app.post('/web/courses', courseController.postCourse);

app.post('/web/students', studentController.postStudent);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
