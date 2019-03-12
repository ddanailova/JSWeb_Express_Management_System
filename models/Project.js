const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name:{
        type:Schema.Types.String,
        required:[true,'Name is required'],
        unique:[true,'Project with such name exists'],
    },
    description:{
        type:Schema.Types.String,
        required:true,
        maxlength:[50, 'Description maximum lenght should be 50 symbols ']
    },
    team:{
        type:Schema.Types.ObjectId,
        ref:'Team'
    }
});

module.exports=mongoose.model('Project', projectSchema);