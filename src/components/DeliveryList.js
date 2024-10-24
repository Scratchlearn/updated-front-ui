// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
// import { FiClock, FiCheckCircle, FiFlag } from 'react-icons/fi';
// import { FaSpinner } from 'react-icons/fa'; // Import a spinner icon for lazy load
// import LazyLoad from 'react-lazyload';
// import './DeliveryList.css';

// const DeliveryList = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [visibleDeliveries, setVisibleDeliveries] = useState(10); // Start by showing 10
//   const observer = useRef(null); // Reference for the intersection observer

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/api/data');
//         const data = await response.json();

//         const tasksArray = Object.values(data).flat();
//         const filteredDeliveries = tasksArray.filter(delivery => delivery.Step_ID === 0);

//         const mappedDeliveries = filteredDeliveries.map(delivery => ({
//           delCode: delivery.DelCode_w_o__,
//           client: `${delivery.Short_description} for ${delivery.Client}`,
//           initiated: formatTimestamp(delivery.Planned_Start_Timestamp),
//           deadline: calculateDeadline(delivery.Planned_Delivery_Timestamp, delivery.Planned_Start_Timestamp),
//           tasksPlanned: delivery.Planned_Tasks || 0,
//           tasksTotal: delivery.Total_Tasks || 0,
//         }));

//         setDeliveries(mappedDeliveries);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Function to format timestamps
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'No start time';
//     const date = new Date(timestamp?.value || timestamp);
//     return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
//   };

//   // Function to calculate deadline
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

//   // Handle search input
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Filter deliveries based on the search term
//   const filteredDeliveries = deliveries.filter((delivery) =>
//     delivery.client.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Set up the intersection observer for lazy loading
//   useEffect(() => {
//     if (observer.current) observer.current.disconnect(); // Disconnect the previous observer if any

//     const loadMoreDeliveries = (entries) => {
//       const [entry] = entries;
//       if (entry.isIntersecting) {
//         setVisibleDeliveries((prev) => prev + 5); // Load 5 more deliveries when the user scrolls down
//       }
//     };

//     observer.current = new IntersectionObserver(loadMoreDeliveries, { threshold: 1.0 });

//     const lastDeliveryElement = document.querySelector('.delivery-list-end');
//     if (lastDeliveryElement) observer.current.observe(lastDeliveryElement);

//     return () => {
//       if (observer.current) observer.current.disconnect(); // Cleanup the observer when component unmounts or re-renders
//     };
//   }, [filteredDeliveries]);

//   return (
//     <Container>
//       <h1 className="my-4">List of Deliveries</h1>

//       <Row className="mb-4">
//         <Col xs={10}>
//           <Form.Control
//             type="text"
//             placeholder="Search for deliveries..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </Col>
//         <Col xs={2} className="text-right">
//           <span role="img" aria-label="filter" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
//             🔍
//           </span>
//         </Col>
//       </Row>

//       <p>You have {filteredDeliveries.length} active deliveries</p>

//       <Row>
//         {filteredDeliveries.slice(0, visibleDeliveries).map((delivery, index) => {
//           const progress = delivery.tasksTotal === 0 ? 0 : (delivery.tasksPlanned / delivery.tasksTotal) * 100;

//           return (
//             <Col xs={12} key={delivery.delCode} className="mb-3">
//               <LazyLoad
//                 height={200}
//                 offset={100}
//                 once
//                 placeholder={
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
//                     <FaSpinner className="spinner-icon" style={{ fontSize: '2rem', color: '#007bff', animation: 'spin 1s linear infinite' }} />
//                   </div>
//                 }
//               >
//                 <Link to={`/delivery/${delivery.delCode}`} className="card-link-wrapper">
//                   <Card className="p-3 shadow-sm task-card">
//                     <div
//                       className="shaded-bg"
//                       style={{ width: `${progress}%` }}
//                     ></div>
//                     <Card.Body>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <div>
//                           <div className="d-flex align-items-center mb-2">
//                             <FiCheckCircle style={{ marginRight: '8px', color: 'green' }} />
//                             <span className="font-weight-bold" style={{ fontSize: '1.5rem' }}>
//                               {delivery.tasksPlanned} of {delivery.tasksTotal} Planned
//                             </span>
//                           </div>
//                           <div className="mb-2">
//                             <ProgressBar
//                               now={progress}
//                               variant={progress > 50 ? 'success' : progress > 20 ? 'warning' : 'danger'}
//                             />
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="mb-1 text-muted">
//                             <FiClock style={{ marginRight: '5px' }} />
//                             {delivery.initiated || 'No start time'}
//                           </p>
//                           <p className="mb-0 text-muted">
//                             <FiFlag style={{ marginRight: '5px' }} />
//                             {delivery.deadline}
//                           </p>
//                         </div>
//                       </div>
//                       <h5 className="mt-3">{delivery.client}</h5>
//                     </Card.Body>
//                   </Card>
//                 </Link>
//               </LazyLoad>
//             </Col>
//           );
//         })}
//       </Row>

//       {/* An invisible div at the end to trigger lazy loading */}
//       <div className="delivery-list-end" style={{ height: '1px', marginBottom: '20px' }}></div>
//     </Container>
//   );
// };

// export default DeliveryList;


import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
import { FiClock, FiCheckCircle, FiFlag } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import LazyLoad from 'react-lazyload';
import './DeliveryList.css';

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleDeliveries, setVisibleDeliveries] = useState(10); // Start by showing 10
  const observer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/data');
        const data = await response.json();
  
        const tasksArray = Object.values(data).flat();
        const filteredDeliveries = tasksArray.filter((delivery) => delivery.Step_ID === 0);
  
        const mappedDeliveries = filteredDeliveries.map((delivery) => ({
          delCode: delivery.DelCode_w_o__,
          client: `${delivery.Short_description} for ${delivery.Client}`,
          initiated: formatTimestamp(delivery.Planned_Start_Timestamp),
          deadline: calculateDeadline(delivery.Planned_Delivery_Timestamp, delivery.Planned_Start_Timestamp),
          tasksPlanned: delivery.Planned_Tasks || 0,
          tasksTotal: delivery.Total_Tasks || 0,
        }));
  
        // Cache the data
        localStorage.setItem('deliveries', JSON.stringify(mappedDeliveries));
        localStorage.setItem('cacheTime', Date.now());
  
        setDeliveries(mappedDeliveries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const cachedData = localStorage.getItem('deliveries');
    const cacheTime = localStorage.getItem('cacheTime');
    const isCacheValid = cacheTime && (Date.now() - cacheTime) < 3600000; // Cache valid for 1 hour
  
    if (cachedData && isCacheValid) {
      // Use cached deliveries if available and valid
      setDeliveries(JSON.parse(cachedData));
    } else {
      // Fetch data if cache is missing or expired
      fetchData();
    }
  }, []);
  

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

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const loadMoreDeliveries = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisibleDeliveries((prev) => prev + 5); // Load 5 more deliveries when the user scrolls down
      }
    };

    observer.current = new IntersectionObserver(loadMoreDeliveries, { threshold: 1.0 });

    const lastDeliveryElement = document.querySelector('.delivery-list-end');
    if (lastDeliveryElement) observer.current.observe(lastDeliveryElement);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [filteredDeliveries]);

  return (
    <Container>
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
      </Row>

      <p>You have {filteredDeliveries.length} active deliveries</p>

      <Row>
        {filteredDeliveries.slice(0, visibleDeliveries).map((delivery) => {
          const progress = delivery.tasksTotal === 0 ? 0 : (delivery.tasksPlanned / delivery.tasksTotal) * 100;

          return (
            <Col xs={12} key={delivery.delCode} className="mb-3">
              <LazyLoad
                height={200}
                offset={100}
                once
                placeholder={
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <FaSpinner className="spinner-icon" style={{ fontSize: '2rem', color: '#007bff', animation: 'spin 1s linear infinite' }} />
                  </div>
                }
              >
                <Link to={`/delivery/${delivery.delCode}`} className="card-link-wrapper">
                  <Card className="p-3 shadow-sm task-card">
                    <div
                      className="shaded-bg"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            <FiCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                            <span className="font-weight-bold" style={{ fontSize: '1.5rem' }}>
                              {delivery.tasksPlanned} of {delivery.tasksTotal} Planned
                            </span>
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
                            <FiClock style={{ marginRight: '5px' }} />
                            {delivery.initiated || 'No start time'}
                          </p>
                          <p className="mb-0 text-muted">
                            <FiFlag style={{ marginRight: '5px' }} />
                            {delivery.deadline}
                          </p>
                        </div>
                      </div>
                      <h5 className="mt-3">{delivery.client}</h5>
                    </Card.Body>
                  </Card>
                </Link>
              </LazyLoad>
            </Col>
          );
        })}
      </Row>

      <div className="delivery-list-end" style={{ height: '1px', marginBottom: '20px' }}></div>
    </Container>
  );
};

export default DeliveryList;
