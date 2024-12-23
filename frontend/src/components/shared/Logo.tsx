import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "15px", marginRight: "auto" }}>
      <Link to={"/"}>
        <img src="/openai.png" alt="openai" width="30px" height="30px" className="image-inverted" />
      </Link>
      <Typography
        sx={{
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "20px" }}>MERN</span>-GPT
      </Typography>
    </div>
  );
};

export default Logo;