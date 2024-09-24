import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { fetchUsers, blockUser, unblockUser, deleteUser } from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUnlock } from '@fortawesome/free-solid-svg-icons';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate(); 
  const currentUserId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetchUsers(token);
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
          alert('Error fetching users: ' + (error.response?.data?.error || 'Unknown error'));
        }
      } else {
        alert('No token found. Please log in.');
      }
    };

    fetchData();
  }, []);

  const handleBlock = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        await blockUser(userId, token);
        alert('User blocked');
        setUsers(users.map(user => user.id === userId ? { ...user, status: 'blocked' } : user));
        if (userId.toString() === currentUserId) { 
            console.log('Condition met: User is blocking themselves.');
            alert('You have blocked yourself. You will be logged out.');
            localStorage.removeItem('token'); 
            localStorage.removeItem('userId'); 
            navigate('/login');
        } else {
            console.log('Condition not met: User is not blocking themselves.');
        }
    } catch (error) {
        console.error('Error blocking user:', error);
    }
};


  const handleUnblock = (userId) => {
    const token = localStorage.getItem('token');
    unblockUser(userId, token)
      .then(() => {
        alert('User unblocked');
        setUsers(users.map(user => user.id === userId ? { ...user, status: 'active' } : user));
      })
      .catch(console.error);
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      if (userId.toString() === currentUserId) {
        await deleteUser(userId, token); 
        alert('Your account has been deleted. You will be logged out.');
        localStorage.removeItem('token'); 
        localStorage.removeItem('userId'); 
        navigate('/login'); 
      } else {
        await deleteUser(userId, token); 
        alert('User deleted');
        setUsers(users.filter(user => user.id !== userId)); 
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleBlockSelected = () => {
    selectedUsers.forEach((userId) => {
      handleBlock(userId); 
    });
    if (selectedUsers.includes(currentUserId)) {
      alert('You have blocked yourself. You will be logged out.');
      localStorage.removeItem('token'); 
      localStorage.removeItem('userId'); 
      navigate('/login'); 
    }
  };

  const handleUnblockSelected = () => {
    selectedUsers.forEach((userId) => handleUnblock(userId));
  };

  const handleDeleteSelected = async () => {
    const isSelfDeletion = selectedUsers.includes(currentUserId);
    for (const userId of selectedUsers) {
      await handleDelete(userId); 
    }
    if (isSelfDeletion) {
      alert('Your account has been deleted. You will be logged out.');
      localStorage.removeItem('token'); 
      localStorage.removeItem('userId'); 
      navigate('/login'); 
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">User Management</h2>
      <div className="mb-3 text-center">
        <button className="btn btn-danger mx-2" onClick={handleBlockSelected}>Block</button>
        <span 
          className="mx-2" 
          onClick={handleUnblockSelected} 
          style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faUnlock} title="Unblock Selected Users" className="text-secondary" />
        </span>
        <span 
          className="mx-2" 
          onClick={handleDeleteSelected} 
          style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faTrashAlt} title="Delete Selected Users" className="text-danger" />
        </span>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                  />
                </div>
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Last Login Time</th>
              <th>Registration Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </div>
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.updated_at)}</td>
                <td>{formatDate(user.created_at)}</td>
                <td>{user.status}</td>
                <td>
                  <button className="btn btn-danger btn-sm mx-1" onClick={() => handleBlock(user.id)}>Block</button>
                  <span 
                    className="mx-1" 
                    onClick={() => handleUnblock(user.id)} 
                    style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faUnlock} title="Unblock User" />
                  </span>
                  <span 
                    className="mx-1" 
                    onClick={() => handleDelete(user.id)} 
                    style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTrashAlt} title="Delete User" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
