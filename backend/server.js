const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(cors());
app.use(express.json()); // Middleware untuk parsing JSON

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'penjualan'
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Penjualan',
      version: '1.0.0',
      description: 'API untuk mengelola penjualan produk',
    },
  },
  apis: ['./server.js'], // Menunjukkan lokasi file dengan anotasi Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CREATE: Menambahkan data penjualan
/**
 * @swagger
 * /api/penjualan:
 *   post:
 *     summary: Menambahkan data penjualan baru
 *     description: Menambahkan data penjualan dengan produk dan transaksi terkait
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_barang:
 *                 type: string
 *               stok:
 *                 type: integer
 *               jumlah_terjual:
 *                 type: integer
 *               tanggal_transaksi:
 *                 type: string
 *               jenis_barang:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data penjualan berhasil ditambahkan
 *       500:
 *         description: Terjadi kesalahan server
 */
app.post('/api/penjualan', (req, res) => {
    const { nama_barang, stok, jumlah_terjual, tanggal_transaksi, jenis_barang } = req.body;
  
    // 1. Insert data ke tabel produk jika belum ada
    db.query('SELECT * FROM produk WHERE nama_barang = ? AND jenis_barang = ?', [nama_barang, jenis_barang], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      let produk_id;
      if (results.length === 0) {
        // Insert produk baru jika belum ada
        db.query('INSERT INTO produk (nama_barang, jenis_barang) VALUES (?, ?)', [nama_barang, jenis_barang], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          produk_id = results.insertId;
          
          // 2. Insert data ke tabel transaksi jika belum ada
          db.query('SELECT * FROM transaksi WHERE tanggal_transaksi = ?', [tanggal_transaksi], (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            
            let transaksi_id;
            if (results.length === 0) {
              // Insert transaksi baru jika belum ada
              db.query('INSERT INTO transaksi (tanggal_transaksi) VALUES (?)', [tanggal_transaksi], (err, results) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
                transaksi_id = results.insertId;
  
                // 3. Insert data penjualan setelah transaksi dan produk dibuat
                const query = 'INSERT INTO penjualan (produk_id, transaksi_id, stok, jumlah_terjual) VALUES (?, ?, ?, ?)';
                db.query(query, [produk_id, transaksi_id, stok, jumlah_terjual], (err, results) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  res.status(201).json({ message: 'Data berhasil ditambahkan', id: results.insertId });
                });
              });
            } else {
              transaksi_id = results[0].id;
  
              // 3. Insert data penjualan setelah transaksi ditemukan
              const query = 'INSERT INTO penjualan (produk_id, transaksi_id, stok, jumlah_terjual) VALUES (?, ?, ?, ?)';
              db.query(query, [produk_id, transaksi_id, stok, jumlah_terjual], (err, results) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Data berhasil ditambahkan', id: results.insertId });
              });
            }
          });
        });
      } else {
        produk_id = results[0].id;
  
        // 2. Insert data ke tabel transaksi jika belum ada
        db.query('SELECT * FROM transaksi WHERE tanggal_transaksi = ?', [tanggal_transaksi], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          let transaksi_id;
          if (results.length === 0) {
            // Insert transaksi baru jika belum ada
            db.query('INSERT INTO transaksi (tanggal_transaksi) VALUES (?)', [tanggal_transaksi], (err, results) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              transaksi_id = results.insertId;
  
              // 3. Insert data penjualan setelah transaksi dan produk ditemukan
              const query = 'INSERT INTO penjualan (produk_id, transaksi_id, stok, jumlah_terjual) VALUES (?, ?, ?, ?)';
              db.query(query, [produk_id, transaksi_id, stok, jumlah_terjual], (err, results) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Data berhasil ditambahkan', id: results.insertId });
              });
            });
          } else {
            transaksi_id = results[0].id;
  
            // 3. Insert data penjualan setelah transaksi ditemukan
            const query = 'INSERT INTO penjualan (produk_id, transaksi_id, stok, jumlah_terjual) VALUES (?, ?, ?, ?)';
            db.query(query, [produk_id, transaksi_id, stok, jumlah_terjual], (err, results) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.status(201).json({ message: 'Data berhasil ditambahkan', id: results.insertId });
            });
          }
        });
      }
    });
  });
  
  // READ: Mengambil semua data penjualan beserta produk dan transaksi
  /**
   * @swagger
   * /api/penjualan:
   *   get:
   *     summary: Mengambil semua data penjualan
   *     description: Mengambil data penjualan berdasarkan pencarian dan pengurutan
   *     parameters:
   *       - in: query
   *         name: search
   *         required: false
   *         description: Pencarian nama barang atau tanggal transaksi
   *         schema:
   *           type: string
   *       - in: query
   *         name: sortBy
   *         required: false
   *         description: Kolom yang digunakan untuk pengurutan (default: nama_barang)
   *         schema:
   *           type: string
   *       - in: query
   *         name: sortOrder
   *         required: false
   *         description: Urutan pengurutan (ASC atau DESC)
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Daftar penjualan
   *       500:
   *         description: Terjadi kesalahan server
   */
  app.get('/api/penjualan', (req, res) => {
    const { search = '', sortBy = 'nama_barang', sortOrder = 'ASC' } = req.query;
  
    // Membangun query berdasarkan parameter pencarian dan pengurutan
    let query = `
      SELECT 
        p.id, 
        pr.nama_barang, 
        pr.jenis_barang, 
        t.tanggal_transaksi, 
        p.stok, 
        p.jumlah_terjual
      FROM penjualan p
      JOIN produk pr ON p.produk_id = pr.id
      JOIN transaksi t ON p.transaksi_id = t.id
      WHERE pr.nama_barang LIKE ? OR t.tanggal_transaksi LIKE ?
      ORDER BY ${sortBy} ${sortOrder}
    `;
    
    // Menggunakan parameter untuk pencarian yang dinamis
    const searchTerm = `%${search}%`;
    db.query(query, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

// UPDATE: Mengubah data penjualan berdasarkan ID
app.put('/api/penjualan/:id', (req, res) => {
  const { id } = req.params;
  const { stok, jumlah_terjual } = req.body;
  
  const query = 'UPDATE penjualan SET stok = ?, jumlah_terjual = ? WHERE id = ?';
  db.query(query, [stok, jumlah_terjual, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Data berhasil diperbarui' });
  });
});

// DELETE: Menghapus data penjualan berdasarkan ID
app.delete('/api/penjualan/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM penjualan WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Data berhasil dihapus' });
  });
});

// Endpoint untuk mendapatkan transaksi terbanyak terjual per jenis barang
app.get('/api/penjualan/terbanyak', (req, res) => {
  const query = `
    SELECT 
      pr.jenis_barang, 
      pr.nama_barang, 
      SUM(p.jumlah_terjual) AS total_terjual
    FROM penjualan p
    JOIN produk pr ON p.produk_id = pr.id
    GROUP BY pr.jenis_barang, pr.nama_barang
    ORDER BY total_terjual DESC
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan transaksi terendah per jenis barang
app.get('/api/penjualan/terendah', (req, res) => {
  const query = `
    SELECT 
      pr.jenis_barang, 
      pr.nama_barang, 
      SUM(p.jumlah_terjual) AS total_terjual
    FROM penjualan p
    JOIN produk pr ON p.produk_id = pr.id
    GROUP BY pr.jenis_barang, pr.nama_barang
    ORDER BY total_terjual ASC
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint untuk membandingkan jenis barang berdasarkan transaksi terbanyak atau terendah
app.get('/api/penjualan/comparison', (req, res) => {
  const { startDate, endDate, comparisonType } = req.query;

  try {
    // Filter berdasarkan rentang waktu
    const whereCondition = [];
    let query = `
      SELECT 
        pr.jenis_barang, 
        pr.nama_barang, 
        SUM(p.jumlah_terjual) AS total_terjual
      FROM penjualan p
      JOIN produk pr ON p.produk_id = pr.id
      JOIN transaksi t ON p.transaksi_id = t.id
    `;

    if (startDate && endDate) {
      whereCondition.push(startDate, endDate);
      query += ' WHERE t.tanggal_transaksi BETWEEN ? AND ?';
    }

    query += ` GROUP BY pr.jenis_barang, pr.nama_barang
               ORDER BY total_terjual ${comparisonType === 'highest' ? 'DESC' : 'ASC'}`;

    db.query(query, whereCondition, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Jalankan server di port 5000
app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});
