import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';

const AddEditForm = ({ onSave, dataToEdit, closeModal }) => {
  const [formData, setFormData] = useState({
    nama_barang: '',
    stok: '',
    jumlah_terjual: '',
    tanggal_transaksi: '',
    jenis_barang: '',
  });

  // Mengisi data form jika sedang dalam mode edit
  useEffect(() => {
    if (dataToEdit) {
      setFormData({
        ...dataToEdit,
        tanggal_transaksi: dataToEdit.tanggal_transaksi
          ? new Date(dataToEdit.tanggal_transaksi).toISOString().split('T')[0]
          : '',
      });
    }
  }, [dataToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
    if (
      !formData.nama_barang ||
      !formData.stok ||
      !formData.jumlah_terjual ||
      !formData.tanggal_transaksi ||
      !formData.jenis_barang
    ) {
      alert('Semua field wajib diisi!');
      return;
    }

    // Siapkan data untuk dikirim
    const formattedData = {
      ...formData,
      tanggal_transaksi: formData.tanggal_transaksi
        ? new Date(formData.tanggal_transaksi).toISOString()
        : '',
      updated_at: new Date().toISOString(),
    };

    onSave(formattedData); // Kirim data ke parent
    closeModal(); // Tutup modal setelah submit
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-xl w-96 animate__animated animate__fadeIn">
        <h2 className="text-2xl font-semibold mb-4">
          {dataToEdit ? 'Edit' : 'Tambah'} Data Penjualan
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Barang */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="nama_barang" className="text-sm font-medium">
              Nama Barang
            </label>
            <input
              type="text"
              id="nama_barang"
              name="nama_barang"
              value={formData.nama_barang}
              onChange={handleChange}
              placeholder="Masukkan nama barang"
              className="bg-white border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          {/* Stok */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="stok" className="text-sm font-medium">
              Stok
            </label>
            <input
              type="number"
              id="stok"
              name="stok"
              value={formData.stok}
              onChange={handleChange}
              placeholder="Masukkan stok"
              className="bg-white border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          {/* Jumlah Terjual */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="jumlah_terjual" className="text-sm font-medium">
              Jumlah Terjual
            </label>
            <input
              type="number"
              id="jumlah_terjual"
              name="jumlah_terjual"
              value={formData.jumlah_terjual}
              onChange={handleChange}
              placeholder="Masukkan jumlah terjual"
              className="bg-white border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          {/* Tanggal Transaksi */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="tanggal_transaksi" className="text-sm font-medium">
              Tanggal Transaksi
            </label>
            <div className="relative">
              <input
                type="date"
                id="tanggal_transaksi"
                name="tanggal_transaksi"
                value={formData.tanggal_transaksi}
                onChange={handleChange}
                className="bg-white border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-white"
                onClick={() => {
                  document.querySelector(`input[name="tanggal_transaksi"]`).showPicker();
                }}
              >
                <i className="bx bx-calendar"></i>
              </button>
            </div>
          </div>

          {/* Jenis Barang */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="jenis_barang" className="text-sm font-medium">
              Jenis Barang
            </label>
            <select
              id="jenis_barang"
              name="jenis_barang"
              value={formData.jenis_barang}
              onChange={handleChange}
              className="bg-white border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="" disabled>
                Pilih Jenis Barang
              </option>
              <option value="Konsumsi">Konsumsi</option>
              <option value="Pembersih">Pembersih</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              {dataToEdit ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditForm;
