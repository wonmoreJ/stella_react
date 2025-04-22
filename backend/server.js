const dotenv = require("dotenv");
dotenv.config();
// ✅ 환경 변수 (임시로 직접 넣음)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = "http://localhost:3000";

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ✅ 미들웨어 세팅
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// ✅ 패스포트 구글 전략 등록
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile); // req.user 에 들어감
    }
  )
);

// ✅ 로그인 시작
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// ✅ 콜백 (로그인 성공 시 토큰 발급 + 쿠키 저장)
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        id: user.id,
        displayName: user.displayName,
        email: user.emails[0].value,
        photo: user.photos[0].value,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false, // 로컬에서는 false
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1시간
    });

    res.redirect(`${FRONTEND_URL}/main`);
  }
);

// ✅ 테스트용 API (로그인 유저 확인)
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    console.log("❌ 토큰 없음 - 응답 종료");
    res.status(401).json({ error: "토큰 없음" });
    return; // 🔥 이거 없으면 밑에 코드 계속 탐
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ 토큰 검증 실패 - 응답 종료");
    res.status(403).json({ error: "토큰 검증 실패" });
    throw err;
  }
};

app.get("/api/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.status(200).json({ message: "로그아웃 완료" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
