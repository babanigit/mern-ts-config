import mongoose,{InferSchemaType} from "mongoose";

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique:true,
    },
    email: {
        type: String,
        require: true,
        unique:true,
        select:false
    },
    password: {
        type: String,
        require: true,
        select:false
    },
}, {
    timestamps: true,
})

type user= InferSchemaType<typeof userSchema>;

 const UserModel= mongoose.model<user>("UserData", userSchema)
 export default UserModel;