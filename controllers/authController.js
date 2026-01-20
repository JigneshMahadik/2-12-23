const db = require('../dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = (req, res) => {
    const newUser = req.body;
    const username = newUser.username;
    const password = newUser.password;
    const email = newUser.email;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO users (role_id, user_name, password, email) VALUES (?, ?, ?, ?)', [1, username, hashedPassword, email], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log("User registered successfully");
        
        return res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
}

const login = (req, res) => {
    // check if user registered or not
    const existingUser = req.body;

    const query = 'SELECT * FROM users WHERE email = ?'
    db.query(query, [existingUser.email], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];
        const isPasswordValid = bcrypt.compareSync(existingUser.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token here
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', "Token" : token });
    });
    // const password = existingUser.pass
}


const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("token : ", authHeader);
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied. Token missing.' });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}


module.exports = {
    registerUser,
    login,
    authMiddleware
};