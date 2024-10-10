import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', phone_number: '', email: '', user_id: 1 });
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const api_url = 'https://ad05cf14-c6a1-47ee-bf07-5e67270d988b-00-1l68yogb2dq5j.sisko.replit.dev';

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${api_url}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update event
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(`${api_url}/events/${currentEventId}`, form);
      } else {
        await axios.post(`${api_url}/events`, form);
      }
      fetchEvents();
      handleClose();
    } catch (error) {
      console.error('Error creating/updating event:', error);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api_url}/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Open modal
  const handleShow = () => {
    setShow(true);
    setEditMode(false);
    setForm({ title: '', description: '', date: '', time: '', phone_number: '', email: '' });
  };

  // Open modal for editing
  const handleEdit = (event) => {
    setShow(true);
    setEditMode(true);
    setCurrentEventId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      phone_number: event.phone_number,
      email: event.email,
    });
  };

  // Close modal
  const handleClose = () => setShow(false);

  return (
    <div className="container">
      <h1 className="my-4">Event Management</h1>

      <Button className="mb-3" variant="primary" onClick={handleShow}>
        Add Event
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Time</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.date}</td>
              <td>{event.time}</td>
              <td>{event.phone_number}</td>
              <td>{event.email}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(event)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(event.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for creating/updating events */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Event' : 'Add Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={form.title} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" value={form.description} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="text" name="date" value={form.date} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="text" name="time" value={form.time} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phone_number" value={form.phone_number} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? 'Update Event' : 'Create Event'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventManagement;