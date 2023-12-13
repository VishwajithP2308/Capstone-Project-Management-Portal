const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticationMiddleware = require('../middleware/authentication');
//const { sendLoginCredentials } = require('../controllers/emailController');


// check login
router.post('/login',userController.checkLogin);
// create new user
router.post('/user', authenticationMiddleware,userController.createUser);
// get all users if your are admin
router.get('/users', authenticationMiddleware, userController.getAllUsers);
// delete a user based on his/her email in query
router.delete('/user/:email', authenticationMiddleware, userController.deleteUserByEmail);
//update a user details based on his/her email provided in body
router.put('/user/:email', authenticationMiddleware, userController.updateUser);
//get a user deatails based on his/her email provided in params
router.get('/user/:email', authenticationMiddleware, userController.getUserByEmail);
//route to send email with login credentials
//router.post('/send-credentials', sendLoginCredentials);




router.post('/forgot-password', userController.forgotPassword);
module.exports = router;