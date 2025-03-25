import React, { useEffect, useState } from "react";
const Dashboard = () => {
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
                const res = await fetch("http://localhost:3000/api/auth/verify", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    setError("Phiên đăng nhập không hợp lệ!");
                    localStorage.removeItem("token");
                    return;
                }

                const data = await res.json();
                setUser(data.user);
                console.log("User Info:", data.user);
            } catch (err) {
                setError("Lỗi khi xác thực!");
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="dashboard">
            <h2>Thông tin người dùng</h2>
            {error ? (
                <p className="error-text">{error}</p>
            ) : user ? (
                <div>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Vai trò:</strong> {user.role}
                    </p>
                </div>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default Dashboard;
