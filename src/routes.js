import MainScreen from "./scenes/MainScreen/MainScreen"
import AllocationStaking from "./scenes/AllocationStaking/AllocationStaking"
import SalesPage from "./scenes/SalesPage/SalesPage"
import AboutPage from "./scenes/AboutPage/AboutPage"
import TierPage from "./scenes/TierPage/TierPage"
import TermsAndConditions from "./scenes/TermsAndConditions/TermsAndConditions"

export const routes = [
  {
    path: "/",
    exact: true,
    component: <MainScreen />,
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

  {
    path: '/tier-system', // Tier Info Page
    exact: true,
    component: <TierPage />,
  },

  {
    path: '/terms',
    exact: true,
    component: <TermsAndConditions />,
    isProtected: false
  }, 
]