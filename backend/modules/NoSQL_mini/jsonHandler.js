const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class JsonHandler {
    /**
     * @param {string} fileName - Tên file JSON trong thư mục `db/`
     */
    constructor(fileName) {
        // Định nghĩa đường dẫn mặc định là thư mục `db/`
        this.filePath = path.join(__dirname, 'db', `${fileName}.json`);
    }

    /**
     * Đọc dữ liệu từ file JSON
     * @return {Array|Object} - Dữ liệu JSON đã parse, mặc định là mảng nếu file trống
     */
    readJson() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return [];
            }
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Lỗi khi đọc file JSON:", error);
            return [];
        }
    }

    /**
     * Ghi dữ liệu vào file JSON
     * @param {Array|Object} data - Dữ liệu cần ghi vào file
     * @return {boolean} - Trả về `true` nếu ghi thành công, ngược lại là `false`
     */
    writeJson(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 4), 'utf-8');
            return true;
        } catch (error) {
            console.error("Lỗi khi ghi file JSON:", error);
            return false;
        }
    }

    /**
     * Thêm dữ liệu mới với ID tự động
     * @param {Object} newData - Dữ liệu cần thêm vào
     * @return {Object|null} - Trả về dữ liệu đã thêm (gồm ID), hoặc `null` nếu lỗi
     */
    addData(newData) {
        try {
            let jsonData = this.readJson();
            newData.id = uuidv4(); // Tạo ID duy nhất
            jsonData.push(newData);
            this.writeJson(jsonData);
            return newData;
        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu:", error);
            return null;
        }
    }

    /**
     * Tìm dữ liệu theo điều kiện
     * @param {Object} query - Điều kiện tìm kiếm (ví dụ: `{name: "John"}`)
     * @return {Array} - Mảng chứa các bản ghi phù hợp
     */
    findData(query) {
        try {
            let jsonData = this.readJson();
            return jsonData.filter(item =>
                Object.keys(query).every(key => item[key] === query[key])
            );
        } catch (error) {
            console.error("Lỗi khi tìm dữ liệu:", error);
            return [];
        }
    }

    /**
     * Cập nhật dữ liệu theo ID
     * @param {string} id - ID của bản ghi cần cập nhật
     * @param {Object} updatedFields - Trường cần cập nhật (ví dụ `{age: 31}`)
     * @return {Object|boolean} - Trả về dữ liệu đã cập nhật hoặc `false` nếu không tìm thấy
     */
    updateData(id, updatedFields) {
        try {
            let jsonData = this.readJson();
            let index = jsonData.findIndex(item => item.id === id);
            if (index === -1) return false;

            jsonData[index] = { ...jsonData[index], ...updatedFields };
            this.writeJson(jsonData);
            return jsonData[index];
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu:", error);
            return false;
        }
    }

    /**
     * Xóa dữ liệu theo ID
     * @param {string} id - ID của bản ghi cần xóa
     * @return {boolean} - Trả về `true` nếu xóa thành công, `false` nếu không tìm thấy
     */
    deleteData(id) {
        try {
            let jsonData = this.readJson();
            let filteredData = jsonData.filter(item => item.id !== id);
            if (filteredData.length === jsonData.length) return false;

            this.writeJson(filteredData);
            return true;
        } catch (error) {
            console.error("Lỗi khi xóa dữ liệu:", error);
            return false;
        }
    }
}

module.exports = JsonHandler;
