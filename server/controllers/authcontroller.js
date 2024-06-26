import usermodel from '../models/usermodel.mjs';
export const registercontroller = async (req, res, next) => {
    const { name, email, password } = req.body;
    //validate
    if (!name) {
        next("name is required");
    }
    if (!email) {
        next("email is required");
    }
    if (!password) {
        next("password is required and greater than 6 characters");
    }
    const existinguser = await usermodel.findOne({ email });
    if (existinguser) {
        next('Email already register please login');
    }
    const user = await usermodel.create({ name, email, password });
    //token
    const token = user.createJWT();
    res.status(201).send({
        success: true,
        message: 'user created successfully',
        user:{
            name:user.name,
            lastname:user.lastName,
            email:user.email,
            location:user.location
        },
        token,
    });
};

export const loginController = async(req,res) => {
    const {email,password}=req.body
    //validation
    if(!email || !password){
        next('Please provide all fields')
    }
    //find user by email
    const user = await usermodel.findOne({email}).select("+password")
    if(!user){
        next('Invalid Username or Password')
    }
    //compare password
    const isMatch =await user.comparePassword(password)
    if(!isMatch)
        {
            next('Invalid Username or Password')
        }
    user.password=undefined;
    const token = user.createJWT()
    res.status(200).json({
        success:true,
        message:'Login Successfully',
        user,
        token,
    })
} ;