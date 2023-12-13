
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const languages = ['English', 'Hindi'];
const roles = ['student', 'tutor'];
const subjects = ['English', 'Hindi', 'Science', 'Math'];
const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
Object.freeze(languages);
Object.freeze(roles);
Object.freeze(subjects);
Object.freeze(grades);

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
    isValidated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
})

const UserSubjectGradeSchema = sequelize.define('user_subject_grade', {

    email: {
        type: DataTypes.STRING,
        references: {
            model: UserSchema,
            key: 'email'
        }
    },
    subject: {
        type: DataTypes.STRING,
        enum: subjects,
        allowNull: true
    },
    grade: {
        type: DataTypes.STRING,
        enum: grades,
        allowNull: false
    }
})

class User {

    #name;
    #password;
    #email;
    #role;
    #language;
    #lastActive;
    #isValidated;

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

    get isValidated() {
        return this.#isValidated;
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

    set isValidated(isValidated) {
        this.#isValidated = isValidated;
    }
}

class Student extends User {
    
    #grade;

    get grade() {
        return this.#grade;
    }

    set grade(grade) {
        this.#grade = grade;
    }
}

class Tutor extends User {
    
    /**
     * @type {Map<number, string[]>}
     */
    #assignedGradesSubjects = new Map();

    get assignedGradesSubjects() {
        return this.#assignedGradesSubjects;
    }

    set assignedGradesSubjects(assignedGradesSubjects) {
        this.#assignedGradesSubjects = assignedGradesSubjects;
    }
}

module.exports = {
    UserSchema, User, languages, roles, UserSubjectGradeSchema, subjects, grades, Tutor, Student
}
