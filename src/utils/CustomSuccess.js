class CustomSuccess {
    constructor(message, statusCode = 200, data = {}) {
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}

module.exports = CustomSuccess;