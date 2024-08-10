import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Update import
import avatar1 from '../../assets/images/user/avatar-1.jpg'; // Update paths as needed
import avatar2 from '../../assets/images/user/avatar-2.jpg'; // Update paths as needed

// Placeholder for API endpoints
const ACCOUNT_API_ENDPOINT = 'https://api.example.com/account-details';
const TRANSACTIONS_API_ENDPOINT = 'https://api.example.com/recent-transactions';

const DashDefault = () => {
  const [accountData, setAccountData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(''); // State for username
  const [showForm, setShowForm] = useState(false); // State to show/hide form
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userToken = sessionStorage.getItem('userToken'); // Adjust as necessary

      if (!userToken) {
        navigate('/');
        return;
      }

      // Decode token and get user information
      const userInfo = getUserInfo(userToken);
      if (userInfo) {
        setUsername(userInfo.username);
      }

      try {
        const accountResponse = await fetch(`${ACCOUNT_API_ENDPOINT}?token=${userToken}`);
        const accountData = await accountResponse.json();
        setAccountData(accountData);

        const transactionsResponse = await fetch(`${TRANSACTIONS_API_ENDPOINT}?token=${userToken}`);
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

  const hasAccountData = accountData.length > 0 && accountData[0].title;

  return (
    <React.Fragment>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row>
          {hasAccountData ? (
            <>
              {accountData.map((data, index) => (
                <Col key={index} xl={6} xxl={6}>
                  <Card>
                    <Card.Body>
                      <h6 className="mb-4">{data.title}</h6>
                      <div className="row d-flex align-items-center">
                        <div className="col-9">
                          <h3 className="f-w-300 d-flex align-items-center m-b-0">
                            <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                          </h3>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              <Col md={4} xl={8}>
                <Card className="Recent-Users widget-focus-lg">
                  <Card.Header>
                    <Card.Title as="h5">Recent Transactions</Card.Title>
                  </Card.Header>
                  <Card.Body className="px-0 py-2">
                    <Table responsive hover className="recent-users">
                      <tbody>
                        {transactions.map(transaction => (
                          <tr className="unread" key={transaction.id}>
                            <td>
                              <img
                                className="rounded-circle"
                                style={{ width: '40px' }}
                                src={transaction.avatar || (transaction.type === 'Credit' ? avatar1 : avatar2)}
                                alt="activity-user"
                              />
                            </td>
                            <td>
                              <h6 className="mb-1">{transaction.name}</h6>
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
                            <td>
                              <Link to="#" className="label theme-bg2 text-white f-12">
                                Reject
                              </Link>
                              <Link to="#" className="label theme-bg text-white f-12">
                                Approve
                              </Link>
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
  return (
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your name" />
      </Form.Group>

      <Form.Group controlId="formDob">
        <Form.Label>Date of birth</Form.Label>
        <Form.Control type="date" />
      </Form.Group>

      <Form.Group controlId="formPhone">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="text" placeholder="Enter your phone number" />
      </Form.Group>

      <Form.Group controlId="formAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Enter your address" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default DashDefault;
