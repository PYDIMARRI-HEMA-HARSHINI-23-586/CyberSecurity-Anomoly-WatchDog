import React from 'react';
import AnomalyRuleCard from '../components/AnomalyRuleCard';

const rules = [
    { title: 'Rule 1: Failed Logins', endpoint: '/api/rule1' },
    { title: 'Rule 2: Logins from Blacklisted Locations', endpoint: '/api/rule2' },
    { title: 'Rule 3: Multiple Failed Logins', endpoint: '/api/rule3' },
    { title: 'Rule 4: Logins Outside Business Hours', endpoint: '/api/rule4' },
    { title: 'Rule 5: Multiple Failed Logins in 5-min Window', endpoint: '/api/rule5' },
    { title: 'Rule: Failed then Successful Login', endpoint: '/api/fail_success' },
    { title: 'Rule 6: Geographically Impossible Logins', endpoint: '/api/rule6' },
];

const Dashboard = () => {
  return (
    <>
      {rules.map(rule => (
          <AnomalyRuleCard key={rule.title} title={rule.title} endpoint={rule.endpoint} />
      ))}
    </>
  );
};

export default Dashboard;