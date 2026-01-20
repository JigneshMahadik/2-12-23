// const express = require('express');
const db = require('../dbConfig');

const addProduct = (req, res) => {
    const newProduct = req.body;
    const proName = newProduct.productName;
    const price = newProduct.price;
    const catId = newProduct.categoryId;
    const quant = newProduct.quantity;

    db.query('INSERT INTO products (product_name, price, active, category_id, quantity, added_by) VALUES (?, ?, ?, ?, ?)',
            [proName, price, 1, catId, quant, req.user.userId], (err, result) => {
        if (err) {
            console.error('Error adding product to database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Logic to add the product to the database
        return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    });
}

const productsListing = (req, res) => {
    const query = 'SELECT p.product_id, p.product_name, p.price, p.active, c.category_name FROM products as p INNER JOIN category as c ON p.category_id = c.category_id WHERE c.category_id = ? AND p.active = ?';
    db.query(query, [ req.query.categoryId, req.query.active], (err, results) => {
        if (err) {
            console.error('Error fetching products from database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        } 
        return res.status(200).json({ products: results, totalCount: results.length });
    });
}

module.exports = {
    addProduct,
    productsListing
}