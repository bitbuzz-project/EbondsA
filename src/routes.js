import MainScreen from "./scenes/MainScreen/MainScreen"
import AllocationStaking from "./scenes/AllocationStaking/AllocationStaking"
import SalesPage from "./scenes/SalesPage/SalesPage"
import AboutPage from "./scenes/AboutPage/AboutPage"
import TermsAndConditions from "./scenes/TermsAndConditions/TermsAndConditions"
import LandingPage from "./scenes/LandingPage/LandingPage"
import AdminDashboard from "./scenes/Admin/AdminDashboard";
import AdminControlPanel from "./scenes/Admin/AdminControlPanel";

export const routes = [
  {
    path: "/dashboard",
    exact: true,
    component: <MainScreen />,
  },
  {
    path: "/admin",
    exact: true,
    component: <AdminDashboard />,
    isProtected: false // Publicly accessible metrics
  },
  {
    path: "/admin/control",
    exact: true,
    component: <AdminControlPanel />,
    isProtected: true // Uses your existing PrivateRoute logic [cite: 2]
  },
  
   {
    path: "/",
    exact: true,
    component: <LandingPage />,
  },

  {
    path: "/allocation-staking",
    exact: true,
    component: <AllocationStaking />,
  },

  {
    path: '/sales', // Community Sale Page
    exact: true,
    component: <SalesPage />,
  },

  {
    path: "/swap",
    exact: true,
    component: <AboutPage />,
    isProtected: true
  },

  // {
  //   path: '/tier-system', // Tier Info Page
  //   exact: true,
  //   component: <TierPage />,
  // },

  {
    path: '/terms',
    exact: true,
    component: <TermsAndConditions />,
    isProtected: false
  }, 
]