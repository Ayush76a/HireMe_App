import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import '../styling/Transaction.css'; // Ensure you have appropriate CSS for styling

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {

        // Retrieve the token from cookies
        const tokenRow = document.cookie.split('; ').find(row => row.startsWith('token='));
        const token = tokenRow ? tokenRow.split('=')[1] : null; // Get the token value or null

        const response = await axios.get('http://localhost:8080/transactions/user', {
          withCredentials: true,  // Ensure cookies are sent with the request
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
          },
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
        setLoading(false);
      }
    };

    fetchUserTransactions();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  // Function to print a single transaction as a PDF
  const handlePrintPDF = (transaction) => {
    const doc = new jsPDF();

    // Add transaction details to the PDF
    doc.text(`Transaction Details`, 10, 10);
    doc.text(`Helper email: ${transaction.helper_email}`, 10, 20);
    doc.text(`Transaction Ref ID: ${transaction.transaction_ref_id}`, 10, 30);
    doc.text(`Order ID: ${transaction.order_id}`, 10, 40);
    doc.text(`Amount: ₹${transaction.amount}`, 10, 50);
    doc.text(`Status: ${transaction.status}`, 10, 60);
    doc.text(`Date and Time: ${new Date(transaction.date).toLocaleString()}`, 10, 70);

    // Save the PDF
    doc.save(`transaction_${transaction.transaction_ref_id}.pdf`);
  };

  // Loading state
  if (loading) {
    return <p>Loading transactions...</p>;
  }

  // Error state
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="transactions-container">
      <h1>Your Transactions</h1>
      {transactions.length > 0 ? (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="transaction-item">
              <div className="transaction-details">
                <p><strong>Helper email:</strong> {transaction.helper_email}</p>
                <p><strong>Transaction Ref ID:</strong> {transaction.transaction_ref_id}</p>
                <p><strong>Order ID:</strong> {transaction.order_id}</p>
                <p><strong>Amount:</strong> ₹{transaction.amount}</p>
                <p><strong>Status:</strong> 
                  <span className={transaction.status === 'completed' ? 'status-completed' : 'status-pending'}>
                    {transaction.status}
                  </span>
                </p>
                <p><strong>Date and Time:</strong> {new Date(transaction.date).toLocaleString()}</p>
              </div>
              <button onClick={() => handlePrintPDF(transaction)}>Print PDF</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default Transactions;
