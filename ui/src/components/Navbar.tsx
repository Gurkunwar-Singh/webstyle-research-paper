import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logoDot}></span>
        <span style={styles.brand}>Web Pattern Analyzer</span>
      </div>

      <div style={styles.right}>
        <span style={styles.version}>v1.0</span>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid #e5e5e5",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#6c5ce7",
  },
  brand: {
    fontSize: "14px",
    fontWeight: 500,
  },
  right: {
    fontSize: "12px",
    color: "#777",
  },
  version: {
    background: "#f0f0f0",
    padding: "4px 8px",
    borderRadius: "12px",
  },
};

export default Navbar;  