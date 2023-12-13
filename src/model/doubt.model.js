
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { UserSchema } = require("./user.model");

const DoubtSchema = sequelize.define('doubt', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: UserSchema,
            key: 'email'
        }
    },
    tutorEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: UserSchema,
            key: 'email'
        }
    },
    doubtSubject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doubtDescription: {
        type: DataTypes.STRING,
    },
    doubtSolution: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    doubtCreationTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
});

class Doubt {

    #id;
    #studentEmail;
    #tutorEmail;
    #doubtSubject;
    #doubtDescription;
    #doubtSolution;
    #doubtCreationTime;

    get id(){
        return this.#id;
    }

    get studentEmail() {
        return this.#studentEmail;
    }

    get tutorEmail() {
        return this.#tutorEmail;
    }

    get doubtSubject() {
        return this.#doubtSubject;
    }

    get doubtDescription() {
        return this.#doubtDescription;
    }

    get doubtSolution() {
        return this.#doubtSolution;
    }

    get doubtCreationTime() {
        return this.#doubtCreationTime;
    }

    set id(id) {
        this.#id = id;
    }

    set studentEmail(studentEmail) {
        this.#studentEmail = studentEmail;
    }

    set tutorEmail(tutorEmail) {
        this.#tutorEmail = tutorEmail;
    }

    set doubtSubject(doubtSubject) {
        this.#doubtSubject = doubtSubject;
    }

    set doubtDescription(doubtDescription) {
        this.#doubtDescription = doubtDescription;
    }

    set doubtSolution(doubtSolution) {
        this.#doubtSolution = doubtSolution;
    }

    set doubtCreationTime(doubtCreationTime) {
        this.#doubtCreationTime = doubtCreationTime;
    }

}


module.exports = {
    DoubtSchema, Doubt
}

