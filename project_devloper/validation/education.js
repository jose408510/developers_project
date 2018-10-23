const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){

    let errors = {};

    data.schoool  = !isEmpty(data.schoool) ? data.schoool: '' ; 
    data.degree = !isEmpty(data.degree) ? data.degree: '' ; 
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy: '' ; 
    data.from = !isEmpty(data.from) ? data.from: '' ; 



    if(!Validator.isEmpty(data.school)){
        errors.school = 'school title is required';
    }
    if(!Validator.isEmpty(data.degree)){
        errors.degree = 'degree field is required';
    }
    if(!Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'field of study is required';
    }
    if(!Validator.isEmpty(data.from)){
        errors.from = 'from date field is required';
    }




    return {
        errors,
        isValid: isEmpty(errors)
    }


}