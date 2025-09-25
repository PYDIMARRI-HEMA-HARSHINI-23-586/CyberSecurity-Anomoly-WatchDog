
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_BASE_URL = 'http://localhost:5000';

const RuleManagement = () => {
  const [rules, setRules] = useState([]);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCondition, setNewRuleCondition] = useState('');
  const [newRuleAction, setNewRuleAction] = useState('');
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRules(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddRule = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRuleName, condition: newRuleCondition, action: newRuleAction }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewRuleName('');
      setNewRuleCondition('');
      setNewRuleAction('');
      fetchRules();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEditRule = (rule) => {
    setEditingRuleId(rule.id);
    setNewRuleName(rule.name);
    setNewRuleCondition(rule.condition);
    setNewRuleAction(rule.action);
  };

  const handleUpdateRule = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules/${editingRuleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRuleName, condition: newRuleCondition, action: newRuleAction }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingRuleId(null);
      setNewRuleName('');
      setNewRuleCondition('');
      setNewRuleAction('');
      fetchRules();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchRules();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rule Management
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingRuleId ? 'Edit Rule' : 'Add New Rule'}
        </Typography>
        <TextField
          label="Rule Name"
          fullWidth
          value={newRuleName}
          onChange={(e) => setNewRuleName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Condition (e.g., user_id == '123' and login_success == 0)"
          fullWidth
          value={newRuleCondition}
          onChange={(e) => setNewRuleCondition(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Action (e.g., alert_admin)"
          fullWidth
          value={newRuleAction}
          onChange={(e) => setNewRuleAction(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={editingRuleId ? handleUpdateRule : handleAddRule}
        >
          {editingRuleId ? 'Update Rule' : 'Add Rule'}
        </Button>
        {editingRuleId && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setEditingRuleId(null);
              setNewRuleName('');
              setNewRuleCondition('');
              setNewRuleAction('');
            }}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        )}
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Existing Rules
      </Typography>
      <List component={Paper} elevation={3}>
        {rules.map((rule) => (
          <ListItem key={rule.id} divider>
            <ListItemText
              primary={rule.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Condition: {rule.condition}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Action: {rule.action}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditRule(rule)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRule(rule.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RuleManagement;
