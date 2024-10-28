const express = require('express');
const { body } = require('express-validator');
const courseControllers = require('./controller');
const verifyToken = require('./verifyToken');
const router = express.Router();
router.use(express.json());

const userRoles = require("./user-roles");
const allowedTo = require("./allowedTo");

router.route('/')
    .get(courseControllers.getAllCourses);
router.route('/:courseID')
    .get(courseControllers.getCourse)
    .patch(courseControllers.updateCourse)
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), courseControllers.deleteCourse);
//  3ade el awl 3ala function "verifyToken" atakd en el token tmam w b3d kda allow el deleting ll admin w el manager bs
    
router.route('/addcourses')
    .post([body("title")
        .notEmpty()
        .withMessage("Tite is required")
        .isLength({ min: 2 })
        .withMessage("At least 2 digits")],
        [body("price")
            .notEmpty()
            .withMessage("Price required")
        ],
        courseControllers.addCourse
);
module.exports = router;