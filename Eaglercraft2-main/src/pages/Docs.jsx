import "./style/user-profile.css";

export default function Docs() {
  return (
    <section className="user-profile-page">
      <div className="user-profile-shell">
        <h1>Eaglercraft2 Docs</h1>
        <p>Quick documentation links for players and creators.</p>
        <div className="list-card">
          <ul>
            <li>How to create and publish posts in forums.</li>
            <li>How profile settings work (avatar, bio, country, username).</li>
            <li>How developers can upload mods on Moddit (title, description, game, image, required download link).</li>
            <li>How to report bugs and share gameplay feedback.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
