import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserProtectWrapper from "./components/UserProtectedWrapper";
import Start from "./pages/Start";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashobard from "./pages/Dashobard";
import Vote from "./pages/Vote";
import PollsList from "./pages/PollsList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PollsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Dashobard />
            </UserProtectWrapper>
          }
        />
        <Route path="/polls/:pollId" element={<Vote />} />
        {/* <-- New Vote Route */}
      </Routes>
    </>
  );
}

export default App;
