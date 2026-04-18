import { useState } from "react";
import axios from "axios";

function UploadFeature() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [invalidData, setInvalidData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = invalidData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(invalidData.length / itemsPerPage);

  // FILE HANDLING
  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // UPLOAD
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/upload",
        formData,
        { withCredentials: true }
      );

      setInvalidData(res.data.errors || []);
      setSummary({
        total: res.data.totalRecords,
        valid: res.data.validRecords,
        invalid: res.data.invalidRecords
      });

      if (res.data.errors?.length > 0) {
        setShowModal(true);
      }

      alert(res.data.message);

      setOpen(false);
      setFile(null);
      setCurrentPage(1);

    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        className="add-btn"
        onClick={() => setOpen(true)}
      >
        Upload
      </button>

      {/* OVERLAY */}
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      ></div>

      {/* DRAWER (ALWAYS RENDERED) */}
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Upload File</h3>
          <button onClick={() => setOpen(false)}>✖</button>
        </div>

        <div className="drawer-content">
          <form onSubmit={handleUpload} className="expense-form upload-form">

            {/* DROP ZONE */}
            <div
              className={`drop-zone ${dragActive ? "active" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <p>Drag & Drop file here</p>
              <p>or</p>

              <input
                type="file"
                hidden
                id="fileInput"
                onChange={(e) => handleFile(e.target.files[0])}
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
                    onClick={() => setFile(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* DOWNLOAD */}
            <a href="/documents/expensetemplate.xlsx" download>
              <button type="button" className="apply-btn">
                Download Template
              </button>
            </a>

            {/* UPLOAD */}
            <button type="submit" className="apply-btn">
              Upload
            </button>

          </form>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlayy" onClick={() => setShowModal(false)}>
          <div
            className="modal-contentt"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "80%", maxWidth: "800px" }}
          >
            <h3>Upload Summary</h3>

            {summary && (
              <div className="upload-summary">
                Total: {summary.total} | Valid: {summary.valid} | Invalid: {summary.invalid}
              </div>
            )}

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
                    paginatedData.map((item, i) => (
                      <tr key={i}>
                        <td>{item.row}</td>
                        <td>{item.data?.Date}</td>
                        <td>{item.data?.Type}</td>
                        <td>{item.data?.Category}</td>
                        <td>{item.data?.Amount}</td>
                        <td>
                          {item.errors.map((err, idx) => (
                            <div key={idx} className="error-text">{err}</div>
                          ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No invalid records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
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
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>

            <button
              className="apply-btn"
              onClick={() => {
                setShowModal(false);
                setCurrentPage(1);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadFeature;