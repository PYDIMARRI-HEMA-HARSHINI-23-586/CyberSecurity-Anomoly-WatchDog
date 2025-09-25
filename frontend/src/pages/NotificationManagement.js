
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_BASE_URL = 'http://localhost:5000';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotificationType, setNewNotificationType] = useState('Email');
  const [newNotificationRecipient, setNewNotificationRecipient] = useState('');
  const [newNotificationMessageTemplate, setNewNotificationMessageTemplate] = useState('');
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddNotification = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newNotificationType,
          recipient: newNotificationRecipient,
          message_template: newNotificationMessageTemplate,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewNotificationType('Email');
      setNewNotificationRecipient('');
      setNewNotificationMessageTemplate('');
      fetchNotifications();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEditNotification = (notification) => {
    setEditingNotificationId(notification.id);
    setNewNotificationType(notification.type);
    setNewNotificationRecipient(notification.recipient);
    setNewNotificationMessageTemplate(notification.message_template);
  };

  const handleUpdateNotification = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${editingNotificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newNotificationType,
          recipient: newNotificationRecipient,
          message_template: newNotificationMessageTemplate,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingNotificationId(null);
      setNewNotificationType('Email');
      setNewNotificationRecipient('');
      setNewNotificationMessageTemplate('');
      fetchNotifications();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNotifications();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Notification Management
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingNotificationId ? 'Edit Notification' : 'Add New Notification'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="notification-type-label">Notification Type</InputLabel>
          <Select
            labelId="notification-type-label"
            value={newNotificationType}
            label="Notification Type"
            onChange={(e) => setNewNotificationType(e.target.value)}
          >
            <MenuItem value="Email">Email</MenuItem>
            {/* Add other types like SMS, Slack if needed */}
          </Select>
        </FormControl>
        <TextField
          label="Recipient (e.g., email@example.com)"
          fullWidth
          value={newNotificationRecipient}
          onChange={(e) => setNewNotificationRecipient(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Message Template (e.g., Anomaly {rule_name} detected at {timestamp})"
          fullWidth
          multiline
          rows={4}
          value={newNotificationMessageTemplate}
          onChange={(e) => setNewNotificationMessageTemplate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={editingNotificationId ? handleUpdateNotification : handleAddNotification}
        >
          {editingNotificationId ? 'Update Notification' : 'Add Notification'}
        </Button>
        {editingNotificationId && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setEditingNotificationId(null);
              setNewNotificationType('Email');
              setNewNotificationRecipient('');
              setNewNotificationMessageTemplate('');
            }}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        )}
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Existing Notifications
      </Typography>
      <List component={Paper} elevation={3}>
        {notifications.map((notification) => (
          <ListItem key={notification.id} divider>
            <ListItemText
              primary={`${notification.type} to ${notification.recipient}`}
              secondary={
                <Typography component="span" variant="body2" color="textPrimary">
                  Template: {notification.message_template}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditNotification(notification)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNotification(notification.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationManagement;
