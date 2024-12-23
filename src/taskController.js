const Task = require('./models/taskModels.js');
const HttpStatusCode = require('./utils/httpStatusCode.js');
const AppError = require('./utils/appError.js');
const catchASync = require('./utils/catchAsync.js');


const getAllTasks = catchASync(async (req, res,next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit,10) || 5;
    const skip = (page - 1) * limit;


    const query =  Task.find({}).skip(skip).limit(limit).sort({createdAt: -1});
    const result = await query.select('-__v');
    const total = await Task.countDocuments();
    const totalPage = Math.ceil(total / limit);
    const currentPage = page;


    res.status(HttpStatusCode.OK).json({
        status:'success',
        total: total,
        totalPage: totalPage,
        currentPage: currentPage,
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