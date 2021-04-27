var router = require('express').Router();
const Joi = require('joi'); 
const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    description: {
        type: String
    }
},{
    versionKey: false
});

let Courses = mongoose.model('course', CoursesSchema);





router.get('/', async (req, res) => {
    const courses =  await Courses.find();
    res.status(200).json(courses);
});


router.get('/:id', async (req, res) => {
    let courseID = req.params.id;
    await Courses.findById({_id: courseID}, (err, data)=>{
        if(err){
            res.status(500).json({
                message:
                "Something went Wrong"
            });
        } else{
            res.status(200).json(data);
        }
    });
});

var postCourse =async (req, res) => {
    
    await new Courses(req.body).save((err, data) =>{
    
    const { error } = validateCourse(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    if(err){
        res.status(500).json({ message:"Something went wrong"});
    }
    res.status(200).json({
        message:"Course created",
        data,
    })
    })
}

router.post('/',  postCourse);



router.put('/:id', async (req, res) => {
    const { error } = validateCourse(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let courseID = req.params.id;
    await Courses.findOneAndUpdate({_id: courseID}, {$set : req.body}, async(err, data)=>{
        if(err){
            res.status(500).json({
                message:
                "Something went Wrong"
            });
        } else{
            res.status(200).json({
                message: "Course update",
                data,
            });
        }
    });
});



router.delete('/:id', async(req, res) => {
    let courseID = req.params.id;
    await Courses.findOneAndDelete({_id: courseID}, async(err, data)=>{
        if(err){
            res.status(500).json({
                message:
                "Something went Wrong"
            });
        } else{
            res.status(200).json({
                message: "Course Deleted",
                data,
            });
        }
    });
});

function validateCourse(course) {
    const pattern = /[a-zA-Z]{3}[0-9]{3}/
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        description: Joi.string().max(200).optional(),
        code: Joi.string().regex(pattern).required()
    });
    return schema.validate(course);
}
module.exports.postCourse = postCourse;
module.exports.router = router;
