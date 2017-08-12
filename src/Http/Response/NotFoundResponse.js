module.exports = (message, res) => {
    console.log(message);
    res.status(404);
    res.json({
        status: 404,
        message: {
            'error-code': 0
        },
        data: {},
        description: message
    });
};