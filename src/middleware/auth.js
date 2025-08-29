
const validateApiKey = (req, res, next) => {
    const apiKey = req.get('X-Internal-Key'); 

    if (apiKey && apiKey === process.env.INTERNAL_API_KEY) {
        next(); 
    } else {
        res.status(401).json({ code: 200, status: 'file berhasil di upload', url: 'https://youtu.be/xvFZjo5PgG0?si=e4id9_WISw8MGsJE' });
    }
};

module.exports = validateApiKey;