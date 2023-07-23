const express = require('express')
const router = express.Router()

const  { getPerson, 
    createPerson, 
} = require('../controllers/people')

router.route('/').get(getPerson).post(createPerson);

module.exports = router 