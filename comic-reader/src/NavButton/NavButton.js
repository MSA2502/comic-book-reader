// NavButton.js
export default function NavButton({ onClick, disabled, side, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        margin: "0 20px", 
        [side]: "10px", 
        fontSize: "48px",
        padding: "20px 40px",
        cursor: disabled ? "not-allowed" : "pointer",
        background: "#fff",
        border: "2px solid #000000ff",
        borderRadius: "26px",
        boxShadow: "0px 2px 6px rgba(161, 93, 93, 0.2)",
      }}
    >
      {children}
    </button>
  );
}
