import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuestionPage from "./pages/QuestionPage";
import AddQuestion from "./pages/AddQuestion";
import ManageQuestions from "./pages/ManageQuestions";
import EditQuestion from "./pages/EditQuestion";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/question/:id"
          element={<QuestionPage />}
        />

        <Route
          path="/admin/questions/add"
          element={<AddQuestion />}
        />

        <Route
          path="/admin/questions"
          element={<ManageQuestions />}
        />

        <Route
          path="/admin/questions/:id/edit"
          element={<EditQuestion />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;