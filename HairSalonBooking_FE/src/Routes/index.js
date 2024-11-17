import SigninLayout from "../Layouts/SigninLayout";
import HomePage from "../Pages/HomePage";
import PrivateRoute from "../Components/PrivateRoute/index";
import AuthenticatedRoute from "../Components/AuthenticatedRoute";
import Login from "../Components/client/Login/Login";
import Register from "../Components/client/Register/Register";
import ForgetPassword from "../Components/client/ForgetPassword/ForgetPassword";
import ConfirmPassword from "../Components/client/ConfirmPassword/ConfirmPassword";
import UserInfor from "../Components/client/UserInfor/UserInfor";
import ManagerLayout from "../Layouts/manager/ManagerLayout";
import UserLayout from "../Layouts/UserLayout";
import ManagerDashboard from "../Components/Manager/ManagerDashboard/ManagerDashboard";

import HomePageLayout from "../Layouts/client/HomePageLayout";
import AboutUsPage from "../Components/client/AboutUsPage/AboutUsPage";

import BookingLayout from "../Layouts/client/BookingLayout";
import Booking from "../Components/client/Booking/Booking";
import ChooseSalon from "../Components/client/Booking/ChooseSalon/ChooseSalon";
import ChooseService from "../Components/client/Booking/ChooseService/ChooseService";
import ChooseDateTime from "../Components/client/Booking/ChooseDateTime/ChooseDateTime";
import Contact from "../Components/client/Contact/Contact";
import ManagerCreateStylist from "../Components/Manager/ManagerCreateStylist/ManagerCreateStylist";
import ChooseStylist from "../Components/client/Booking/ChooseStylist/ChooseStylist";
import ManagerStylist from "../Components/Manager/ManagerStylist/ManagerStylist";
import ManagerCustomer from "../Components/Manager/ManagerCustomer/ManagerCustomer";
import ManagerCreateStaff from "../Components/Manager/ManagerCreateStaff/ManagerCreateStaff";

import Services from "../Components/client/Services/Services";
import MyBooking from "../Components/client/MyBooking/MyBooking";
import AdminLayout from "../Layouts/admin/AdminLayout";
import AdminService from "../Components/Admin/AdminService/AdminService";
import AdminCreateService from "../Components/Admin/AdminCreateService/AdminCreateService";
import AdminVoucher from "../Components/Admin/AdminVoucher/AdminVoucher";
import AdminCreateVoucher from "../Components/Admin/AdminCreateVoucher/AdminCreateVoucher";
import ManagerStaff from "../Components/Manager/ManagerStaff/ManagerStaff";
import AdminManager from "../Components/Admin/AdminManager/AdminManager";
import AdminCustomer from "../Components/Admin/AdminCustomer/AdminCustomer";
import AdminCreateManager from "../Components/Admin/AdminCreateManager/AdminCreateManager";
import ManagerShift from "../Components/Manager/ManagerShift/ManagerShift";
import StylistLayout from "../Layouts/stylist";
import StylistSchedule from "../Components/Stylist/StylistSchedule/StylistSchedule";
import StylistFeedback from "../Components/Stylist/StylistFeedback/StylistFeedback";
import StylistDashboard from "../Components/Stylist/StylistDashboard/StylistDashboard";
import StylistShift from "../Components/Stylist/StylistShift/StylistShift";
import StylistSalary from "../Components/Stylist/StylistSalary/StylistSalary";
import StaffLayout from "../Layouts/staff/StaffLayout";
import StaffPayment from "../Components/Staff/StaffPayment/StaffPayment";
import StaffCreateBooking from "../Components/Staff/StaffCreateBooking/StaffCreateBooking";
import StaffPaymentConfirm from "../Components/Staff/StaffPaymentConfirm/StaffPaymentConfirm";
import StaffVNPayQR from "../Components/Staff/StaffVNPayQR/StaffVNPayQR";
import ManagerUpdateShift from "../Components/Manager/ManagerShiftUpdate/ManagerUpdateShift";
import ServicesDetails from "../Components/client/ServiceDetails/ServiceDetails";

import AdminBranch from "../Components/Admin/AdminBranch/AdminBranch";
import AdminCreateBranch from "../Components/Admin/AdminCreateBranch/AdminCreateBranch";
import AdminSlot from "../Components/Admin/AdminSlot/AdminSlot";
import ManagerSalary from "../Components/Manager/ManagerSalary/ManagerSalary";
import ManagerCalculateSalary from "../Components/Manager/ManagerCalculateSalary/ManagerCalculateSalary";
import StaffBookingPending from "../Components/Staff/StaffBookingPending/StaffBookingPending";
import StaffBookingInProcess from "../Components/Staff/StaffBookingInProcess/StaffBookingInProcess";
import StaffBookingComplete from "../Components/Staff/StaffBookingComplete/StaffBookingComplete";
import ManagerBookingCancel from "../Components/Manager/ManagerBookingCancel/ManagerBookingCancel";
import ManagerBookingComplete from "../Components/Manager/ManagerBookingComplete/ManagerBookingComplete";
import ManagerBookingInProcess from "../Components/Manager/ManagerBookingInProcess/ManagerBookingInProcess";
import ManagerBookingPending from "../Components/Manager/ManagerBookingPending/ManagerBookingPending";
import StaffCreateCustomer from "../Components/Staff/StaffCreateCustomer/StaffCreateCustomer";
import AdminDashboard from "../Components/Admin/AdminDashboard/AdminDashboard";
import AdminKpi from "../Components/Admin/AdminKpi/AdminKpi";
import StaffCustomer from "../Components/Staff/StaffCustomer/StaffCustomer";
export const Routes = [
  {
    path: "/",
    element: <HomePageLayout/>,
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path: "/aboutus",
        element: <AboutUsPage/>,
      },
      {
        path: "/services",
        element: <Services/>,
      },
      {
        path: "/contact",
        element: <Contact/>,
      },
      {
        path: "/details",
        element: <ServicesDetails />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthenticatedRoute>
        <SigninLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgetPassword",
        element: <ForgetPassword />,
      },
      {
        path: "confirmPassword",
        element: <ConfirmPassword />,
      },
    ],
  },
  {
    path: "user",
    element: (
      <PrivateRoute requiredRole="CUSTOMER">
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: <UserInfor />,
      },
      {
        path: "mybooking",
        element: <MyBooking />,
      },
    ],
  },
  {
    path: "manager",
    element: (
      <PrivateRoute requiredRole="BRANCH_MANAGER">
        <ManagerLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "stylist",
        element: <ManagerStylist buttonLabel={"New stylist"} />,
      },
      {
        path: "stylist/create",
        element: <ManagerCreateStylist />,
      },
      {
        path: "staff",
        element: <ManagerStaff buttonLabel={"New staff"} />,
      },
      {
        path: "staff/create",
        element: <ManagerCreateStaff />,
      },
      {
        path: "dashboard",
        element: <ManagerDashboard />,
      },
      {
        path: "booking/pending",
        element: <ManagerBookingPending buttonLabel={"New booking"} />,
      },
      {
        path: "booking/in-process",
        element: <ManagerBookingInProcess buttonLabel={"New booking"} />,
      },
      {
        path: "booking/complete",
        element: <ManagerBookingComplete />,
      },
      {
        path: "booking/cancel",
        element: <ManagerBookingCancel />,
      },
      {
        path: "customer",
        element: <ManagerCustomer />,
      },
      {
        path: "staff/create",
        element: <ManagerCreateStaff />,
      },
      {
        path: "shift",
        element: <ManagerShift />,
      },
      {
        path: "shift/update",
        element: <ManagerUpdateShift />,
      },
      {
        path: "salary",
        element: <ManagerSalary />,
      },
      {
        path: "salary/calculate",
        element: <ManagerCalculateSalary />,
      },
    ],
  },
  {
    path: "booking",
    element: (
      <PrivateRoute requiredRole="CUSTOMER">
        <BookingLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Booking />,
      },
      {
        path: "step1",
        element: <ChooseSalon />,
      },
      {
        path: "step2",
        element: <ChooseService />,
      },
      {
        path: "step3",
        element: <ChooseStylist />,
      },
      {
        path: "step4",
        element: <ChooseDateTime />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      <PrivateRoute requiredRole="ADMIN">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "service",
        element: <AdminService />,
      },
      {
        path: "service/create",
        element: <AdminCreateService />,
      },
      {
        path: "voucher",
        element: <AdminVoucher buttonLabel={"New Voucher"} />,
      },
      {
        path: "voucher/create",
        element: <AdminCreateVoucher />,
      },
      {
        path: "manager",
        element: <AdminManager buttonLabel={"New Manager"} />,
      },
      {
        path: "manager/create",
        element: <AdminCreateManager />,
      },
      {
        path: "customer",
        element: <AdminCustomer buttonLabel={"New Customer"} />,
      },
      {
        path: "branch",
        element: <AdminBranch buttonLabel={"New Branch"} />,
      },
      {
        path: "branch/create",
        element: <AdminCreateBranch />,
      },
      {
        path: "slot",
        element: <AdminSlot />,
      },
      {
        path: "kpi",
        element: <AdminKpi />,
      },
    ],
  },
  {
    path: "stylist",
    element: (
      <PrivateRoute requiredRole="STYLIST">
        <StylistLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "schedule",
        element: <StylistSchedule />,
      },
      {
        path: "feedback",
        element: <StylistFeedback />,
      },
      {
        path: "dashboard",
        element: <StylistDashboard />,
      },
      {
        path: "salary",
        element: <StylistSalary />,
      },
      {
        path: "shift",
        element: <StylistShift />,
      },
    ],
  },
  {
    path: "staff",
    element: (
      <PrivateRoute requiredRole="STAFF">
        <StaffLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "payment/:bookingId",
        element: <StaffPayment />,
      },
      {
        path: "booking/pending",
        element: <StaffBookingPending buttonLabel={"New Booking"} />,
      },
      {
        path: "booking/in-process",
        element: <StaffBookingInProcess buttonLabel={"New Booking"} />,
      },
      {
        path: "booking/complete",
        element: <StaffBookingComplete buttonLabel={"New Booking"} />,
      },
      {
        path: "booking/create",
        element: <StaffCreateBooking />,
      },
      {
        path: "customer",
        element: <StaffCustomer/>,
      },
      {
        path: "customer/create",
        element: <StaffCreateCustomer />,
      },
    ],
  },
  {
    path: "payment/confirm",
    element: <StaffPaymentConfirm />,
  },
  {
    path: "payment/VNPay",
    element: <StaffVNPayQR />,
  },
];
