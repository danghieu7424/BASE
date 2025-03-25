const express = require("express");
const mysql = require("mysql2");

const router = express.Router();


/**
 * Cấu hình kết nối MySQL sử dụng connection pool.
 * @type {mysql.Pool}
 */

const pool = mysql.createPool({
    host: "db.dh74.io.vn",
    user: "QLHocPhan",
    password: "123456",
    database: "QLHocPhanDB",
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
    connectTimeout: 10000,
    timezone: '+07:00'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Lỗi kết nối MySQL:", err.stack);
        return;
    }
    console.log("Đã kết nối đến MySQL");
    connection.release();
});

/**
 * Thực hiện truy vấn SQL với các tham số.
 * @param {string} query - Câu truy vấn SQL.
 * @param {Array} params - Tham số cho câu truy vấn.
 * @return {Promise} Trả về một Promise với kết quả truy vấn.
 */
function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = router;