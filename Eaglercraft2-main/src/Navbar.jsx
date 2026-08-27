import { Link } from "react-router-dom";
import "./pages/style/home.css";

export default function Navbar({ onSignOut }) {
  return (
    <header className="topbar">
      <div className="brand">EAGLERCRAFT2</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/store">Store</Link>
        <Link to="/forums">Forums</Link>
        <Link to="/users">Users</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/docs">Docs</Link>
        <Link to="/moddit">Moddit</Link>
        <a href="#">Clips</a>
        <Link to="/editor">Editor</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Link to="/play" className="cta">Launch</Link>
      <Link to="/editor" className="cta ghost">Open Editor</Link>
      <button className="cta ghost" type="button" onClick={onSignOut}>
        Sign Out
      </button>
    </header>
  );
}
