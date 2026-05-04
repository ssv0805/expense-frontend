const Bill = require("../models/bill");
const Transaction = require("../models/transaction");


// ✅ CREATE BILL
const createBill = async (req, res) => {
    try {
        let {
            name,
            amount,
            category,
            dueDate,
            frequency,
            paymentMethod
        } = req.body;

        const cleanName = name.trim().toLowerCase();
        const month = dueDate.slice(0, 7);

        // 🚨 prevent duplicate (same name + month)
        const existing = await Bill.findOne({
            name: cleanName,
            user: req.user.email,
            dueDate: { $regex: `^${month}` }
        });

        if (existing) {
            return res.status(400).json({
                message: "Bill already exists for this month"
            });
        }

        const newBill = await Bill.create({
            name: cleanName,
            amount,
            category,
            dueDate,
            frequency,
            paymentMethod,
            status: "unpaid",
            user: req.user.email
        });

        res.status(201).json(newBill);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ✅ GET BILLS (AUTO MONTH LOGIC + CLOSED SKIP)
const getBills = async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user.email });

        const currentMonth = new Date().toISOString().slice(0, 7);
        const today = new Date().getDate();

        // ✅ Only run generation on/after 1st
        if (today >= 1) {

            for (let bill of bills) {

                if (bill.frequency !== "Monthly") continue;
                if (bill.status === "closed") continue;

                const billMonth = bill.dueDate.slice(0, 7);

                // 🔥 If bill belongs to previous month → generate current month bill
                if (billMonth < currentMonth) {

                    const exists = await Bill.findOne({
                        name: bill.name,
                        user: bill.user,
                        dueDate: { $regex: `^${currentMonth}` }
                    });

                    if (!exists) {
                        const oldDate = new Date(bill.dueDate);
                        const newDate = new Date();

                        // keep same day (like 19th → 19th)
                        newDate.setDate(oldDate.getDate());

                        const finalDate = `${currentMonth}-${String(newDate.getDate()).padStart(2, "0")}`;

                        await Bill.create({
                            name: bill.name,
                            amount: bill.amount,
                            category: bill.category,
                            dueDate: finalDate,
                            frequency: "Monthly",
                            paymentMethod: bill.paymentMethod,
                            status: "unpaid",
                            user: bill.user
                        });
                    }
                }
            }
        }

        // ✅ return updated list
        const updatedBills = await Bill.find({ user: req.user.email })
            .sort({ dueDate: -1 });

        res.status(200).json(updatedBills);

    } catch (err) {
        console.log("GET BILLS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};



// ✅ PAY BILL (STRICT LOGIC)
const payBill = async (req, res) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        if (bill.status === "closed") {
            return res.status(400).json({
                message: "Closed bill cannot be paid"
            });
        }

        const currentMonth = new Date().toISOString().slice(0, 7);

        // 🚨 prevent duplicate payment
        const duplicatePaid = await Bill.findOne({
            name: bill.name,
            user: req.user.email,
            dueDate: { $regex: `^${currentMonth}` },
            status: "paid"
        });

        if (duplicatePaid) {
            return res.status(400).json({
                message: "Bill already paid for this month"
            });
        }

        // ✅ create transaction
        const transaction = await Transaction.create({
            date: new Date().toISOString().split("T")[0],
            type: "expense",
            category: bill.category,
            amount: bill.amount,
            payment: bill.paymentMethod,
            source: "bill",
            to: bill.name,
            user: req.user.email,
            billId: bill._id
        });

        // ✅ mark bill paid
        bill.status = "paid";
        bill.lastPaidDate = new Date().toISOString().split("T")[0];
        bill.lastPaidMonth = currentMonth;

        await bill.save();

        res.json({
            message: "Bill paid successfully",
            transaction
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ✅ UPDATE BILL (STRICT)
const updateBill = async (req, res) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        // 🚨 prevent editing paid bill values
        if (bill.status === "paid") {
            return res.status(400).json({
                message: "Paid bill cannot be edited"
            });
        }

        const updated = await Bill.findByIdAndUpdate(
            billId,
            req.body,
            { new: true }
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ✅ DELETE BILL
const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.billId);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.json({ message: "Deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ✅ CLOSE BILL (STOP FUTURE GENERATION)
const closeBill = async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            user: req.user.email
        });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        bill.status = "closed";
        await bill.save();

        res.json({ message: "Bill closed" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    createBill,
    getBills,
    payBill,
    updateBill,
    deleteBill,
    closeBill
};