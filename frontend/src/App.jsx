import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuestionPage from "./pages/QuestionPage";
import AddQuestion from "./pages/AddQuestion";
import ManageQuestions from "./pages/ManageQuestions";
import EditQuestion from "./pages/EditQuestion";
import Interviews from "./pages/Interviews";
import Notes from "./pages/Notes";
import Progress from "./pages/Progress";
import Revision from "./pages/Revision";
import ForgotPassword from "./pages/ForgotPassword";
import DemoPayment from "./pages/DemoPayment";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

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

        <Route
          path="/interviews"
          element={<Interviews />}
        />

        <Route
          path="/notes"
          element={<Notes />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/revision"
          element={<Revision />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/demo-payment/:token"
          element={<DemoPayment />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;