import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home/Home";
import Registration from "../pages/Registration/Registration";
import Login from "../pages/Login/Login";
import Dashboard from "../layouts/Dashboard";
import AddProduct from "../pages/Dashboard/UserDashboard/AddProduct";
import MyProducts from "../pages/Dashboard/UserDashboard/MyProducts";
import Products from "../pages/Products/Products";
import ManageUsers from "../pages/Dashboard/AdminDashboard/ManageUsers";
import Statistics from "../pages/Dashboard/AdminDashboard/Statistics";
import ManageCoupons from "../pages/Dashboard/AdminDashboard/ManageCoupons";
import ProductReviewQueue from "../pages/Dashboard/ModeratorDashboard/ProductReviewQueue";
import ReportedContents from "../pages/Dashboard/ModeratorDashboard/ReportedContents";
import MyProfile from "../pages/Dashboard/UserDashboard/MyProfile";


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

        // Admin Routes
        {
          path: '/dashboard/manageUsers',
          element: <ManageUsers></ManageUsers>
        },
        {
          path: '/dashboard/statistics',
          element: <Statistics></Statistics>
        },
        {
          path: '/dashboard/manageCoupons',
          element: <ManageCoupons></ManageCoupons>
        },

        // Moderator Routes       
        {
          path: '/dashboard/productQueue',
          element: <ProductReviewQueue></ProductReviewQueue>,
        },
        {
          path: '/dashboard/reported',
          element: <ReportedContents></ReportedContents>,
        },



        // User Routes
        {
          path: '/dashboard/userProfile',
          element: <MyProfile></MyProfile>,
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