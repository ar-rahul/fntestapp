const Task = require('./models/taskModels.js');
const HttpStatusCode = require('./utils/httpStatusCode.js');
const AppError = require('./utils/appError.js');
const catchASync = require('./utils/catchAsync.js');


const getAllTasks = catchASync(async (req, res,next) => {


    const query =  Task.find({});
    const result = await query.select('-__v');

    res.status(HttpStatusCode.OK).json({
        status:'success',
        results: result.length,
        data:{
            tasks: result
        }
    })
    
})

const getTask = catchASync(async (req, res,next) => {

    const taskId = req.params.id;
    const query =  Task.findById(taskId);
    const task = await query.select('-__v');

   // const id = parseInt(req.params.id);
    // const task = tasks.find((t) => t.id === id);
    
    res.status(HttpStatusCode.OK).json({
        status:'success',
        results: 1,
        data:{
            task
        }
    })

    
})

const createTask = catchASync( async (req,res,next)=>{   


        const body = req.body;
    const newTask = await Task.create({
        text: body.text,
        day: body.day,
        reminder: body.reminder
    });

    res.status(HttpStatusCode.CREATED).json({
        status:'success',
        data:{
            task: newTask
        }
    })


})

const patchTask = catchASync( async (req,res,next)=>{   

    const taskId = req.params.id;
    const task = await Task.findByIdAndUpdate(taskId, req.body,{
        new: true,
    })

    res.status(HttpStatusCode.OK).json({
        status:'success',
        data:{
            task
        }
    })


    
})

    
const deleteTask = catchASync(async (req,res,next)=>{   

    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) {
        return next(new AppError('No Task found with that ID', HttpStatusCode.NOT_FOUND));
    }


    res.status(HttpStatusCode.NO_CONTENT).json({
        status:'success',
        data: null
    })

    
})



module.exports = {
    getAllTasks,
    getTask,
    createTask,
    patchTask,
    deleteTask,
}