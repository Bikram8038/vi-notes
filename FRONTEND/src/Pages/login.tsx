import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const isUserMissing = /user.*(not found|does not exist|doesn't exist|not exist|not registered)/i.test(error);

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Log in to access your notes and save your ideas securely.</p>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

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
          Login
        </button>

        <p style={styles.footerText}>
          New here?{' '}
          <span style={styles.linkText} onClick={() => navigate('/register')}>
            Create an account.
          </span>
        </p>

        {isUserMissing && (
          <p style={styles.registerHint}>
            No account found with this email.
            {' '}
            <span style={styles.linkText} onClick={() => navigate('/register')}>
              Register now.
            </span>
          </p>
        )}
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
    background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '34px',
    width: '100%',
    maxWidth: '420px',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
    background: 'rgba(255,255,255,0.96)',
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
    background: '#4338ca',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(67, 56, 202, 0.16)',
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
  registerHint: {
    margin: 0,
    fontSize: '14px',
    color: '#334155',
    textAlign: 'center',
  },
};