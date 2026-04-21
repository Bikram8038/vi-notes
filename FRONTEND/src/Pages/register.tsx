import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Join now to save notes and keep them synced across devices.</p>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Register
        </button>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <span style={styles.linkText} onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '24px',
    background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '420px',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  input: {
    padding: '14px 16px',
    fontSize: '15px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '14px',
    background: '#10b981',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(16, 185, 129, 0.16)',
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
  },
  linkText: {
    color: '#4338ca',
    fontWeight: 700,
    cursor: 'pointer',
  },
  errorText: {
    margin: 0,
    padding: '12px 14px',
    borderRadius: '14px',
    background: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fca5a5',
  },
};