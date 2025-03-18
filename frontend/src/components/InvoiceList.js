import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "reactstrap";

const InvoiceList = ({ onEdit, onAdd }) => {
    const [invoices, setInvoices] = useState([]);

    // Fetch invoices from the backend
    const refreshList = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/invoices/");
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        refreshList();
    }, []);


    // Delete an invoice
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/invoices/${id}/`);
            setInvoices(invoices.filter((invoice) => invoice.id !== id));
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center mb-3">
                <Button color="primary" onClick={onAdd}>Add Invoice</Button>
            </div>

            <ul className="list-group list-group-flush">
                {invoices.map((invoice) => (
                    <li key={invoice.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>Invoice #{invoice.id}</h5>
                            <p className="mb-1"><strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Customer:</strong> {invoice.customer || "Unknown"}</p>
                            <p className="mb-0"><strong>Total:</strong> ${invoice.total_amount}</p>
                        </div>
                        <span>
                            <Button color="secondary" className="mr-2" onClick={() => onEdit(invoice)}>
                                Edit
                            </Button>
                            <Button color="danger" onClick={() => handleDelete(invoice.id)}>
                                Delete
                            </Button>
                        </span>
                    </li>
                ))}
            </ul>
        </>
    )

}

export default InvoiceList;