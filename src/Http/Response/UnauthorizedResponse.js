module.exports = (message,res) => {
    console.log(message);
    res.status(401);
    res.json({
        status: 401,
        message: {
            'error-code': 4
        },
        description: message
    });
}