import MainScreen from "./scenes/MainScreen/MainScreen"
import IdoDetail from "./scenes/IdoDetail/IdoDetail"
import AllocationStaking from "./scenes/AllocationStaking/AllocationStaking"
import AdminPanel from "./scenes/AdminPanel/AdminPanel"
import SalesPage from "./scenes/SalesPage/SalesPage"
import Login from "./scenes/Login/Login"
import AboutPage from "./scenes/AboutPage/AboutPage"
import TierPage from "./scenes/TierPage/TierPage"
import TermsAndConditions from "./scenes/TermsAndConditions/TermsAndConditions"

export const routes = [
  {
    path: "/",
    exact: true,
    component: <MainScreen />,
    // isProtected: true
  },
  
  // {
  //   path: "/project-details",
  //   exact: true,
  //   component: <IdoDetail />,
  //   isProtected: true
  // },
  
  {
    path: "/allocation-staking",
    exact: true,
    component: <AllocationStaking />,
    // isProtected: true
  },

  // {
  //   path: '/sales',
  //   exact: true,
  //   component: <SalesPage />,
  //   isProtected: true
  // },

  // {
  //   path: "/admin-panel",
  //   exact: true,
  //   component: <AdminPanel />,
  //   isProtected: true
  // },

  {
    path: "/swap",
    exact: true,
    component: <AboutPage />,
    isProtected: true
  },

  // {
  //   path: '/tier-system',
  //   exact: true,
  //   component: <TierPage />,
  //   isProtected: true
  // },

  // {
  //   path: '/login',
  //   exact: true,
  //   component: <Login />,
  //   isProtected: false
  // }, 

  {
    path: '/terms',
    exact: true,
    component: <TermsAndConditions />,
    isProtected: false
  }, 
]