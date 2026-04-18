function Bills() {

  const bills = [
    {
      name: "Spotify",
      date: "May 10",
      amount: 9.99
    },
    {
      name: "Netflix",
      date: "May 15",
      amount: 14.99
    },
    {
      name: "Electricity",
      date: "May 20",
      amount: 65
    },
    {
      name: "Internet",
      date: "May 25",
      amount: 30
    },
    {
      name: "Water",
      date: "May 15",
      amount: 250
    },
    {
      name: "WiFi",
      date: "May 29",
      amount: 200
    }
  ];

  return (
    <div className="bills">

      <h3>Upcoming Bills</h3>

      {bills.map((bill, index) => (
        <div key={index} className="bill-item">

          <div className="bill-left">
            <div className="bill-icon">📄</div>

            <div>
              <h4>{bill.name}</h4>
              <p>Due {bill.date}</p>
            </div>
          </div>

          <div className="bill-right">
            {bill.amount}
          </div>

        </div>
      ))}

      {/*<button className="view-btn">View All</button>*/}

    </div>
  );
}

export default Bills;