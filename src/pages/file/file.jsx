import { useState } from 'react';
import axios from 'axios';

function Appp() {
  const API_URL = "https://expense-backend-porh.onrender.com"
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [invalidData, setInvalidData] = useState([]);
  const [summary, setSummary] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    // preview only if image
    if (selectedFile.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first");
      return;
    }

    setShowForm(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );

      setInvalidData(res.data.errors || []);
      setSummary({
        total: res.data.totalRecords,
        valid: res.data.validRecords,
        invalid: res.data.invalidRecords
      });

      alert(res.data.message);

      setShowForm(false);
      setFile(null);
      setPreview("");

    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
    setCurrentPage(1);
  };

  function renderPaginationControls() {
    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    );
  }

  // PAGINATION LOGIC
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = invalidData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(invalidData.length / itemsPerPage);


  return (
    <div className="expense-page">
      <h2 className="expense-title">Upload File</h2>

      <div className="filters">
        <button onClick={() => setShowForm(true)} className="add-btn">
          Upload File
        </button>
        {summary && (
          <div className="upload-summary">
            Total: {summary.total} | Valid: {summary.valid} | Invalid: {summary.invalid}
          </div>
        )}
      </div>


      <div className="expense-table-container">
        <table>
          <thead>
            <tr>
              <th>Row</th>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Errors</th>

            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="invalid-row">
                  <td>{item.row}</td>
                  <td>{item.data?.Date}</td>
                  <td>{item.data?.Type}</td>
                  <td>{item.data?.Category}</td>
                  <td>{item.data?.Amount}</td>

                  <td>
                    {item.errors.map((err, i) => (
                      <div key={i} className="error-text">
                        {err}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No invalid records
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {renderPaginationControls()}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Upload File</h3>

            <form onSubmit={handleUpload} className="expense-form">


              <div
                className={`drop-zone ${dragActive ? "active" : ""}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p>Drag & Drop file here</p>
                <p>or</p>

                <input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e);
                    e.target.value = null; // 👈 important
                  }}
                  id="fileInput"
                  hidden
                />
                <label htmlFor="fileInput" className="browse-btn">
                  Browse File
                </label>

                {file && (
                  <div className="file-item">
                    <span className="file-text">{file.name}</span>

                    <button
                      type="button"
                      className="file-remove"
                      onClick={handleRemoveFile}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* IMAGE PREVIEW */}
              {preview && (
                <div style={{ marginTop: "10px" }}>
                  <img src={preview} alt="preview" width="200" />
                </div>
              )}

              <br /><br />

              <div className="modal-buttons" style={{ justifyContent: "space-between" }}>
                <a href="/documents/expensetemplate.xlsx" download>
                  <button type="button">Download template</button>
                </a>
                <button type="submit">Upload</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appp;