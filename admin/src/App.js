import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/Dashboard'
import CategoryPage from './pages/CategoryPage'
import UsersPage from './pages/UsersPage'
import CrudPage from './pages/CrudPage'
import Orders from './pages/Orders'
import NewProductForm from './pages/NewProductForm'
// import Navbar from './pages/Navbar'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom'

function App() {
  return (
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/category" element={<CategoryPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/crud" element={<CrudPage />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/newproduct" element={<NewProductForm />} />
        </Routes>
    </Router>
  );
}

export default App;
