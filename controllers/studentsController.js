var router = require('express').Router();
const Joi = require('joi'); 
const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
},{
    versionKey: false
});

let Students = mongoose.model('student', StudentsSchema);





router.get('/', async (req, res) => {
    const studnets =  await Students.find();
    res.status(200).json(studnets);
});


router.get('/:id', async (req, res) => {
    let courseID = req.params.id;
    await Students.findById({_id: courseID}, (err, data)=>{
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

var postStudent = async (req, res) => {
    
    await new Students(req.body).save((err, data) =>{
    
    const { error } = validateStudent(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    if(err){
        res.status(500).json({ message:"Something went wrong"});
    }
    res.status(200).json({
        message:"Student created",
        data,
    })
    })
}

exports.postStudent = postStudent;

router.post('/', postStudent);



router.put('/:id', async (req, res) => {
    const { error } = validateStudent(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let studentID = req.params.id;
    await Students.findOneAndUpdate({_id: studentID}, {$set : req.body}, async(err, data)=>{
        if(err){
            res.status(500).json({
                message:
                "Something went Wrong"
            });
        } else{
            res.status(200).json({
                message: "Student update",
                data,
            });
        }
    });
});



router.delete('/:id', async(req, res) => {
    let studentID = req.params.id;
    await Students.findOneAndDelete({_id: studentID}, async(err, data)=>{
        if(err){
            res.status(500).json({
                message:
                "Something went Wrong"
            });
        } else{
            res.status(200).json({
                message: "Student Deleted",
                data,
            });
        }
    });
});

function validateStudent(student) {
    const codePattern = /.{7}/
    const namePattern = /^([a-zA-Z]|-|,)+$/
    const schema = Joi.object({
        name: Joi.string().regex(namePattern).required(),
        code: Joi.string().regex(codePattern).required()
    });
    return schema.validate(student);
}
module.exports.router = router;
module.exports.postStudent = postStudent;
