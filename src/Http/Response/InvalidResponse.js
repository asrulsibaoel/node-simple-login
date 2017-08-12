module.exports = (message, res) => {
    console.log(message);
    res.status(400);
    res.json({
        success: false,
        status: 400,
        message: message,
        data: {},
        'error-code': 3
    });
};