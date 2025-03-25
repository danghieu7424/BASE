function modal(title, message, type = "ok") {
    return new Promise((resolve) => {
        // Xóa modal cũ nếu có
        const existingModal = document.getElementById("modal_container");
        if (existingModal) existingModal.remove();

        // Tạo modal container
        const modalContainer = document.createElement("div");
        modalContainer.id = "modal_container";
        Object.assign(modalContainer.style, {
            position: "absolute",
            inset: "0",
            background: "transparent",
            backdropFilter: "blur(10px)",
            display: "block",
            transition: "all ease-in-out 0.5s",
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            color: "#221",
            zIndex: "999999999",
        });

        // Tạo modal
        const modal = document.createElement("div");
        modal.id = "modal";
        Object.assign(modal.style, {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(400px, 90%)",
            padding: "4rem 0.625rem 0.625rem",
            border: "0.0625rem solid #3333",
            borderRadius: ".5rem",
            background: "#FFF",
        });

        // Tạo tiêu đề
        const modalTitle = document.createElement("h2");
        modalTitle.id = "modal-title";
        modalTitle.textContent = title;
        Object.assign(modalTitle.style, {
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3333",
            padding: ".5rem 1rem",
            borderRadius: "0 0 .5rem .5rem",
        });

        // Thêm phần tử thay thế ::before
        const beforeSpan = document.createElement("span");
        Object.assign(beforeSpan.style, {
            position: "absolute",
            top: "0",
            left: "-0.5rem",
            width: "0.5rem",
            height: "0.5rem",
            backgroundColor: "#3333",
            maskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,24L24,24C24,10.75,13.25,0,0,0v0l24,0V24z'/%3E%3C/svg%3E\")",
            WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,24L24,24C24,10.75,13.25,0,0,0v0l24,0V24z'/%3E%3C/svg%3E\")",
        });

        // Thêm phần tử thay thế ::after
        const afterSpan = document.createElement("span");
        Object.assign(afterSpan.style, {
            position: "absolute",
            top: "0",
            right: "-0.5rem",
            width: "0.5rem",
            height: "0.5rem",
            backgroundColor: "#3333",
            transform: "rotate(-90deg)",
            maskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,24L24,24C24,10.75,13.25,0,0,0v0l24,0V24z'/%3E%3C/svg%3E\")",
            WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,24L24,24C24,10.75,13.25,0,0,0v0l24,0V24z'/%3E%3C/svg%3E\")",
        });

        modalTitle.appendChild(beforeSpan);
        modalTitle.appendChild(afterSpan);

        // Tạo nội dung
        const modalMessage = document.createElement("p");
        modalMessage.id = "modal-message";
        modalMessage.textContent = message;
        Object.assign(modalMessage.style, {
            position: "relative",
            padding: ".625rem 1rem",
            textAlign: "justify",
        });

        // Tạo nút bấm
        const modalBtn = document.createElement("div");
        modalBtn.id = "modal-btn";
        Object.assign(modalBtn.style, {
            position: "relative",
            padding: ".625rem 1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: ".625rem",
        });

        const createButton = (text, color, bgColor, returnValue) => {
            const button = document.createElement("button");
            button.textContent = text;
            Object.assign(button.style, {
                position: "relative",
                width: "4rem",
                padding: ".2rem 1rem",
                border: "0.0625rem solid",
                borderRadius: ".75rem",
                cursor: "pointer",
                color: color,
                background: bgColor,
            });
            button.onclick = () => {
                document.body.removeChild(modalContainer);
                resolve(returnValue);
            };
            return button;
        };

        if (type === "yes_no") {
            const yesButton = createButton("Yes", "#559847", "#f8fcf5", true);
            const noButton = createButton("No", "#9c3d43", "#fbf7f6", false);
            modalBtn.appendChild(yesButton);
            modalBtn.appendChild(noButton);
        } else if (type === "ok") {
            const okButton = createButton("OK", "#559847", "#f8fcf5", true);
            modalBtn.appendChild(okButton);
        }

        // Gán phần tử con
        modal.appendChild(modalTitle);
        modal.appendChild(modalMessage);
        modal.appendChild(modalBtn);
        modalContainer.appendChild(modal);
        document.body.appendChild(modalContainer);
    });
}
