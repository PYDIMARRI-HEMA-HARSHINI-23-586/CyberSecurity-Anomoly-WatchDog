import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import RuleIcon from '@mui/icons-material/Rule';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/visualizations">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Visualizations" />
      </ListItem>
      <ListItem button component={Link} to="/logs">
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Log Viewer" />
      </ListItem>
      <ListItem button component={Link} to="/rules">
        <ListItemIcon>
          <RuleIcon />
        </ListItemIcon>
        <ListItemText primary="Rule Management" />
      </ListItem>
      <ListItem button component={Link} to="/notifications">
        <ListItemIcon>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText primary="Notification Management" />
      </ListItem>
    </List>
  );
};

export default Sidebar;