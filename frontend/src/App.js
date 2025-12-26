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

  // 🔒 HARD BLOCK (NO PASSWORD = NO ADMIN)
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
        <h3>Lilizec Transport</h3>
        <div>
          <button onClick={() => setPage("home")}>Home</button>{" "}
          <button onClick={openAdmin}>Admin</button>
        </div>
      </div>

      {/* HOME PAGE */}
      {page === "home" && (
        <div>
          <h2>Home Page</h2>
          <p>This page is public.</p>
        </div>
      )}

      {/* ADMIN PAGE */}
      {page === "admin" && isAdmin && (
        <div>
          <h2>Admin Panel 🔐</h2>
          <p>You are logged in as admin.</p>

          <div
            style={{
              marginTop: 20,
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 5,
              background: "#f9f9f9",
            }}
          >
            <h4>Admin Actions</h4>
            <ul>
              <li>View bookings</li>
              <li>Manage users</li>
              <li>Update status</li>
            </ul>
          </div>

          <br />
          <button onClick={logout}>Logout</button>
        </div>
      )}

      {/* SAFETY GUARD */}
      {page === "admin" && !isAdmin && (
        <div>
          <h2>Access Denied</h2>
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: "center", opacity: 0.5 }}>
        Made with Emergent
      </div>
    </div>
  );
}

export default App;
