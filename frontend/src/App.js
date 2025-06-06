import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useMemo, useState } from "react";
import { UserContext } from "./context/UserContext";
import Login from "./pages/Login";
import Main from "./pages/Main";
import "./App.css";

function App() {
  const [userInfo, setUserInfo] = useState({ displayName: "", photo: "" });

  const userContextValue = useMemo(
    () => ({ userInfo, setUserInfo }),
    [userInfo, setUserInfo]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/main" element={<Main />}></Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
