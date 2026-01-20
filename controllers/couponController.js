const db = require('../dbConfig');

const addCoupon = (req, res) => {
    const newCoupon = req.body;
    // console.log(newCoupon);
    const query = 'INSERT INTO coupons SET ?';
    db.query(query, [newCoupon], (err, result) => {
        if (err) {
            console.error("Error adding coupon:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(201).json({ message: 'Coupon added successfully', couponId: result.insertId });
    });
}

module.exports = {
    addCoupon
}