import { configureStore } from '@reduxjs/toolkit'
import userWalletSlice from '../features/userWalletSlice'
import stakingSlice from '../features/stakingSlice'
import projectDetailsSlice from '../features/projectDetailsSlice'

export default configureStore({
    reducer: {
        userWallet: userWalletSlice,
        staking: stakingSlice,
        projectDetails: projectDetailsSlice
    },
})