import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import AddEditForm from '../components/AddEditForm';
import 'boxicons/css/boxicons.min.css';

const Home = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nama_barang');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [comparisonType, setComparisonType] = useState('highest'); // 'highest' or 'lowest'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data for the comparison and search results
  const fetchPenjualanData = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:5000/api/penjualan', {
        params: {
          search,
          sortBy,
          sortOrder,
          startDate,
          endDate,
          comparisonType
        }
      });
      setPenjualan(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenjualanData();
  }, [search, sortBy, sortOrder, startDate, endDate, comparisonType]);

  const handleSave = (data) => {
    if (editing) {
      // Update data if currently editing
      axios.put(`http://localhost:5000/api/penjualan/${editing.id}`, data)
        .then(() => {
          setPenjualan(prev => prev.map(item => (item.id === editing.id ? data : item)));
          setEditing(null);  // Reset editing state
        })
        .catch(error => console.error('Error updating data:', error));
    } else {
      // Add new data
      axios.post('http://localhost:5000/api/penjualan', data)
        .then(response => {
          setPenjualan([...penjualan, { ...data, id: response.data.id }]);
        })
        .catch(error => console.error('Error adding data:', error));
    }
  };

  const handleDelete = (id) => {
    // Delete data by ID
    axios.delete(`http://localhost:5000/api/penjualan/${id}`)
      .then(() => {
        setPenjualan(prev => prev.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting data:', error));
  };

  const handleEdit = (data) => {
    // Prepare data for editing
    setEditing(data);
    setIsModalOpen(true);  // Open modal for editing
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);  // Reset editing
  };

  return (
    <div className="min-h-screen text-gray-900 font-ubuntu">
      <div className="container mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold">CRUD Penjualan</h1>
        </header>

        {/* Button to add new data */}
        <div className="text-right mb-4">
          <button
            onClick={() => {
              setEditing(null);  // Reset editing state
              setIsModalOpen(true);  // Open modal for adding new data
            }}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Add New Data
          </button>
        </div>

        {/* Filter Section (Search, Sorting, and Comparison) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Search Section */}
          <div className="flex flex-col">
            <label htmlFor="search" className="text-sm font-semibold mb-2">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Nama Barang or Tanggal"
              value={search}
              onChange={(e) => setSearch(e.target.value)}  // Update search state
              className="bg-white py-2 px-4 border focus:ring-2 focus:ring-blue-500 text-black rounded-lg"
            />
          </div>

          {/* Sorting Section */}
          <div className="flex flex-col">
            <label htmlFor="sortBy" className="text-sm font-semibold mb-2">Sort by</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}  // Update sortBy state
              className="bg-white py-2 px-4 border rounded-lg"
            >
              <option value="nama_barang">Nama Barang</option>
              <option value="tanggal_transaksi">Tanggal Transaksi</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="sortOrder" className="text-sm font-semibold mb-2">Order</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}  // Update sortOrder state
              className="bg-white py-2 px-4 border rounded-lg"
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>

        {/* Date Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-semibold mb-2">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}  // Update start date
              className="bg-white py-2 px-4 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-semibold mb-2">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}  // Update end date
              className="bg-white py-2 px-4 border rounded-lg"
            />
          </div>
        </div>

        {/* Comparison Section */}
        <div className="flex flex-col mb-6">
          <label htmlFor="comparisonType" className="text-sm font-semibold mb-2">Comparison Type</label>
          <select
            id="comparisonType"
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}  // Update comparisonType state
            className="bg-white py-2 px-4 border rounded-lg"
          >
            <option value="highest">Terbanyak Terjual</option>
            <option value="lowest">Terkecil Terjual</option>
          </select>
        </div>

        {/* Table to display penjualan data */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table data={penjualan} onDelete={handleDelete} onEdit={handleEdit} />
        )}

        {/* Modal for add/edit data */}
        {isModalOpen && (
          <AddEditForm
            onSave={handleSave}
            dataToEdit={editing}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
