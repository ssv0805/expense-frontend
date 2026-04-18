import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router"
import Layout from "./components/Layout"
import Signup from "./pages/signup/signup"
import Login from "./pages/login/login"
import Dashboard from "./pages/Dashboard/dashboard"
import Expense from "./pages/Expense/expense"
import Income from "./pages/income/income"
import Transaction from "./pages/Transactions/transaction"
import Appp from "./pages/file/file"
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import axios from "axios";



function App() {

  const API_URL="https://expense-backend-porh.onrender.com"
  
  return (

    <Routes>
      <Route path="/"
        element={<PublicRoute>
          <Login />
        </PublicRoute>
        } />
      <Route path="/signup"
        element={<PublicRoute>
          <Signup />
        </PublicRoute>} />
      <Route path="/login"
        element={<PublicRoute>
          <Login />
        </PublicRoute>
        } />
      <Route element={<Layout />}>
        <Route path="/dashboard"
          element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        <Route path="/expense"
          element={<ProtectedRoute>
            <Expense />
          </ProtectedRoute>} />
        <Route path="/income"
          element={<ProtectedRoute>
            <Income />
          </ProtectedRoute>} />
          <Route path="/transaction"
          element={<ProtectedRoute>
            <Transaction />
          </ProtectedRoute>} />
          <Route path="/file"
          element={<ProtectedRoute>
            <Appp />
          </ProtectedRoute>} />
      </Route>

    </Routes>

  );
}

export default App;