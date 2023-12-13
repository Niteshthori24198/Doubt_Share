
class IllegalRequestError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    IllegalRequestError
}