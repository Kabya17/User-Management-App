import React from 'react';
import UserTable from './UserTable';
const AdminPanel = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>
      <UserTable />
    </div>
  );
};

export default AdminPanel;
  