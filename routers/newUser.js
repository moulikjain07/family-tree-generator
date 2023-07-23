const express = require('express')
const router = express.Router()

const  { 
    addUser,
    login
} = require('../controllers/login')

router.route('/').get(login).post(addUser);

module.exports = router 