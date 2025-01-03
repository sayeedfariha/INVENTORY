const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

// wkhtmltopdf.command = "C:\\Users\\user\\Desktop\\Ecommerce\\node_modules\\wkhtmltopdf\\index.js";
const formatString = (str) => {
  const words = str?.split('_');

  const formattedWords = words?.map((word) => {
    const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalizedWord;
  });

  return formattedWords?.join(' ');
};


const modelModel = {
  // model_create: async (req, res) => {

  //   try {
  //     const { model_name, brand_id, status_id, file_path, description, created_by } = req.body;



  //     if (!model_name || !brand_id  || !status_id) {
  //       return res.status(400).json({ message: 'Model name name is required' });
  //     }

  //     // Check if the model name already exists
  //     const selectQuery = 'SELECT * FROM model WHERE model_name = ?';
  //     connection.query(selectQuery, [model_name], (error, results) => {
  //       if (error) {
  //         console.log(error);
  //         return res.status(500).json({ message: 'Internal Server Error' });
  //       }

  //       if (results.length > 0) {
  //         // Model name already exists
  //         console.log('Model already exists');
  //         return res.status(400).json({ message: 'Model already exists' });
  //       }

  //       // If model name doesn't exist, insert it
  //       const insertQuery = 'INSERT INTO model (model_name, brand_id, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?, ?)';
  //       connection.query(
  //         insertQuery,
  //         [model_name, brand_id, status_id, file_path, description, created_by],
  //         (error, result) => {
  //           if (error) {
  //             console.log(error);
  //             return res.status(500).json({ message: 'Internal Server Error' });
  //           }
  //           console.log(result);
  //           return res.send(result);
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }

  // },

  model_create: async (req, res) => {
    try {
      const models = req.body;
      const results = [];

      for (const model of models) {
        const { model_name, brand_id, status_id, file_path, description, created_by } = model;

        if (!model_name || !status_id || !brand_id) {
          return res.status(400).json({ message: 'model name and status ID are required' });
        }

        const processedmodelName = model_name.replace(/\s+/g, ' ').trim();

        const selectQuery = 'SELECT * FROM model WHERE TRIM(model_name) = ?';
        const existingmodels = await new Promise((resolve, reject) => {
          connection.query(selectQuery, [processedmodelName, brand_id], (error, results) => {
            if (error) {
              console.log(error);
              reject(error);
            }
            resolve(results);
          });
        });

        if (existingmodels.length === 0) {
          const insertQuery = 'INSERT INTO model (model_name, brand_id, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?, ?)';
          const insertedmodel = await new Promise((resolve, reject) => {
            connection.query(insertQuery, [processedmodelName, brand_id, status_id, file_path, description, created_by], (error, result) => {
              if (error) {
                console.log(error);
                reject(error);
              }
              resolve(result);
            });
          });

          console.log(insertedmodel);
          results.push(insertedmodel);
        } else {
          console.log(`model '${processedmodelName}' already exists, skipping insertion.`);
        }
      }

      res.send(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  model_copy: async (req, res) => {
    try {

      const { model_name, brand_id, status_id, file_path, description, created_by } = req.body;

      if (!model_name || !status_id || !brand_id) {
        return res.status(400).json({ message: 'model name is required' });
      }

      // Remove extra spaces from model_name
      const processedmodelName = model_name.replace(/\s+/g, ' ').trim();

      // Check if the model already exists
      const selectQuery = 'SELECT * FROM model WHERE TRIM(model_name) = ?';
      connection.query(selectQuery, [processedmodelName, brand_id], (error, results) => {
        if (error) {
          console.log(error, 'Internal Server Error');
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length > 0) {
          // model with a similar name already exists
          console.log('model already exists');
          return res.status(400).json({ message: 'model already exists' });
        }

        // If model doesn't exist, insert it
        const insertQuery = 'INSERT INTO model (model_name, brand_id, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(
          insertQuery,
          [processedmodelName, brand_id, status_id, file_path, description, created_by],
          (error, result) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log(result);
            return res.send(result);
          }
        );
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  model_list: async (req, res) => {
    try {
      const data = "select * from  model";

      connection.query(data, function (error, result) {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

  model_update: async (req, res) => {
    try {

      const { brand_id, model_name, status_id, file_path, description, modified_by } = req.body;

      const query = `UPDATE model SET brand_id = ?, model_name = ?, status_id = ?, file_path = ?, description = ?, modified_by = ? WHERE id = ?`;
      connection.query(query, [brand_id, model_name, status_id, file_path, description, modified_by, req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  model_single: async (req, res) => {
    try {
      const query = 'SELECT * FROM model WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  model_delete: async (req, res) => {

    try {
      const query = 'DELETE FROM model WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  model_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
          SELECT model.*, 
                 brand.brand_name AS brand_id,
                 users_created.full_name AS created_by,
                 users_modified.full_name AS modified_by 
          FROM model 
          LEFT JOIN users AS users_created ON model.created_by = users_created.id 
          LEFT JOIN users AS users_modified ON model.modified_by = users_modified.id 
          LEFT JOIN brand ON model.brand_id = brand.id
          ORDER BY model.id DESC
          LIMIT ?, ?
        `;


      connection.query(query, [skipRows, perPage], (error, result) => {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

  model_search: async (req, res) => {
    try {
      console.log("Search button clicked.");

      // Extract necessary data from request
      let { searchQuery, statusFilter, selectedOrder, fromDate, toDate, multiSearch } = req.body;

      // Construct the base SQL query
      let sql = `
      SELECT model.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM model 
      LEFT JOIN users AS users_created ON model.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON model.modified_by = users_modified.id 
      WHERE 1 `;
      //order  by variable
      //order  by model_name asc, status_id desc,created_date desc
      // Add search query condition
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        sql += ` AND LOWER(model_name) LIKE '%${query}%' `;
      }

      // Add status filter condition
      if (statusFilter !== '') {
        sql += ` AND status_id = ${statusFilter} `;
      }

      // Add date range condition
      if (fromDate && toDate) {
        // Reverse fromDate and toDate if fromDate is greater than toDate
        if (fromDate > toDate) {
          const temp = fromDate;
          fromDate = toDate;
          toDate = temp;
        }

        sql += ` AND model.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
      } else if (fromDate && !toDate) {
        sql += ` AND model.created_date >= '${fromDate}' `;
      } else if (!fromDate && toDate) {
        sql += ` AND model.created_date <= '${toDate}' `;
      }

      if (multiSearch && multiSearch.length > 0) {
        sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
      }

      console.log("SQL Query:", sql);



      // Execute the constructed SQL query
      connection.query(sql, (error, results, fields) => {
        if (error) {
          console.error("Error occurred during search:", error);
          res.status(500).json({ error: "An error occurred during search." });
        } else {
          console.log("Search results:", results, sql);
          res.status(200).json({ results });
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "An error occurred." });
    }
  },
  

  model_pdf: async (req, res) => {
    try {
      const { searchResults, selectedColumns } = req.body; // Assuming selectedColumns is an array of column names

      console.log(searchResults, 'here all the searchResults');
      const statusLabels = {
        1: 'Active',
        2: 'Inactive',
        3: 'Pending'
      };

      const longTextColumns = ['model_name', 'description'];
      let tableRows = '';
      searchResults?.forEach((result, index) => {
        let row = '<tr>';
        selectedColumns.forEach(column => {
          if (column === 'serial') {
            row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
          } else if (column === 'action') {
            // Skip this column
          }
          else if (column === 'status_id') {
            const statusLabel = statusLabels[result[column]] || '';
            // Get corresponding label from statusLabels object
            row += `<td>${statusLabel}</td>`;
          }
          // else if (column === 'file_path') {
          //   // Encode the image URL
          //   const encodedURL = encodeURIComponent(result[column]);
          //   console.log(`${process.env.NEXT_PUBLIC_API_URL}:5003/${result[column]}`, 'encodedURL welcome');
          //   // const encodedURL = encode(result[column]);
          //   row += `<td><img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
          // }
          else if (column === 'file_path') {
            if (result[column]) {
              // Encode the image URL
              const encodedURL = encodeURIComponent(result[column]);
              console.log(`http://192.168.0.194:5003/${result[column]}`, 'encodedURL welcome');
              // const encodedURL = encode(result[column]);
              row += `<td><img src="http://192.168.0.194:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
            } else {
              // No file path provided, show a placeholder message
              row += `<td></td>`;
            }
          }
          else {
            const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
            row += `<td style="${style}">${result[column]}</td>`;
            // row += `<td>${result[column]}</td>`; // Displaying regular columns
          }
        });
        row += '</tr>';
        tableRows += row;
      });
      // <link href='http://sonnetdp.github.io/nikosh/css/nikosh.css' rel='stylesheet' type='text/css'>
      // <link href='./nikosh.css' rel='stylesheet' type='text/css'>
      //  ${process.env.NEXT_PUBLIC_API_URL}:5004/get-css/nikosh.css
      // @import url("nikosh.css");

      const html = `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          
          <style>
       
        
          * { 
            sheet-size: A4;font-family: 'Nikosh', sans-serif !important;
          }
  
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  padding: 8px;
                  text-align: left;
                  border: 1px solid #ddd;
              }
              th {
                  background-color: #f2f2f2;
              }
              img {
                  max-width: 100px;
                  max-height: 100px;
              }
              .container {
                text-align: center;
            }
            .container2 {
              display: flex;
              justify-content: space-between;
          }
          </style>
      </head>
      <body>
     <div class='container'>
     <h2 style="margin: 0; padding: 0;">Inventory Software</h2>
     <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
     <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
     <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
     <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">model List</h3>
     </div>
     <div class="container2" style:"display: flex;
     justify-content: space-between;">
     <p style="margin: 0; padding: 0;">Receipt No: 829</p>
     <p style="margin: 0; padding: 0;">Collected By:</p>
     <p style="margin: 0; padding: 0;">Date: </p>
    </div>
          <table>
              <thead>
                  <tr>
                      ${selectedColumns.filter(column => column !== 'action').map(column => {
        if (column === 'status_id') {
          return `<th>Status</th>`;
        }
        else if (column === 'file_path') {
          return `<th>File</th>`;
        }
        else {
          return `<th>${formatString(column)}</th>`;
        }
      }).join('')}
                  </tr>
              </thead>
              <tbody >
                  ${tableRows}
              </tbody>
          </table>
      </body>
      </html>`;

      wkhtmltopdf(html, { pageSize: 'letter' }, (err, stream) => {
        if (err) {
          console.error('Error generating PDF:', err);
          res.status(500).send('Error generating PDF');
          return;
        }
        stream.pipe(res);
      });
    } catch (error) {
      console.error('Error in model_pdf:', error);
      res.status(500).send('Error generating PDF');
    }
  }

}
module.exports = modelModel