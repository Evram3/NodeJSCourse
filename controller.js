const Course = require('./course.model');
const httpStatusText = require('./httpStatusText');
const asyncWrapper = require('./asyncWrapper');
const appError = require('./appError');
const { validationResult } = require('express-validator');


const getAllCourses = async (req, res) => {
    const query = req.query;
    console.log(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find().limit(limit).skip(skip);
    res.json({ status: "Success", data: { courses: courses } });
};



const getCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseID);
        if (!course) {
            error = appError.create('Course not found', 404, httpStatusText.FAIL);
            return error;
        };
        return res.json({ status: httpStatusText.SUCCESS, data: { course } });
    }
);


const addCourse = asyncWrapper(
    async (req, res, next) => {
        let error = validationResult(req);
        if (!error.isEmpty) {
            err = appError.create("Can not be added", 404, httpStatusText.ERROR);
            return err;
        };
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
    }
);


const updateCourse = asyncWrapper(
    async (req, res, next) => {
        const courseID = req.params.id;
        const updatedCourse = await Course.updateOne({_id: courseID }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course: updatedCourse } });
        // if (err) {
        //     error = appError.create("Course can not be updated", 400, httpStatusText.ERROR);
        // };
    }
);


const deleteCourse = asyncWrapper(
    async (req, res) => {
        await Course.deleteOne({_id: req.params.courseID });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
    }
);


module.exports = {
    deleteCourse,
    updateCourse,
    addCourse,
    getCourse,
    getAllCourses
};