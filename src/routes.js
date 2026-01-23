import MainScreen from "./scenes/MainScreen/MainScreen"
import AllocationStaking from "./scenes/AllocationStaking/AllocationStaking"
import SalesPage from "./scenes/SalesPage/SalesPage"
import AboutPage from "./scenes/AboutPage/AboutPage"
import TermsAndConditions from "./scenes/TermsAndConditions/TermsAndConditions"
import LandingPage from "./scenes/LandingPage/LandingPage"

export const routes = [
  {
    path: "/dashboard",
    exact: true,
    component: <MainScreen />,
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