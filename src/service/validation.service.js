const { languages, grades, subjects } = require("../model/user.model");

const isNameValid = (name) => {

    return typeof name === 'string' && name.length > 0;
}

const isEmailValid = (email) => {

    let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return typeof email === 'string' && email.length > 0 && pattern.test(email);
}

const isPasswordValid = (password) => {

    return typeof password === 'string' && password.length > 0;
}

const isLanguageValid = (language) => {

    return languages.includes(language);
}

const isGradeValid = (grade) => {

    return grades.includes(+grade);
}


const isSubjectValid = (subject) => {

    return subjects.includes(subject);
}

const isAssignedGradesSubjectsValid = (ags) => {

    if (typeof ags !== 'object') {
        return false;
    }

    for (let grade in ags) {
        if (!isGradeValid(grade)) {
            return false;
        }
        for (let sub of ags[grade]) {
            if (!subjects.includes(sub)) {
                return false;
            }
        }
    }

    return true;
}


module.exports = {
    isNameValid,
    isEmailValid,
    isPasswordValid,
    isLanguageValid,
    isGradeValid,
    isSubjectValid,
    isAssignedGradesSubjectsValid
}