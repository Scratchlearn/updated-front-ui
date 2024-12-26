// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import { Link } from 'react-router-dom';
// // import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
// // import { FiClock, FiCheckCircle, FiFlag } from 'react-icons/fi';
// // import { FaSpinner } from 'react-icons/fa';
// // import LazyLoad from 'react-lazyload';
// // import './DeliveryList.css';

// // const DeliveryList = () => {
// //   const [deliveries, setDeliveries] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [page, setPage] = useState(0); // Current page for pagination
// //   const [loading, setLoading] = useState(false); // Loading indicator
// //   const observer = useRef(null);
// //   const limit = 10; // Number of deliveries to fetch per page

// //   const fetchData = useCallback(async (currentPage) => {
// //     try {
// //       setLoading(true); // Show loading indicator
// //       const offset = currentPage * limit;
// //       const response = await fetch(`https://server-pass-1.onrender.com/api/data?limit=${limit}&offset=${offset}`);
// //       const data = await response.json();

// //       const tasksArray = Object.values(data).flat();
// //       const filteredDeliveries = tasksArray.filter((delivery) => delivery.Step_ID === 0);

// //       const newDeliveries = filteredDeliveries.map((delivery) => ({
// //         delCode: delivery.DelCode_w_o__,
// //         client: `${delivery.Short_description} for ${delivery.Client}`,
// //         initiated: formatTimestamp(delivery.Planned_Start_Timestamp),
// //         deadline: calculateDeadline(delivery.Planned_Delivery_Timestamp, delivery.Planned_Start_Timestamp),
// //         tasksPlanned: delivery.Planned_Tasks || 0,
// //         tasksTotal: delivery.Total_Tasks || 0,
// //       }));

// //       setDeliveries((prev) => [...prev, ...newDeliveries]);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     } finally {
// //       setLoading(false); // Hide loading indicator
// //     }
// //   }, [limit]);

// //   useEffect(() => {
// //     fetchData(0); // Fetch the first page on mount
// //   }, [fetchData]);

// //   const formatTimestamp = (timestamp) => {
// //     if (!timestamp) return 'No start time';
// //     const date = new Date(timestamp?.value || timestamp);
// //     return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
// //   };

// //   const calculateDeadline = (deliveryTimestamp, startTimestamp) => {
// //     if (deliveryTimestamp && startTimestamp) {
// //       const deliveryTime = new Date(deliveryTimestamp?.value || deliveryTimestamp);
// //       const startTime = new Date(startTimestamp?.value || startTimestamp);
// //       if (isNaN(deliveryTime.getTime()) || isNaN(startTime.getTime())) return 'Invalid deadline';

// //       const timeDiff = deliveryTime - startTime;
// //       const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
// //       const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// //       return `${daysLeft} days ${hoursLeft} hrs left`;
// //     }
// //     return 'No deadline';
// //   };

// //   const handleSearchChange = (event) => {
// //     setSearchTerm(event.target.value);
// //   };

// //   const filteredDeliveries = deliveries.filter((delivery) =>
// //     delivery.client.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   useEffect(() => {
// //     if (observer.current) observer.current.disconnect();

// //     const loadMoreDeliveries = (entries) => {
// //       const [entry] = entries;
// //       if (entry.isIntersecting && !loading) {
// //         setPage((prevPage) => prevPage + 1);
// //       }
// //     };

// //     observer.current = new IntersectionObserver(loadMoreDeliveries, { threshold: 1.0 });

// //     const lastDeliveryElement = document.querySelector('.delivery-list-end');
// //     if (lastDeliveryElement) observer.current.observe(lastDeliveryElement);

// //     return () => {
// //       if (observer.current) observer.current.disconnect();
// //     };
// //   }, [filteredDeliveries, loading]);

// //   // Fetch more data whenever `page` changes
// //   useEffect(() => {
// //     if (page > 0) {
// //       fetchData(page);
// //     }
// //   }, [page, fetchData]);

// //   return (
// //     <Container>
// //       <h1 className="my-4">List of Deliveries</h1>

// //       <Row className="mb-4">
// //         <Col xs={10}>
// //           <Form.Control
// //             type="text"
// //             placeholder="Search for deliveries..."
// //             value={searchTerm}
// //             onChange={handleSearchChange}
// //           />
// //         </Col>
// //         <Col xs={2} className="text-right">
// //           <span role="img" aria-label="filter" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
// //             🔍
// //           </span>
// //         </Col>
// //       </Row>

// //       <p>You have {filteredDeliveries.length} active deliveries</p>

// //       <Row>
// //         {filteredDeliveries.map((delivery) => {
// //           const progress = delivery.tasksTotal === 0 ? 0 : (delivery.tasksPlanned / delivery.tasksTotal) * 100;

// //           return (
// //             <Col xs={12} key={delivery.delCode} className="mb-3">
// //               <LazyLoad
// //                 height={200}
// //                 offset={100}
// //                 once
// //                 placeholder={
// //                   <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
// //                     <FaSpinner className="spinner-icon" style={{ fontSize: '2rem', color: '#007bff', animation: 'spin 1s linear infinite' }} />
// //                   </div>
// //                 }
// //               >
// //                 <Link to={`/delivery/${delivery.delCode}`} className="card-link-wrapper">
// //                   <Card className="p-3 shadow-sm task-card">
// //                     <div
// //                       className="shaded-bg"
// //                       style={{ width: `${progress}%` }}
// //                     ></div>
// //                     <Card.Body>
// //                       <div className="d-flex justify-content-between align-items-center">
// //                         <div>
// //                           <div className="d-flex align-items-center mb-2">
// //                             <FiCheckCircle style={{ marginRight: '8px', color: 'green' }} />
// //                             <span className="font-weight-bold" style={{ fontSize: '1.5rem' }}>
// //                               {delivery.tasksPlanned} of {delivery.tasksTotal} Planned
// //                             </span>
// //                           </div>
// //                           <div className="mb-2">
// //                             <ProgressBar
// //                               now={progress}
// //                               variant={progress > 50 ? 'success' : progress > 20 ? 'warning' : 'danger'}
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="text-right">
// //                           <p className="mb-1 text-muted">
// //                             <FiClock style={{ marginRight: '5px' }} />
// //                             {delivery.initiated || 'No start time'}
// //                           </p>
// //                           <p className="mb-0 text-muted">
// //                             <FiFlag style={{ marginRight: '5px' }} />
// //                             {delivery.deadline}
// //                           </p>
// //                         </div>
// //                       </div>
// //                       <h5 className="mt-3">{delivery.client}</h5>
// //                     </Card.Body>
// //                   </Card>
// //                 </Link>
// //               </LazyLoad>
// //             </Col>
// //           );
// //         })}
// //       </Row>

// //       {loading && (
// //         <div className="text-center my-4">
// //           <FaSpinner className="spinner-icon" style={{ fontSize: '2rem', color: '#007bff', animation: 'spin 1s linear infinite' }} />
// //         </div>
// //       )}

// //       <div className="delivery-list-end" style={{ height: '1px', marginBottom: '20px' }}></div>
// //     </Container>
// //   );
// // };

// // export default DeliveryList;


// import React, { useState, useEffect, useRef, useCallback,useContext} from 'react';
// import { Link } from 'react-router-dom';
// import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
// import { FiClock, FiCheckCircle, FiFlag } from 'react-icons/fi';
// import { FaSpinner } from 'react-icons/fa';
// import { GoogleLogin } from '@react-oauth/google';
// import LazyLoad from 'react-lazyload';
// import { UserContext } from './UserContext';
// import {jwtDecode} from 'jwt-decode'; // Corrected import for jwt-decode
// import './DeliveryList.css';
// const limit = 500;


// const DeliveryList = () => {
  
//   const { userEmail, setUserEmail } = useContext(UserContext);
//   const [deliveries, setDeliveries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [authToken, setAuthToken] = useState(null);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const observer = useRef(null);

//   const onLoginSuccess = (response) => {
//     const { credential } = response;
//     try {
//       const decodedToken = jwtDecode(credential);
//       console.log('Decoded Token:', decodedToken);

//       if (decodedToken.email) {
//         setUserEmail(decodedToken.email);
//         setAuthToken(credential);
//         sessionStorage.setItem('userEmail', decodedToken.email);
//         sessionStorage.setItem('authToken', credential);
//         console.log('User Email:', decodedToken.email);
//       } else {
//         console.error('Login response does not contain a valid email:', response);
//       }
//     } catch (error) {
//       console.error('Error decoding JWT:', error);
//     }
//   };

//   const onLoginFailure = (error) => {
//     console.error('Login failed:', error);
//   };

//   const fetchData = useCallback(
//     async (currentPage) => {
//       if (!authToken || !userEmail) return; // Ensure both authToken and userEmail are present
      
//       try {
//         setLoading(true);
//         const offset = currentPage * limit;
//         const response = await fetch(`https://server-pass-1.onrender.com/api/data?email=${userEmail}&limit=${limit}&offset=${offset}`, {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         const tasksArray = Object.values(data).flat();
//         const filteredDeliveries = tasksArray.filter(
//           (delivery) => delivery.Step_ID === 0
//         );

//         const newDeliveries = filteredDeliveries.map((delivery) => ({
//           delCode: delivery.DelCode_w_o__,
//           client: `${delivery.Short_description} for ${delivery.Client}`,
//           initiated: formatTimestamp(delivery.Planned_Start_Timestamp),
//           deadline: calculateDeadline(
//             delivery.Planned_Delivery_Timestamp,
//             delivery.Planned_Start_Timestamp
//           ),
//           tasksPlanned: delivery.Planned_Tasks || 0,
//           tasksTotal: delivery.Total_Tasks || 0,
//         }));

//         setDeliveries((prev) => [...prev, ...newDeliveries]);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [authToken, userEmail]
//   );
//   useEffect(() => {
//     // Check if userEmail and authToken are stored in sessionStorage
//     const storedUserEmail = sessionStorage.getItem('userEmail');
//     const storedAuthToken = sessionStorage.getItem('authToken');

//     if (storedUserEmail && storedAuthToken) {
//       setUserEmail(storedUserEmail);
//       setAuthToken(storedAuthToken);
//     }
//   }, [setUserEmail]);
//   useEffect(() => {
//     if (userEmail) fetchData(0); // Fetch data only when userEmail is defined
//   }, [fetchData, userEmail]);

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'No start time';
//     const date = new Date(timestamp?.value || timestamp);
//     return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
//   };

//   const calculateDeadline = (deliveryTimestamp, startTimestamp) => {
//     if (deliveryTimestamp && startTimestamp) {
//       const deliveryTime = new Date(deliveryTimestamp?.value || deliveryTimestamp);
//       const startTime = new Date(startTimestamp?.value || startTimestamp);
//       if (isNaN(deliveryTime.getTime()) || isNaN(startTime.getTime())) return 'Invalid deadline';

//       const timeDiff = deliveryTime - startTime;
//       const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//       const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       return `${daysLeft} days ${hoursLeft} hrs left`;
//     }
//     return 'No deadline';
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const filteredDeliveries = deliveries.filter((delivery) =>
//     delivery.client.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     if (observer.current) observer.current.disconnect();

//     const loadMoreDeliveries = (entries) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && !loading) {
//         setPage((prevPage) => prevPage + 1);
//       }
//     };

//     observer.current = new IntersectionObserver(loadMoreDeliveries, { threshold: 1.0 });

//     const lastDeliveryElement = document.querySelector('.delivery-list-end');
//     if (lastDeliveryElement) observer.current.observe(lastDeliveryElement);

//     return () => {
//       if (observer.current) observer.current.disconnect();
//     };
//   }, [filteredDeliveries, loading]);

//   useEffect(() => {
//     if (page > 0) {
//       fetchData(page);
//     }
//   }, [page, fetchData]);

//   return (
//     <Container>
//       {!userEmail ? (
//         <GoogleLogin
//           onSuccess={onLoginSuccess}
//           onFailure={onLoginFailure}
//           scope="email"
//           cookiePolicy={'single_host_origin'}
//           buttonText="Login with Google"
//         />
//       ) : (
//         <>
//           <h1 className="my-4">List of Deliveries</h1>

//           <Row className="mb-4">
//             <Col xs={10}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search for deliveries..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//             </Col>
//             <Col xs={2} className="text-right">
//               <span role="img" aria-label="filter" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
//                 🔍
//               </span>
//             </Col>
//           </Row>

//           <p>You have {filteredDeliveries.length} active deliveries</p>

//           <Row>
//             {filteredDeliveries.map((delivery) => {
//               const progress =
//                 delivery.tasksTotal === 0 ? 0 : (delivery.tasksPlanned / delivery.tasksTotal) * 100;

//               return (
//                 <Col xs={12} key={delivery.delCode} className="mb-3">
//                   <LazyLoad
//                     height={200}
//                     offset={100}
//                     once
//                     placeholder={
//                       <div
//                         className="d-flex justify-content-center align-items-center"
//                         style={{ height: '200px' }}
//                       >
//                         <FaSpinner
//                           className="spinner-icon"
//                           style={{
//                             fontSize: '2rem',
//                             color: '#007bff',
//                             animation: 'spin 1s linear infinite',
//                           }}
//                         />
//                       </div>
//                     }
//                   >
//                     <Link to={`/delivery/${delivery.delCode}`} className="card-link-wrapper">
//                       <Card className="p-3 shadow-sm task-card">
//                         <div className="shaded-bg" style={{ width: `${progress}%` }}></div>
//                         <Card.Body>
//                           <div className="d-flex justify-content-between align-items-center">
//                             <div>
//                               <div className="d-flex align-items-center mb-2">
//                                 <FiCheckCircle style={{ marginRight: '8px', color: 'green' }} />
//                                 <span
//                                   className="font-weight-bold"
//                                   style={{ fontSize: '1.5rem' }}
//                                 >
//                                   {delivery.tasksPlanned} of {delivery.tasksTotal} Planned
//                                 </span>
//                               </div>
//                               <div className="mb-2">
//                                 <ProgressBar
//                                   now={progress}
//                                   variant={progress > 50 ? 'success' : progress > 20 ? 'warning' : 'danger'}
//                                 />
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="mb-1 text-muted">
//                                 <FiClock style={{ marginRight: '5px' }} />
//                                 {delivery.initiated || 'No start time'}
//                               </p>
//                               <p className="mb-0 text-muted">
//                                 <FiFlag style={{ marginRight: '5px' }} />
//                                 {delivery.deadline}
//                               </p>
//                                 <p>
//                                {delivery.delCode}
//                               </p>
//                             </div>
//                           </div>
//                           <h5 className="mt-3">{delivery.client}</h5>
//                         </Card.Body>
//                       </Card>
//                     </Link>
//                   </LazyLoad>
//                 </Col>
//               );
//             })}
//           </Row>

//           {loading && (
//             <div className="text-center my-4">
//               <FaSpinner
//                 className="spinner-icon"
//                 style={{ fontSize: '2rem', color: '#007bff', animation: 'spin 1s linear infinite' }}
//               />
//             </div>
//           )}

//           <div className="delivery-list-end" />
//         </>
//       )}
//     </Container>
//   );
// };

// export default DeliveryList;

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
import { FiClock, FiCheckCircle, FiFlag } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
//import LazyLoad from 'react-lazyload';
import {jwtDecode} from 'jwt-decode';
import { Dropdown } from 'react-bootstrap';
import { UserContext } from './UserContext'; // Import UserContext
import './DeliveryList.css';
import DeleteButton from './DeleteButton';

//const limit = 500;

const DeliveryList = () => {
  const { userEmail, setUserEmail } = useContext(UserContext);

  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedClient, setSelectedClient] = useState('');
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);

  const onLoginSuccess = (response) => {
    const { credential } = response;
    try {
      const decodedToken = jwtDecode(credential);

      if (decodedToken.email) {
        setUserEmail(decodedToken.email);
        setAuthToken(credential);

        // Save userEmail and authToken in sessionStorage for session persistence
        sessionStorage.setItem('userEmail', decodedToken.email);
        sessionStorage.setItem('authToken', credential);
      } else {
        console.error('Login response does not contain a valid email:', response);
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  };

  const onLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  // const fetchData = useCallback(
  //   async (currentPage) => {
  //     if (!authToken || !userEmail) return; // Ensure both authToken and userEmail are present
      
  //     try {
  //       setLoading(true);
  //      // const offset = currentPage * limit;
  //       const response = await fetch(`https://server-pass-1.onrender.com/api/data?email=${userEmail}`, {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       const tasksArray = Object.values(data).flat();
  //       const filteredDeliveries = tasksArray.filter(
  //         (delivery) => delivery.Step_ID === 0
  //       );

  //       const newDeliveries = filteredDeliveries.map((delivery) => ({
  //         delCode: delivery.DelCode_w_o__,
  //         client: `${delivery.Client}`,
  //         initiated: formatTimestamp(delivery.Planned_Start_Timestamp),
  //         deadline: calculateDeadline(
  //           delivery.Planned_Delivery_Timestamp,
  //           delivery.Planned_Start_Timestamp
  //         ),
  //         tasksPlanned: delivery.Planned_Tasks || 0,
  //         tasksTotal: delivery.Total_Tasks || 0,
  //       }));

  //       setDeliveries((prev) => [...prev, ...newDeliveries]);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [authToken, userEmail]
  // );
   const fetchData = useCallback(
    async (currentPage) => {
      if (!authToken || !userEmail) return; // Ensure both authToken and userEmail are present
      
      try {
        setLoading(true);
  
        const response = await fetch(`https://server-pass-1.onrender.com/api/data?email=${userEmail}&page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        const tasksArray = Object.values(data).flat();
        
        // Filter deliveries that are active (Step_ID === 0)
        const filteredDeliveries = tasksArray.filter((delivery) => delivery.Step_ID === 0 || delivery.Step_ID === 1 );
  
        // If there are no new deliveries, stop pagination
        if (filteredDeliveries.length === 0) {
          console.log("No new deliveries to load, stopping further fetch.");
          return;
        }
  
        const newDeliveries = filteredDeliveries.map((delivery) => ({
          delCode: delivery.DelCode_w_o__,
          client: `${delivery.Client}`,
          initiated: formatTimestamp(delivery.Planned_Start_Timestamp),
          deadline: calculateDeadline(
            delivery.Planned_Delivery_Timestamp,
            delivery.Planned_Start_Timestamp
          ),
          tasksPlanned: delivery.Planned_Tasks || 0,
          tasksTotal: delivery.Total_Tasks || 0,
        }));
  
        // Remove any deliveries that are already in the state (based on unique delCode)
        setDeliveries((prev) => {
          // Filter out deliveries that are already in the state by checking `delCode`
          const newUniqueDeliveries = newDeliveries.filter(
            (newDel) => !prev.some((prevDel) => prevDel.delCode === newDel.delCode)
          );
  
          // If no new unique deliveries, prevent updating state
          if (newUniqueDeliveries.length === 0) {
            console.log('No new unique deliveries to add.');
            return prev;
          }
  
          // Otherwise, add the new unique deliveries to the state
          return [...prev, ...newUniqueDeliveries];
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
    [authToken, userEmail]
  );




   const handleDelete = (deliveryCode) => {
    // Update the state to remove the deleted delivery
    setDeliveries(deliveries.filter(delivery => delivery.DelCode_w_o__ !== deliveryCode));
  };


  
  useEffect(() => {
    // Check if userEmail and authToken are stored in sessionStorage
    const storedUserEmail = sessionStorage.getItem('userEmail');
    const storedAuthToken = sessionStorage.getItem('authToken');

    if (storedUserEmail && storedAuthToken) {
      setUserEmail(storedUserEmail);
      setAuthToken(storedAuthToken);
    }
  }, [setUserEmail]);

  useEffect(() => {
    if (userEmail) fetchData(0);
  }, [fetchData, userEmail]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No start time';
    const date = new Date(timestamp?.value || timestamp);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
  };

  const calculateDeadline = (deliveryTimestamp, startTimestamp) => {
    if (deliveryTimestamp && startTimestamp) {
      const deliveryTime = new Date(deliveryTimestamp?.value || deliveryTimestamp);
      const startTime = new Date(startTimestamp?.value || startTimestamp);
      if (isNaN(deliveryTime.getTime()) || isNaN(startTime.getTime())) return 'Invalid deadline';

      const timeDiff = deliveryTime - startTime;
      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${daysLeft} days ${hoursLeft} hrs left`;
    }
    return 'No deadline';
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const filteredDeliveries1 = deliveries.filter((delivery) =>
  //   delivery.client.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Dynamic filtering based on selected client
  const filteredDeliveries = deliveries
    .filter((delivery) => {
      const matchesSearch = delivery.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient = selectedClient ? delivery.client === selectedClient : true;
      return matchesSearch && matchesClient;
    });

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const loadMoreDeliveries = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(loadMoreDeliveries, { threshold: 1.0 });

    const lastDeliveryElement = document.querySelector('.delivery-list-end');
    if (lastDeliveryElement) observer.current.observe(lastDeliveryElement);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [filteredDeliveries, loading]);

  useEffect(() => {
    if (page > 0) {
      fetchData(page);
    }
  }, [page, fetchData]);

   // Get unique clients for the dropdown
   const uniqueClients = [...new Set(deliveries.map((delivery) => delivery.client))];
  

  return (
    <Container>
      {!userEmail ? (
        <GoogleLogin
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          scope="email"
          cookiePolicy={'single_host_origin'}
          buttonText="Login with Google"
        />
      ) : (
        <>
          <h1 className="my-4">List of Deliveries</h1>
          <Row className="mb-4">
            <Col xs={10}>
              <Form.Control
                type="text"
                placeholder="Search for deliveries..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Col>
            <Col xs={2} className="text-right">
              <span role="img" aria-label="filter" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                🔍
              </span>
            </Col>
            <Col xs={2} className="text-right">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-client">
                  {selectedClient || "Filter by Client"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedClient('')}>All Clients</Dropdown.Item>
                  {uniqueClients.map((client, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setSelectedClient(client)}
                    >
                      {client}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <p>You have {filteredDeliveries.length} active deliveries</p>

          <Row>
            {filteredDeliveries.map((delivery) => {
              const progress =
                delivery.tasksTotal === 0 ? 0 : (delivery.tasksPlanned / delivery.tasksTotal) * 100;

              return (
                <Col xs={12} key={delivery.delCode} className="mb-3">
                 
                    <Link to={`/delivery/${delivery.delCode}`} className="card-link-wrapper">
                      <Card className="p-3 shadow-sm task-card">
                        <div className="shaded-bg" style={{ width: `${progress}%` }}></div>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="d-flex align-items-center mb-2">
                                <FiCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                                <span
                                  className="font-weight-bold"
                                  style={{ fontSize: '1.5rem' }}
                                >
                                  {delivery.tasksPlanned} of {delivery.tasksTotal} Planned
                                </span>
                                    <DeleteButton deliveryCode={delivery.delCode} onDelete={handleDelete} />
                              </div>
                              <div className="mb-2">
                                <ProgressBar
                                  now={progress}
                                  variant={progress > 50 ? 'success' : progress > 20 ? 'warning' : 'danger'}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="mb-1 text-muted">
                                <FiClock style={{ marginRight: '5px' }} /> {delivery.initiated}
                              </p>
                              <p className="mb-0 text-danger">
                                <FiFlag style={{ marginRight: '5px' }} /> {delivery.deadline}
                              </p>
                              <p>
                               {delivery.delCode}
                              </p>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                
                </Col>
              );
            })}
          </Row>

          <div className="delivery-list-end"></div>

          {loading && (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
              <FaSpinner
                className="spinner-icon"
                style={{ fontSize: '2rem', color: '#007bff', animation: 'spin 1s linear infinite' }}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default DeliveryList;


