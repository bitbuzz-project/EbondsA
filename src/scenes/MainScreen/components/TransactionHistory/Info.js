import React, { useState, useEffect } from "react";
import web3 from "web3";

const TransactionHistory = ({ account, tokenContractAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchTokenTransfers = async () => {
      try {
        console.log("Fetching token transfers for account:", account);

        if (!account || !tokenContractAddress) {
          console.log("Account or token contract address is missing. Skipping fetch.");
          return;
        }

        const arbiscanApiKey = "9HJDRV54ZDGA8WIKPHV4RJMYVMVIHIMIEF";
        const arbiscanApiUrl = `https://api.arbiscan.io/api?apikey=${arbiscanApiKey}`;
        const apiUrl = `${arbiscanApiUrl}&module=account&action=tokentx&address=${account}&contractaddress=${tokenContractAddress}`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error("Error fetching token transfers. Status:", response.status);
          setIsConnected(false);
          return;
        }

        const transferList = await response.json();
        console.log("API Response:", transferList);

        if (!transferList.result || !transferList.result.length) {
          console.log("No token transfers found for the account:", account);
          setIsConnected(true);
          return;
        }

        const contractTransfers = transferList.result.filter(
          (transfer) => transfer.contractAddress.toLowerCase() === tokenContractAddress.toLowerCase()
        );

        const formattedTransfers = contractTransfers.map((transfer, index) => ({
          id: index,
          hash: transfer.hash,
          value: web3.utils.fromWei(transfer.value, "ether"),
          timestamp: new Date(transfer.timeStamp * 1000).toISOString(),
          action: transfer.from.toLowerCase() === account.toLowerCase() ? "Sent" : "Received",
        }));

        formattedTransfers.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        console.log("Formatted Token Transfers:", formattedTransfers);
        setTransactions(formattedTransfers);
        setIsConnected(true);
      } catch (error) {
        console.error("Error fetching token transfers:", error);
        setIsConnected(false);
      }
    };

    fetchTokenTransfers();
  }, [account, tokenContractAddress, tokenDecimals]);

  return (
    <div>
      {isConnected ? (
        <table style={{ borderCollapse: 'collapse', width: '100%', paddingBottom: '30px' }}>
          <thead>
            <tr>
              <th></th>
              <th>Amount</th>
              <th>Action</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transfer) => (
              transfer.value > 0 && (
                <tr key={transfer.id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ border: 'none', padding: '10px', textAlign: 'center' }}>
                    {transfer.action === "Sent" ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#f7514094"
                        transform="matrix(1, 0, 0, 1, 0, 0)"
                      >
                          {<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42ZM24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#333333"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13 24C13 23.4477 13.4477 23 14 23L34 23C34.5523 23 35 23.4477 35 24C35 24.5523 34.5523 25 34 25L14 25C13.4477 25 13 24.5523 13 24Z" fill="#333333"></path> </g></svg>}
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#4caf5096"
                        transform="matrix(1, 0, 0, 1, 0, 0)"
                      >
                          {<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 11.51L12 14.51L15 11.51" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14.51V6.51001" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>}
                      </svg>
                    )}
                  </td>
                  <td style={{ border: 'none', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.0em', lineHeight: '1.4em' }}>
                    {parseFloat(transfer.value).toFixed(3)} EBONDS
                  </td>
                  <td style={{ border: 'none', padding: '8px', textAlign: 'center', color: transfer.action === "Sent" ? '#7e7e7e' : '#7e7e7e' }}>
                    {transfer.action === "Sent" ? "Sent" : "Deposit"}
                  </td>
                  <td style={{ border: 'none', padding: '8px', textAlign: 'center' }}>
                    {new Date(transfer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />
                    {new Date(transfer.timestamp).toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' })}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      ) : (
        <p>No connection. Please check your internet connection and try again.</p>
      )}
    </div>
  );
  
};

export default TransactionHistory;
