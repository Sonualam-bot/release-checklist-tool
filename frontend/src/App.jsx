import { Route, Routes } from "react-router-dom";
import ReleaseListPage from "./pages/ReleaseListPage";
import ReleaseFormPage from "./pages/ReleaseFormPage";

/** Top-level route table: list view, create form, edit form. */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ReleaseListPage />} />
      <Route path="/releases/new" element={<ReleaseFormPage />} />
      <Route path="/releases/:id" element={<ReleaseFormPage />} />
    </Routes>
  );
}
