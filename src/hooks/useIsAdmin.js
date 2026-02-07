import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EBONDS_SALE_ABI, EBONDS_SALE_ADDRESS } from '../consts/abi'; // Ensure these paths exist

export const useIsAdmin = () => {
    const { account, library } = useWeb3React();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOwner = async () => {
            if (account && library) {
                try {
                    const contract = new ethers.Contract(EBONDS_SALE_ADDRESS, EBONDS_SALE_ABI, library);
                    const owner = await contract.owner(); // Standard Ownable function 
                    setIsAdmin(owner.toLowerCase() === account.toLowerCase());
                } catch (error) {
                    console.error("Error verifying admin status:", error);
                }
            }
            setLoading(false);
        };
        checkOwner();
    }, [account, library]);

    return { isAdmin, loading };
};