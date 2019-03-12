const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name:{
        type:Schema.Types.String,
        required:[true,'Name is required'],
        unique:[true,'A team with this name exists!'],
    },
    projects:[{
        type:Schema.Types.ObjectId,
        ref:'Project',
        default:[]
    }],
    members:[{
        type:Schema.Types.ObjectId,
        ref:'User',
        default:[]
    }]
});

module.exports=mongoose.model('Team', teamSchema);