import { lazy } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import useAuth from "./hooks/useAuth.jsx";

import Layout from "./sections/Layout";

//preloaded-pages
import Login from "./pages/Login.jsx";

//lazyloaded-pages
const Forms = lazy(() => import("./pages/Forms"));
const AddNewForm = lazy(() => import("./pages/AddNewForm"));
const Preview = lazy(() => import("./pages/Preview.jsx"));
const EditForm = lazy(() => import("./pages/EditForm.jsx"));
const Form = lazy(() => import("./pages/Form.jsx"));
const Responses = lazy(() => import("./pages/Responses"));
const Response = lazy(() => import("./pages/Response.jsx"));

const Router = () => {
  const { auth } = useAuth();

  const PrivateRoute = ({ ...rest }) =>
    auth?.email ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: rest.location }} replace />
    );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Forms />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/forms/add-new-form" element={<AddNewForm />} />
          <Route path="/forms/edit-form/:formId" element={<EditForm />} />
          <Route path="/forms/preview/:formId" element={<Preview />} />
          <Route path="/forms/responses/:formId" element={<Responses />} />
          <Route
            path="/forms/responses/:formId/:responseId"
            element={<Response />}
          />
        </Route>
      </Route>
      <Route path="/form/:formId" element={<Form />} />
    </Routes>
  );
};

export default Router;
