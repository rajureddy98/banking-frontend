import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Update import
import avatar1 from '../../assets/images/user/avatar-1.jpg'; // Update paths as needed
import avatar2 from '../../assets/images/user/avatar-2.jpg'; // Update paths as needed
import { data } from 'jquery';

// Placeholder for API endpoints
const ACCOUNT_API_ENDPOINT = import.meta.env.VITE_LOGIN_API_ENDPOINT + '/api/savings-accounts';
const TRANSACTIONS_API_ENDPOINT = import.meta.env.VITE_LOGIN_API_ENDPOINT +'/api/transaction-service';

const DashDefault = () => {
  const [accountData, setAccountData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [showForm, setShowForm] = useState(false); // State to show/hide form
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userToken = sessionStorage.getItem('userToken');

      if (!userToken) {
        navigate('/');
        return;
      }

      const userInfo = getUserInfo(userToken);
      if (userInfo) {
        setUsername(userInfo.username);
        setCustomerId(userInfo.customerid);
      }

      try {
        // Fetch account data
        const accountResponse = await fetch(`${ACCOUNT_API_ENDPOINT}/customer/${userInfo.customerid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!accountResponse.ok) {
          throw new Error(`HTTP error! Status: ${accountResponse.status}`);
        }

        const accountData = await accountResponse.json();
        setAccountData(accountData);

        // Fetch transactions data
        const transactionsResponse = await fetch(`${TRANSACTIONS_API_ENDPOINT}/transactions/${accountData.accountNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!transactionsResponse.ok) {
          throw new Error(`HTTP error! Status: ${transactionsResponse.status}`);
        }

        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const hasAccountData = accountData && accountData.accountNumber;

  const getUserInfo = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row>
          {hasAccountData ? (
            <>
              <Col xl={6} xxl={6}>
                <Card>
                  <Card.Body>
                    <h6 className="mb-4">Account Number {accountData.accountNumber}</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`feather f-15 m-r-5`} />Balance RS {accountData.balance}
                        </h3>
                      </div>
                      <div className="col-3 text-end">
                        <Button variant="primary" onClick={handleButtonClick}>
                          {showForm ? 'Cancel' : 'Transfer'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={6} xxl={6}>
              <Card className="Recent-Users widget-focus-lg">
                <Card.Header>
                  <Card.Title as="h5">Recent Transactions</Card.Title>
                </Card.Header>
                <Card.Body className="px-0 py-2">
                  <Table responsive hover className="recent-users">
                    <tbody>
                      {transactions
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order
                        .map(transaction => (
                          <tr className="unread" key={transaction._id}>
                            <td>
                              <img
                                className="rounded-circle"
                                style={{ width: '40px' }}
                                src={transaction.avatar || (transaction.type === 'Credit' ? avatar1 : avatar2)}
                                alt="activity-user"
                              />
                            </td>
                            <td>
                              <h6 className="mb-1 m-l-50">{transaction.amount}</h6>
                              <p className="m-0">{transaction.description}</p>
                            </td>
                            <td>
                              <h6 className="text-muted">
                                <i className={`text-c-${transaction.type === 'Credit' ? 'green' : 'red'} f-10 m-r-15`} />
                                {transaction.type}
                              </h6>
                            </td>
                            <td>
                              <h6 className="text-muted">
                                <i className={`fa fa-circle text-c-${transaction.type === 'Credit' ? 'green' : 'red'} f-10 m-r-15`} />
                                {transaction.date}
                              </h6>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              </Col>
            </>
          ) : (
            <Col xl={6} xxl={6}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="mb-0">No Account Data Available</h6>
                    <Button variant="primary" onClick={handleButtonClick}>
                      {showForm ? 'Cancel' : 'Open account'}
                    </Button>
                  </div>
                  <div className="d-flex align-items-center">
                    <h3 className="f-w-300 d-flex align-items-center mb-0">
                      <i className="feather icon-credit-card f-30 mr-3" /> N/A
                    </h3>
                  </div>
                  {showForm && (
                    <div className="mt-4">
                      <CustomerForm />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Transfer Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Transfer Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TransferForm 
                onClose={handleCloseModal} 
                accountData={accountData} // Pass accountData as a prop
              />
            </Modal.Body>
          </Modal>
        </Row>
      )}
    </React.Fragment>
  );
};

const TransferForm = ({ onClose, accountData }) => {
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [accountValid, setAccountValid] = useState(true); // State to store validation status
  const [validationError, setValidationError] = useState(''); // State to store validation error message
  const [accountHolderName, setAccountHolderName] = useState(''); // State to store account holder name

  useEffect(() => {
    const validateAccount = async () => {
      if (recipientAccount.length >= 6) { // Assuming account numbers are at least 6 digits long
        try {
          const response = await fetch(`${ACCOUNT_API_ENDPOINT}/account/${recipientAccount}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': sessionStorage.getItem('userToken'),
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          if (data) { // Assuming the API returns an 'exists' field
            setAccountValid(true);
            setAccountHolderName(data.accountHolder || ''); // Set the account holder name
            setValidationError('');
          } else {
            setAccountValid(false);
            setAccountHolderName(''); // Clear the account holder name if invalid
            setValidationError('Account number does not exist.');
          }
        } catch (error) {
          console.error('Error validating account:', error);
          setAccountValid(false);
          setAccountHolderName(''); // Clear the account holder name if there's an error
          setValidationError('Error validating account.');
        }
      } else {
        setAccountValid(true); // Assume valid while account number length is less than required
        setAccountHolderName('');
        setValidationError('');
      }
    };

    validateAccount();
  }, [recipientAccount]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!accountValid) {
      alert('Please correct the errors before submitting.');
      return;
    }

    // Prepare the data to be sent to the backend
    const formData = {
      fromAccount: accountData.accountNumber, // Account number from which the amount will be debited
      toAccount: recipientAccount, // Account number to which the amount will be credited
      transactionType: 'transfer', // Assuming this is always 'transfer'
      amount: amount, // Amount entered by the user
    };
    console.log(formData);

    try {
      // Make an API call to the backend
      const response = await fetch(`${TRANSACTIONS_API_ENDPOINT}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('userToken'),
        },
        body: JSON.stringify(formData),
      });

      // Handle response from the backend
      if (response.ok) {
        const result = await response.json();
        alert('Transfer successful');
        onClose(); // Close the modal
      } else {
        console.error('Error submitting form:', response.statusText);
        alert('Error submitting transfer');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting transfer');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formRecipientAccount">
        <Form.Label>Recipient Account Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter recipient's account number"
          value={recipientAccount}
          onChange={(e) => setRecipientAccount(e.target.value)}
          isInvalid={!accountValid} // Mark as invalid if the account is not valid
        />
        <Form.Control.Feedback type="invalid">
          {validationError}
        </Form.Control.Feedback>
      </Form.Group>

      {accountHolderName && (
        <Alert variant="info">
          <strong>Account Holder:</strong> {accountHolderName}
        </Alert>
      )}

      <Form.Group controlId="formAmount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!accountValid}>
        Transfer
      </Button>
    </Form>
  );
};

export default DashDefault;
