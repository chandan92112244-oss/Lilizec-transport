import React, { useState } from "react";

const ADMIN_PASSWORD = "Lilizec2025chandan";

function App() {
  const [page, setPage] = useState("home"); // home | admin
  const [isAdmin, setIsAdmin] = useState(false);

  const openAdmin = () => {
    const pass = window.prompt("Enter admin password");

    if (pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPage("admin");
    } else {
      alert("Wrong password");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setPage("home");
  };

  // HARD BLOCK (NO PASSWORD = NO ADMIN)
  if (page === "admin" && !isAdmin) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Access Denied</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
          paddingBottom: 10,
          marginBottom: 20,
        }}
      >
        <h2>Lilizec Transport</h2>
        <div>
          <button onClick={() => setPage("home")}>Home</button>{" "}
          <button onClick={openAdmin}>Admin</button>
        </div>
      </div>

      {/* HOME PAGE */}
      {page === "home" && (
        <div>
          <h3>Home Page</h3>
          <p>This page is public.</p>
        </div>
      )}

      {/* ADMIN PAGE */}
      {page === "admin" && isAdmin && (
        <div>
          <h3>Admin Panel 🔐</h3>
          <p>Only visible after correct password.</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
