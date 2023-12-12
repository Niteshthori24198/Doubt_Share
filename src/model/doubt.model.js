
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DoubtSchema = sequelize.define('doubt', {
    name: {
        type: DataTypes.STRING
    }
});

class Doubt {
    
    #name;

    constructor(name) {
        this.#name = name;
    }
}

module.exports = {
    DoubtSchema, Doubt
}
