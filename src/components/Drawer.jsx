function FilterDrawer({
  drawerOpen,
  setDrawerOpen,

  tempType,
  setTempType,
  tempCategory,
  setTempCategory,
  tempMonth,
  setTempMonth,
  tempSearch,
  setTempSearch,
  categories,
  onApply,
  onReset
}) {
  return (
    <>
      <div
        className={`overlay ${drawerOpen ? "show" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      <div className={`drawer ${drawerOpen ? "open" : ""}`}>

        <div className="drawer-header">
          <h3>Filters</h3>
          <button onClick={() => setDrawerOpen(false)}>✖</button>
        </div>

        <div className="drawer-content">

          <select value={tempType} onChange={(e) => setTempType(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={tempCategory} onChange={(e) => setTempCategory(e.target.value)}>
            <option value="">All Categories</option>

            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}

          </select>

          <select value={tempMonth} onChange={(e) => setTempMonth(e.target.value)}>
            <option value="">All Months</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
          />

          <button className="apply-btn" onClick={onApply}>
            Apply Filters
          </button>

          <button className="reset-btn" onClick={onReset}>
            Reset Filters
          </button>

        </div>
      </div>
    </>
  );
}

export default FilterDrawer;