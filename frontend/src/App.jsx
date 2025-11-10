import React, { useState } from "react";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [recs, setRecs] = useState([]);
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  async function handleAuth(e) {
    e.preventDefault();
    const endpoint = isRegister ? "register" : "auth/login";
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(err.detail || "Something went wrong!");
        return;
      }
      const data = await res.json();
      setMessage(isRegister ? "🎉 Registered Successfully!" : "✅ Logged In!");
      if (!isRegister) setToken(data.token);
    } catch {
      setMessage("❌ Network Error");
    }
  }

  async function getCF() {
    const res = await fetch(`${API_BASE}/recommend/cf/${username || "guest"}`);
    const data = await res.json();
    setRecs(data.recommendations);
  }

  async function getCBF() {
    const itemId = prompt("Enter Movie ID (like m1, m2)") || "m1";
    const res = await fetch(`${API_BASE}/recommend/cbf/${itemId}`);
    const data = await res.json();
    setRecs(data.recommendations);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎬 Smart Recommender</h1>

        {!token ? (
          <form onSubmit={handleAuth}>
            <input
              style={styles.input}
              placeholder="👤 Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button style={styles.button} type="submit">
              {isRegister ? "📝 Register" : "🚀 Login"}
            </button>
            <p
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              style={styles.toggle}
            >
              {isRegister ? "Already have an account? Login" : "New user? Register"}
            </p>
            <p style={{ color: "#ffeb3b", marginTop: 10 }}>{message}</p>
          </form>
        ) : (
          <div>
            <p style={{ color: "#00ffae", fontWeight: "600" }}>{message}</p>
            <button style={styles.button} onClick={getCF}>
              🎯 Get CF Recommendations
            </button>
            <button
              style={{ ...styles.button, background: "linear-gradient(90deg, #764ba2, #667eea)" }}
              onClick={getCBF}
            >
              💡 Get CBF Recommendations
            </button>

            <h3 style={{ marginTop: 20 }}>🎥 Recommendations</h3>
            <div style={styles.grid}>
              {recs.map((r) => (
                <div key={r.movie_id} style={styles.movieCard}>
                  <img src={r.poster} alt={r.title} style={styles.poster} />
                  <h4 style={{ fontSize: "14px" }}>{r.title}</h4>
                  <p style={{ fontSize: "12px", opacity: 0.8 }}>
                    {r.overview.slice(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "40px",
    borderRadius: "20px",
    backdropFilter: "blur(15px)",
    color: "#fff",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
  },
  title: { marginBottom: "10px" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "12px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "8px",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
  },
  toggle: {
    marginTop: "12px",
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "underline",
  },
  grid: {
    marginTop: "15px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
  },
  movieCard: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    width: "150px",
    padding: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  poster: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "8px",
  },
};
