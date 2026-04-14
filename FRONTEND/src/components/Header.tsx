import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [userName, setUserName] = useState<string>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).username : "";
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName("");

    // redirect to home page
    navigate("/");
  };

  return (
    <header>
      <h2>My Notes</h2>

      <nav >
        {userName ? (
          <>
            <span >Hi, {userName}</span>
            <button onClick={handleLogout} >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* <Link to="/"> */}
              Login
            {/* </Link> */}
            {/* <Link to="/" > */}
              Register
            {/* </Link> */}
          </>
        )}
      </nav>
    </header>
  );
}