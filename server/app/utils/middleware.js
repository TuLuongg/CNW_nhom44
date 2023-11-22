'use strict';

const jwt = require('jsonwebtoken');
const _const = require('../config/constant');
const Category = require('../models/category');
const Product = require('../models/product');
const Order = require('../models/order');
const News = require('../models/news');
const ReviewModel = require('../models/review');

module.exports = {
    checkLogin: (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send('Access Denied');

        try {
            const verified = jwt.verify(token, _const.JWT_ACCESS_KEY);
            next();
        } catch (err) {
            return res.status(400).send('Invalid Token');
        }
    },

    getCategory: async (req, res, next) => {
        let category;
        try {
            category = await Category.findById(req.params.id);
            if (category == null) {
                return res.status(404).json({ message: 'Cannot find category' });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.category = category;
        next();
    },

    getProduct: async (req, res, next) => {
        try {
            const productId = req.params.id;
        
            // Lấy thông tin sản phẩm
            const product = await Product.findById(productId).populate('category');
            if (!product) {
              return res.status(404).json({ message: 'Cannot find product' });
            }
        
            // Lấy thông tin đánh giá
            const reviews = await ReviewModel.find({ product: productId }).select('comment rating createdAt');
            const reviewCount = reviews.length;
            let totalRating = 0;
        
            // Tính trung bình số sao đánh giá
            if (reviewCount > 0) {
              totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;
            }
        
            // Tính thống kê đánh giá
            const reviewStats = {};
            for (const review of reviews) {
              if (reviewStats[review.rating]) {
                reviewStats[review.rating]++;
              } else {
                reviewStats[review.rating] = 1;
              }
            }

            const reviewStatsArray = Array.from({ length: 5 }, (_, i) => {
                const rating = i + 1;
                 return reviewStats[rating] || 0;

              });
              
        
            res.status(200).json({
              product: product,
              reviewStats: reviewStatsArray,
              avgRating: totalRating,
              reviews: reviews
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
          }
          next();
    },

    getNews: async (req, res, next) => {
        let news;
        try {
            news = await News.findById(req.params.id);
            if (news == null) {
                return res.status(404).json({ message: 'Cannot find news' });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.news = news;
        next();
    },

    getOrder: async (req, res, next) => {
        let order;
        try {
            order = await Order.findById(req.params.id);
            if (order == null) {
                return res.status(404).json({ message: 'Cannot find order' });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.order = order;
        next();
    },

    checkRole: (role) => async (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send('Forbidden');
        }
        next();
    }
}