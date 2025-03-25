const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
    output: {
        path: path.join(__dirname, "/build"), // Thư mục chứa file được build ra
        filename: "src/js/[name].js", // Tên file JS và phân tách theo thư mục js/
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Sẽ sử dụng babel-loader cho những file .js
                exclude: /node_modules/, // Loại trừ thư mục node_modules
                use: ["babel-loader"],
            },
            {
                test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/i, // Để xử lý hình ảnh
                type: "asset/resource", // Sử dụng webpack 5 asset modules
                generator: {
                    filename: "src/img/[name].[contenthash][ext]", // Lưu ảnh trong thư mục img/
                },
            },
            {
                test: /\.(woff|woff2|ttf|eot|otf)$/i, // Để xử lý font
                type: "asset/resource", // Sử dụng webpack 5 asset modules
                generator: {
                    filename: "src/fonts/[name].[contenthash][ext]", // Lưu font trong thư mục fonts/
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            inject: true,
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, "public"), // Thư mục tĩnh
        port: 8080, // Cổng chạy server
        open: true, // Mở trình duyệt khi chạy
        hot: true, // Bật chế độ hot-reload
        historyApiFallback: true, // Điều hướng tất cả các route về index.html
    },
};
