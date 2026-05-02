function Pagination({
    currentPage,
    totalPages,
    onPageChange, limit, setLimit,total
}) {
    //const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startItem =total === 0 ? 0 : (currentPage - 1) * limit + 1;

    const endItem = Math.min(currentPage * limit, total);

    return (
        <div className="pagination-bar">

            <div className="pagination-info">
                Showing {startItem}–{endItem} of {total} results
            </div>

            <div className="pagination-controls">

                <div className="rows-per-page">
                    Rows per page:
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            onPageChange(1); // reset page
                        }}
                    >
                        <option value={7}>7</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                <div className="page-info">
                    Page {currentPage} of {totalPages || 1}
                </div>

                <div className="page-buttons">
                    <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" /></svg>
                    </button>

                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
                    </button>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pagination;