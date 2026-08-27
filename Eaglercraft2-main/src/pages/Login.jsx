import "./style/login.css";

export default function Login({ onGoogle, onGithub, authError }) {
  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-brand">EAGLERCRAFT2</div>
        <button className="login-get-started" type="button">Get Started</button>
      </header>

      <main className="login-main">
        <section className="login-card">
          <p className="login-pill">Web Gaming Platform</p>
          <h1>Sign in to Eaglercraft2</h1>
          <p className="login-sub">Continue to Store, Forums, ELGE, GameHopper, Moddit, and GameClipper.</p>
          {authError && <p className="login-error">{authError}</p>}

          <div className="login-actions">
            <button className="login-provider google" onClick={onGoogle} type="button">
              Sign in with Google
            </button>
            <button className="login-provider github" onClick={onGithub} type="button">
              Sign in with GitHub
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
