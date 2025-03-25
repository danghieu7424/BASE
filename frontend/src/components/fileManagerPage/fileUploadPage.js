import React, { useState, useEffect } from "react";
import { Upload, X, FolderOpen } from "lucide-react";

import "../../access/css/fileUploadPage.css";

export default function FileUploadPage() {
    const [files, setFiles] = useState([]);
    const [relativePaths, setRelativePaths] = useState({});
    const [uploading, setUploading] = useState(false);

    const [fileList, setFileList] = useState([]);

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Bạn chưa đăng nhập!");
                return;
            }

            try {
                const res = await fetch(
                    "http://localhost:3000/api/auth/verify",
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!res.ok) {
                    setError("Phiên đăng nhập không hợp lệ!");
                    localStorage.removeItem("token");
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                setError("Lỗi khi xác thực!");
            }
        };

        fetchUser();
    }, []);

    /**
     * upload file/folder
     */
    const handleFileChange = (event) => {
        const newFiles = [...event.target.files];
        setFiles(newFiles);

        const paths = {};
        newFiles.forEach((file) => {
            paths[file.name] = file.webkitRelativePath || file.name;
        });

        setRelativePaths(paths);
    };

    const handleUpload = async (currentPath) => {
        if (files.length === 0) {
            alert("Vui lòng chọn ít nhất một file hoặc folder!");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("relativePaths", JSON.stringify(relativePaths));

        try {
            // Kiểm tra currentPath có đúng kiểu string không
            if (typeof currentPath !== "string") {
                console.error(
                    "Lỗi: currentPath không phải string!",
                    currentPath
                );
                alert("Lỗi đường dẫn!");
                return;
            }

            const encodedPath = encodeURIComponent(currentPath);
            const apiUrl = `http://localhost:3000/api/upload/${user.username}/${encodedPath}`;
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            alert(error.message);
            console.error(error);
        }

        setUploading(false);
        setFiles([]);
        setRelativePaths({});
    };

    /**
     * create folder
     */
    const handleCreateFolder = async (folderName, currentPath) => {
        if (!folderName) {
            alert("Vui lòng nhập tên thư mục!");
            return;
        }

        try {
            const fullPath = `${currentPath}/${folderName}`;
            const encodedPath = encodeURIComponent(fullPath);
            const apiUrl = `http://localhost:3000/api/create-folder/${user.username}/${encodedPath}`;

            const response = await fetch(apiUrl, {
                method: "POST",
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    /**
     * get render in folder
     */
    const fetchFiles = async (currentPath) => {
        try {
            const encodedPath = encodeURIComponent(currentPath);
            const apiUrl = `http://localhost:3000/api/list/${user.username}/${encodedPath}`;
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            setFileList(result);
        } catch (error) {
            alert("Lỗi khi lấy danh sách file!");
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFiles("");
        }
    }, [user]);

    return (
        <div className="upload-container">
            <h2 className="title">Upload Files & Folders</h2>

            {/* Chọn file */}
            <input
                type="file"
                multiple
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
                hidden
            />
            <label htmlFor="fileInput" className="upload-box">
                <Upload className="icon" /> Chọn file để tải lên
            </label>

            {/* Chọn folder */}
            <input
                type="file"
                multiple
                id="folderInput"
                className="hidden"
                onChange={handleFileChange}
                ref={(input) => {
                    if (input) {
                        input.setAttribute("webkitdirectory", "");
                        input.setAttribute("directory", "");
                    }
                }}
                hidden
            />

            <label htmlFor="folderInput" className="upload-box">
                <FolderOpen className="icon" /> Chọn thư mục để tải lên
            </label>

            {/* Danh sách file/folder đã chọn */}
            {files.length > 0 && (
                <div className="file-list">
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            <span>{relativePaths[file.name] || file.name}</span>
                            <X
                                className="remove-icon"
                                onClick={() => {
                                    const newFiles = files.filter(
                                        (_, i) => i !== index
                                    );
                                    const newPaths = { ...relativePaths };
                                    delete newPaths[file.name];

                                    setFiles(newFiles);
                                    setRelativePaths(newPaths);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Nút tải lên */}
            <button
                className="upload-button"
                onClick={() => handleUpload("")}
                disabled={uploading}
            >
                {uploading ? "Đang tải lên..." : "Tải lên"}
            </button>

            <br></br>
            {/* Ô nhập tên thư mục */}
            <input
                type="text"
                id="folderName"
                placeholder="Nhập tên thư mục..."
                className="folder-input"
            />

            {/* Nút tạo thư mục */}
            <button
                className="create-folder-button"
                onClick={() => {
                    const folderName =
                        document.getElementById("folderName").value;
                    handleCreateFolder(folderName, ""); // Thay "" bằng đường dẫn hiện tại nếu có
                }}
            >
                Tạo thư mục
            </button>

            <br></br>
            {/* Danh sách file/folder */}
            <div className="file-list">
                {fileList.map((item, index) => (
                    <div key={index} className={`file-item ${item.type}`}>
                        <span>
                            {item.type === "folder" ? "📁" : "📄"} {item.name}
                        </span>
                        <span>{item.uploadTime}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
