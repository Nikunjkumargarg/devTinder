const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstname, lastname, emailId, password} = req.body;
    if(!firstname || !lastname){
        throw new Error("Please enter the name");
    }
    else if(firstname.length < 3 || firstname.length > 50){
        throw new Error("Name must be between 3 and 50 characters");
    }
    else if(lastname.length < 3 || lastname.length > 50){
        throw new Error("Name must be between 3 and 50 characters");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be strong");
    }
}

module.exports = {validateSignUpData};