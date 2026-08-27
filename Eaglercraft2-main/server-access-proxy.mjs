import express from "express";
import axios from "axios";

const app = express();
const port = Number(process.env.PORT || 3000);
const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN || "https://ckgamingstudios.cloudflareaccess.com";

app.get("/api/get-user-uid", async (req, res) => {
  const jwt = req.headers["cf-access-jwt-assertion"];

  if (!jwt) {
    return res.status(401).json({ error: "Not logged in through Cloudflare Access" });
  }

  try {
    const response = await axios.get(`${teamDomain}/cdn-cgi/access/get-identity`, {
      headers: {
        Cookie: `CF_Authorization=${jwt}`,
        Accept: "application/json"
      },
      timeout: 10000
    });

    const identity = response.data;
    const userUid = identity.user_uuid || identity.sub || "";

    return res.json({
      uid: userUid,
      email: identity.email || "",
      identity
    });
  } catch (error) {
    const message = error?.response?.data?.reason || error?.response?.data?.message || error.message;
    console.error("Cloudflare Fetch Error:", message);
    return res.status(500).json({ error: "Failed to fetch identity from Cloudflare", details: message });
  }
});

app.listen(port, () => {
  console.log(`Cloudflare Access proxy running on port ${port}`);
});
