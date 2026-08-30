import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReleaseListPage from "./pages/ReleaseListPage";
import ReleaseFormPage from "./pages/ReleaseFormPage";

/** Top-level route table: list view, create form, edit form. */
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReleaseListPage />} />
        <Route path="/releases/new" element={<ReleaseFormPage />} />
        <Route path="/releases/:id" element={<ReleaseFormPage />} />
      </Routes>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar closeOnClick />
    </>
  );
}
