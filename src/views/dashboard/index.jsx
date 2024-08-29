import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Update import
import avatar1 from '../../assets/images/user/avatar-1.jpg'; // Update paths as needed
import avatar2 from '../../assets/images/user/avatar-2.jpg'; // Update paths as needed

// Placeholder for API endpoints
const ACCOUNT_API_ENDPOINT = 'http://localhost:3000/api/savings-accounts/customer';
const TRANSACTIONS_API_ENDPOINT = 'http://localhost:3000/api/transaction-service/';

const DashDefault = () => {
  const [accountData, setAccountData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [customerId, setCustomerId] = useState(''); // State for username
  const [showForm, setShowForm] = useState(false); // State to show/hide form
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
        const accountResponse = await fetch(`${ACCOUNT_API_ENDPOINT}/${userInfo.customerid}`, {
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
            'Authorization': `Bearer ${userToken}`  // Add this header if needed
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
    setShowForm(!showForm);
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
                          <i className={`feather  f-30 m-r-5`} />Balance RS {accountData.balance}
                        </h3>
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
                    {transactions.map(transaction => (
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
        </Row>
      )}
    </React.Fragment>
  );
};

const CustomerForm = () => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Prepare the data to be sent to the backend
    const formData = {
      phone,
      address,
    };

    try {
      // Make an API call to the backend
      const response = await fetch(`${ACCOUNT_API_ENDPOINT}/create`, { // Replace with your backend API endpoint
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
        window.location.reload();
      } else {
        console.error('Error submitting form:', response.statusText);
        // Optionally, show an error message here
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Optionally, show an error message here
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formPhone">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Update phone state
        />
      </Form.Group>

      <Form.Group controlId="formAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)} // Update address state
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default DashDefault;
