import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Slider, DatePicker, Select, notification, Row, Col } from 'antd';
import moment from 'moment';
import './FormComponent.css';

const { Option } = Select;

const FormComponent = ({ onSubmit, task }) => {
    const [form] = Form.useForm();
    const [sliderCount, setSliderCount] = useState(0);
    const [hours, setHours] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [deliverySlot, setDeliverySlot] = useState(null);
    const [personResponsible, setPersonResponsible] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                if (task) {
                    form.setFieldsValue({
                        name: task.Task_Details || '',
                    });
                    setPersonResponsible(task.Responsibility || '');
    
                    // Fetch additional data for start and end dates and total duration
                    const response = await fetch(`https://server-pass-1.onrender.com/api/per-key-per-day`);
                    const data = await response.json();
    
                    const taskData = data[task.Key];
                    if (taskData) {
                        const taskEntries = taskData.entries;
                         console.log(taskData.totalDuration)
                        // Convert totalDuration from minutes to hours and minutes
                        const totalMinutes = taskData.totalDuration || 0;
                        const hours = Math.floor(totalMinutes / 60);
                        console.log(hours);
                        const minutes = totalMinutes % 60;
                        console.log(minutes)
                        setHours({0:`${hours}h ${minutes}m` }); // Format as 'xh ym'
                        console.log()
                        // Filter entries with valid dates
                        const validDays = taskEntries
                            .map((entry) => entry.Day?.value)
                            .filter((date) => date);
    
                        // Determine the start and end dates based on min and max values
                        if (validDays.length > 0) {
                            const start = moment.min(validDays.map((d) => moment(d)));
                            const end = moment.max(validDays.map((d) => moment(d)));
    
                            setStartDate(start);
                            setEndDate(end);
    
                            // Calculate the number of days between start and end dates
                            const daysDiff = end.diff(start, 'days') + 1;
                            setNumberOfDays(daysDiff);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };
    
        fetchTaskData();
    }, [task, form]);
    

    const handleStartDateChange = (e) => {
        const inputDate = e.target.value;
        const parsedDate = moment(inputDate, 'YYYY-MM-DD', true); // Adjust format as needed

        if (parsedDate.isValid()) {

            setStartDate(parsedDate);
            if (numberOfDays) {
                calculateEndDate(parsedDate, numberOfDays);
            }
        } else {
            // Optionally show an error if the date is invalid
            console.error("Invalid date format. Please use 'YYYY-MM-DD'");
        }
    };
    const handleNumberOfDaysChange = (days) => {
        const numericDays = parseInt(days, 10) || 0;
        setNumberOfDays(numericDays);
        if (startDate && numericDays) {
            calculateEndDate(startDate, numericDays);
        }
    };

    const calculateEndDate = (start, days) => {
        if (start && days) {
            const calculatedEndDate = moment(start).add(days - 1, 'days');
            setEndDate(calculatedEndDate);
            setSliderCount(days);
        } else {
            setEndDate(null);
            setSliderCount(0);
        }
    };

    const calculateTotalTime = () => {
        return Object.values(hours).reduce((acc, curr) => acc + curr, 0);
    };

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                const totalTime = calculateTotalTime();
                const slidersData = Array.from({ length: sliderCount }).map((_, index) => {
                    const calculatedDay = moment(startDate).add(index, 'days');
                    const formattedDay = calculatedDay.isValid() ? calculatedDay.format('YYYY-MM-DD') : null; // Check validity
                    return {
                        day: formattedDay,
                        duration: hours[index] || 0,
                    };
                });

                const scheduledData = {
                    Key: task.Key,
                    Delivery_code: task.Delivery_code,
                    DelCode_w_o__: task.Delivery_code,
                    Step_ID: task.Step_ID,
                    Task_Details: values.name,
                    Frequency___Timeline: task.Frequency___Timeline,
                    Client: task.Client,
                    Short_description: task.Short_description,
                    Planned_Start_Timestamp: startDate ? { value: moment(startDate).add(1, 'days').toISOString() } : null,
                    Planned_Delivery_Timestamp: endDate ? { value: moment(endDate).add(1, 'days').toISOString() } : null,
                    Responsibility: personResponsible,
                    Current_Status: task.Current_Status,
                    Total_Tasks: task.Total_Tasks,
                    Completed_Tasks: task.Completed_Tasks,
                    Planned_Tasks: task.Planned_Tasks,
                    Percent_Tasks_Completed: task.Percent_Tasks_Completed,
                    Created_at: moment().format('DD/MM/YYYY'),
                    Updated_at: moment().format('DD/MM/YYYY'),
                    Time_Left_For_Next_Task_dd_hh_mm_ss: task.Time_Left_For_Next_Task_dd_hh_mm_ss,
                    Percent_Delivery_Planned: task.Percent_Delivery_Planned,
                    Card_Corner_Status: task.Card_Corner_Status,
                    sliders: slidersData, // Use the slidersData created above
                };

                console.log('Scheduled Data:', scheduledData);
                // Sending data to server using POST method
                fetch('https://server-pass-1.onrender.com/api/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(scheduledData),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(() => {
                        notification.success({
                            message: 'Task Updated',
                            description: 'Your task has been successfully updated!',
                        });
                        // Inform the parent component about the update
                        onSubmit({
                            personResponsible,
                            totalTime,
                            Planned_Delivery_Timestamp: scheduledData.Planned_Delivery_Timestamp,
                        });
                        //Reset form and states after submission
                        // Reset delivery slot as well
                    })
                    .catch((error) => {
                        notification.error({
                            message: 'Error',
                            description: error.message || 'An error occurred while updating the task.',
                        });
                    });
            })
            .catch(() => {
                notification.error({
                    message: 'Error',
                    description: 'Please fill in all required fields',
                });
            });
    };

    const handleSliderChange = (index, value) => {
        setHours((prev) => ({ ...prev, [index]: value }));
    };

    const handleInputChange = (index, value) => {
        let numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
            numericValue = 0;
        }
        setHours((prev) => ({
            ...prev,
            [index]: numericValue > 480 ? 480 : numericValue < 1 ? 1 : numericValue,
        }));
    };

    const customMarks = {
        1: '1 m',
        60: '1 h',
        120: '2 h',
        180: '3 h',
        240: '4 h',
        300: '5 h',
        360: '6 h',
        420: '7 h',
        480: '8 h',
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
                name="name"
                label="Task Name"
                rules={[{ required: true, message: 'Please input the task name!' }]}
            >
                <Input />
            </Form.Item>

            <Row gutter={[8, 16]}>
                <Col xs={24} sm={8}>
                    <Form.Item label="Start Date">
                        <Input
                            type="date"
                            onChange={handleStartDateChange}
                            value={startDate ? startDate.format('YYYY-MM-DD') : ''} // Show formatted date if available
                            placeholder="Enter start date (YYYY-MM-DD)"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item label="Number of Days">
                        <Input
                            type="number"
                            value={numberOfDays}
                            onChange={(e) => handleNumberOfDaysChange(e.target.value)}
                            min={1}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item label="End Date">
                        <DatePicker
                            type='date'
                            value={endDate ? moment(endDate) : null}
                            disabled
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {Array.from({ length: sliderCount }).map((_, index) => (
                <Form.Item key={index} label={`Hours for Day ${index + 1}`}>
                    <Row gutter={20}>
                        <Col xs={20}>
                            <Slider
                                marks={customMarks}
                                min={1}
                                max={480}
                                step={1}
                                onChange={(value) => handleSliderChange(index, value)}
                                value={hours[index] || 0}
                                tooltip={{ formatter: (value) => `${value} minutes` }}
                            />
                        </Col>
                        <Col xs={4}>
                            <Input
                                type="number"
                                min={1}
                                max={480}
                                value={hours[index] || 0}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                addonAfter="min"
                            />
                        </Col>
                    </Row>
                </Form.Item>
            ))}

            <Form.Item
                name="deliverySlot"
                label="Delivery Slot"
                rules={[{ required: true, message: 'Please select a delivery slot!' }]}
            >
                <Select
                    placeholder="Select a delivery slot"
                    onChange={setDeliverySlot}
                    value={deliverySlot}
                >
                    <Option value="1pm">1pm</Option>
                    <Option value="4pm">4pm</Option>
                    <Option value="7pm">7pm</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Person Responsible"
                rules={[{ required: true, message: 'Please input the person responsible!' }]}
            >
                <Input
                    value={personResponsible}
                    onChange={(e) => setPersonResponsible(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormComponent;

