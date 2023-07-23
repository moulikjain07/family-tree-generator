let mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.connect(`mongodb://localhost/family-member`)
  .then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  })
}
  
module.exports = connectDB


// run()
// async function run(){
  // const user = await User.create({
  //   name: "Moulik Jain",
  //   age : 19,
  //   gender: "male",
  //   email: "moulik@gmail.com",
  //   password: "1234"
  // })
  // console.log(user)
  // try{
  //   const user = await Schema.findById("62d8f5968e45fc2a4e7b292b")
  //   console.log(user)
  // }
  // catch(e){
  //   console.log(e.message)
  // }
//   try{
//     const user = await User.find({name: "Moulik Jain"})
//     console.log(user)
//   }
//   catch(e){
//     console.log(e.message)
//   }
// } 

