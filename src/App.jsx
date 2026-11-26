import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import AddExpense from "./pages/AddExpense";
import History from "./pages/History";
import Settlements from "./pages/Settlements";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>

            <Route
              element={
                <ExpenseProvider>
                  <Layout />
                </ExpenseProvider>
              }
            >

              <Route path="/" element={<Dashboard />} />

              <Route path="/groups" element={<Groups />} />

              <Route
                path="/add-expense"
                element={<AddExpense />}
              />

              <Route path="/history" element={<History />} />

              <Route
                path="/settlements"
                element={<Settlements />}
              />

            </Route>

          </Route>

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}