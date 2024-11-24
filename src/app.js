const express = require('express');

const morgan = require('morgan');

const { getAllTasks, getTask, createTask, patchTask, deleteTask } = require('./taskController.js');

const dotenv = require('dotenv');

const AppError = require('./utils/appError.js');

const globalErrorHandler = require('./utils/globalErrorHandler.js');

const mongoose = require('mongoose');
const HttpStatusCode = require('./utils/httpStatusCode.js');


dotenv.config({
    path: './.env'

});

//express app

const app = express();  

////express env
///console.log(app.get('env'));
//node env
//console.log(process.env);

app.use(express.json());

//middleware - morgan
app.use(morgan('common'));

app.use((req, res, next) => {
   console.log('Hello from middleware');
   next();
});


app.get('/',(req,res)=>{    
    res.send('Hello World');
}); 

app.get('/api/v1/tasks', getAllTasks);

app.get('/api/v1/tasks/:id/:dest?/:place?', getTask );

app.post('/api/v1/tasks', createTask);

app.patch('/api/v1/tasks/:id',patchTask);

app.delete('/api/v1/tasks/:id',deleteTask);

app.all('*', (req,res,next)=>{      

    next(new AppError(`Can't find ${req.originalUrl} on this server`,HttpStatusCode.NOT_FOUND))
    
});


//error handler - middleware
app.use(globalErrorHandler);

//setup the DB connection string
const DB = process.env.MONGO_DB_CONNECTION.replace('<db_password>',process.env.MONGO_DB_PASSWORD);


//connect to the mongo db
mongoose.connect(DB)
    .then(()=>{console.log('Database connection successful');})
    .catch(err=>{console.log(err);
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});