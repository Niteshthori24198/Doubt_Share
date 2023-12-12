const { languages } = require("../model/user.model");

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


module.exports = {
    isNameValid,
    isEmailValid,
    isPasswordValid,
    isLanguageValid
}