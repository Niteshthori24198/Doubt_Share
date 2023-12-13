
class UserValidationError extends Error {
    constructor(msg) {
        super(msg);
    }
}

module.exports = {
    UserValidationError
}