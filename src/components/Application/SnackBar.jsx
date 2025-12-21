import { useEffect, useState } from "react";

export default function Snackbar({ open, message, type = "info", onClose, duration = 5000 }) {
    const [timeLeft, setTimeLeft] = useState(duration / 1000);

    useEffect(() => {
        if (open) {
            setTimeLeft(duration / 1000);

            // Countdown every second
            const interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
            }, 1000);

            // Auto-close after duration
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, [open, duration, onClose]);

    return (
        <div
            style={{
                position: "fixed",
                top: open ? "20px" : "-100px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor:
                    type === "success"
                        ? "#16a34a"
                        : type === "error"
                            ? "#dc2626"
                            : "#2563eb",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease-in-out",
                zIndex: 9999,
                minWidth: "250px",
                maxWidth: "400px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div style={{ flex: 1, textAlign: "center" }}>
                <div>{message}</div>
                <small style={{ fontSize: "12px", opacity: 0.8 }}>
                    Closing in {timeLeft}s...
                </small>
            </div>

            {/* ❌ Close Button */}
            <button
                onClick={onClose}
                style={{
                    marginLeft: "10px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "18px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                ×
            </button>
        </div>
    );
}
