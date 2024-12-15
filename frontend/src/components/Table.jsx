import React, { useState } from 'react';

const Table = ({ data, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 items per page

  // Menghitung total halaman
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Menentukan data yang ditampilkan pada halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk navigasi ke halaman berikutnya
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk navigasi ke halaman sebelumnya
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk navigasi ke halaman tertentu
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fungsi untuk mengubah jumlah data per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset ke halaman pertama saat jumlah item per halaman berubah
  };

  // Fungsi untuk format tanggal ke format yang lebih user-friendly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Nama Barang</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Stok</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Jumlah Terjual</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Tanggal Transaksi</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Jenis Barang</th>
            <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {currentData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-3 px-6">{item.nama_barang}</td>
              <td className="py-3 px-6">{item.stok}</td>
              <td className="py-3 px-6">{item.jumlah_terjual}</td>
              <td className="py-3 px-6">{formatDate(item.tanggal_transaksi)}</td> {/* Format tanggal */}
              <td className="py-3 px-6">{item.jenis_barang}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => onEdit(item)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition-colors duration-300 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pilihan jumlah item per halaman */}
      <div className="flex justify-between items-center mt-6 py-3 px-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="py-1 px-3 border rounded-lg bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Tombol Pagination */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevPage}
            className="bg-blue-600 text-white py-1 px-4 rounded-lg disabled:bg-gray-400"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {/* Tombol untuk halaman spesifik */}
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`py-1 px-3 rounded-lg text-sm ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className="bg-blue-600 text-white py-1 px-4 rounded-lg disabled:bg-gray-400"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
