const validateData =  (req) =>{
const {firstName , lastName , email , password} = req.body;

if(!email) return res.status(404).json({message:"Email is Required"});
if(!password) return res.status(404).json({message:"Password is Required"});
if(!firstName) return res.status(404).json({message:"Name is Required"});

}
module.exports = {validateData}