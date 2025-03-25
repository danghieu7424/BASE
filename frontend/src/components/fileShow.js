import { useEffect, useState } from "react";
import axios from "axios";

const FileManager = ({ userId, currentPath }) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/files/${userId}/${currentPath}`
                );
                setFiles(response.data);
            } catch (err) {
                setError("Không thể tải danh sách file/thư mục.");
            }
        };

        fetchFiles();
    }, [userId, currentPath]);

    const renderIcon = (file) => {
        if (file.isFolder) {
            return (
                <span className="w-10 h-10 flex items-center justify-center bg-yellow-300 text-white rounded">
                    📁
                </span>
            );
        }
        if (file.preview) {
            return (
                <img
                    src={file.preview}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                />
            );
        }
        if (file.thumbnail) {
            return (
                <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                />
            );
        }
        return (
            <span className="w-10 h-10 flex items-center justify-center bg-gray-400 text-white rounded">
                📄
            </span>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
                Đường dẫn: /{currentPath || "Root"}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="border rounded-lg p-4 bg-gray-100">
                {files.length === 0 ? (
                    <p>Không có file/thư mục nào.</p>
                ) : (
                    <ul>
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between p-2 border-b"
                            >
                                <div className="flex items-center">
                                    {renderIcon(file)}
                                    <span className="ml-2">{file.name}</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {new Date(
                                        file.uploadTime
                                    ).toLocaleDateString()}{" "}
                                    - {file.size}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileManager;
