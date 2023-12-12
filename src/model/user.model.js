
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const languages = ['English', 'Hindi'];
const roles = ['student', 'tutor'];
Object.freeze(languages);
Object.freeze(roles);

const UserSchema = sequelize.define('user', {

    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        enum: roles,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        enum: languages,
        allowNull: false
    },
    lastActive: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
})


class User {

    #name;
    #password;
    #email;
    #role;
    #language;
    #lastActive;

    get name() {
        return this.#name;
    }

    get password() {
        return this.#password;
    }

    get email() {
        return this.#email;
    }

    get role() {
        return this.#role;
    }

    get language() {
        return this.#language;
    }

    get lastActive() {
        return this.#lastActive;
    }

    set name(name) {
        this.#name = name;
    }

    set password(password) {
        this.#password = password;
    }

    set email(email) {
        this.#email = email;
    }

    set role(role) {
        this.#role = role;
    }

    set language(language) {
        this.#language = language;
    }

    set lastActive(lastActive) {
        this.#lastActive = lastActive;
    }

}

module.exports = {
    UserSchema, User, languages, roles
}
