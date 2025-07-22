const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    audioUrl:{
        type: String,
        required:true
    },
     transcribedText:{
        type:String,
        default:null
     },
     summaryText: {
     type: String,
     default: null, 
  },
     language:{
        type:String,
        default:null
     }
},{timestamps:true});

const Transcription =  mongoose.model("Transcription", transcriptionSchema);
module.exports  = Transcription