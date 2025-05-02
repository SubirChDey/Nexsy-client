import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home/Home";
import Registration from "../pages/Registration/Registration";
import Login from "../pages/Login/Login";
import Dashboard from "../layouts/Dashboard";
import UserProfile from "../pages/Dashboard/UserDashboard/UserProfile";
import AddProduct from "../pages/Dashboard/UserDashboard/AddProduct";
import MyProducts from "../pages/Dashboard/UserDashboard/MyProducts";
import Products from "../pages/Products/Products";


const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayouts></MainLayouts>,
      errorElement: <ErrorPage></ErrorPage>,
      children: [
        {
            path: '/',
            element: <Home></Home>
        },
        {
            path: '/products',
            element: <Products></Products>
        },
        {
            path: '/login',
            element: <Login></Login>
        },
        {
            path: '/registration',
            element: <Registration></Registration>
        },
      ]
    },
    {
      path: 'dashboard',
      element: <Dashboard></Dashboard>,
      children: [
        {
          path: '/dashboard/user',
          element: <UserProfile></UserProfile>,
        },
        {
          path: '/dashboard/userProfile',
          element: <UserProfile></UserProfile>,
        },
        {
          path: '/dashboard/addProduct',
          element: <AddProduct></AddProduct>,
        },
        {
          path: '/dashboard/myProducts',
          element: <MyProducts></MyProducts>,
        }
      ]
    }
  ]);


  export default router;