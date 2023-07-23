let User = require('../db/User')

const login = async (req, res)=>{
    return res.status(200).sendFile("c:/Users/admin/Desktop/New folder/family tree/public/login.html")
}

const addUser = async (req, res)=>{
    try{
        let newUser = await User.create(req.body)
        req.session.user_id = newUser._id
        // console.log(req.session.user_id)
        return res.status(201).redirect("http://localhost:5000/people")
    }
    catch(error){
        return res.status(400).send("Some Problem occured")
    }
}

module.exports = { addUser , login }