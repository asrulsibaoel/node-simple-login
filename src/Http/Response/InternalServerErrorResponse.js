module.exports = (message, res) => {
    console.log(message);
    res.status(500);
    res.json({
        status: 500,
        message: {
            'error-code': 5,
            'message' : message
        },

        data : {}
    });
};