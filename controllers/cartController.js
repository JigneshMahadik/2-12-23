const db = require('../dbConfig');

const addToCart = (req, result) => {
    // first check the user has added product in cart or not
    const query1 = 'SELECT * from cart WHERE user_id = ?';
    db.query(query1, [req.user.userId], (err, res) => {
        
        // If cart is empty
        if (res.length == 0) {
            console.log("Cart is empty");
            
            // 1 - make entry into cart table with user id and createdAt
            db.query('INSERT INTO cart (user_id, created_at) VALUES (?, NOW())', [req.user.userId], (err, res1) => {
                if (err) {
                    console.error("Error adding to cart:", err);
                    return result.status(500).json({ error: 'Internal server error' });
                }
                db.query('INSERT INTO cart_items (cart_id, product_id, quantity, price_at_that_time) VALUES (?, ?, ?, ?)',[res1.insertId, req.body.productId, 1, req.body.price], (err, res2) => {
                        if (err) {
                            console.error("Error adding item to cart:", err);
                            return result.status(500).json({ error: 'Internal server error' });
                        }
                    }
                );
                console.log("Product is added in cart");
                return result.status(200).json({ message: 'Product has been added in cart'});
            });
        }

        // If cart isn't empty
        const query2 = 'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = ? AND product_id = ?';
        db.query(query2, [res[0].cart_id, req.body.productId], (err, res3) => {
            if (err) {
                console.error("Error updating cart item:", err);
                return result.status(500).json({ error: 'Internal server error' });
            }
            console.log("Product quantity updated in cart");
            return result.status(200).json({ message: 'Product quantity has been updated in cart' });
        });
    });
}

const getCart = (req, res) => {
    const query = 'SELECT ci.quantity*ci.price_at_that_time AS total_price FROM cart_items AS ci INNER JOIN cart AS c ON ci.cart_id = c.cart_id WHERE c.user_id = ?';
    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart from database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ cart: results });
    });
}

const applyCoupon = (req, res) => {
    const query = 'SELECT eligible_categories FROM coupons WHERE coupon_code = ?'
    db.query(query, [req.query.couponCode], (err, results) => {
        if (err) {
            console.error('Error applying coupon:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Check if coupon is valid
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid coupon code' });
        }
        // Check coupon eligibility
        console.log("cou : ",results[0].eligible_categories);
        const data = results[0].eligible_categories.split(',').find(item => item == req.query.categoryId);
        if (!data) {
            return res.status(400).json({ message: 'Coupon not applicable for this category' });
        }
    });
}

module.exports = {
    addToCart,
    getCart,
    applyCoupon
}