import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import Modal from "./InvoiceModal"; // Reuse the existing Modal component

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Fetch invoices from the backend
  const refreshList = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/invoices/");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  // Save (Add/Edit) an invoice and update state immediately
  const handleSave = async (invoice) => {
    console.log(invoice)
    try {
      if (invoice.id) {
        // Update existing invoice
        await axios.put(`http://localhost:8000/api/invoices/${invoice.id}/`, invoice);
        setInvoices((prevInvoices) =>
          prevInvoices.map((item) => (item.id === invoice.id ? invoice : item))
        );
        refreshList();
      } else {
        // Create new invoice
        const response = await axios.post("http://localhost:8000/api/invoices/", invoice);
        setInvoices((prevInvoices) => [...prevInvoices, response.data]);
      }
      toggleModal(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Delete an invoice
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/invoices/${id}/`);
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  // Toggle modal
  const toggleModal = () => setModal(!modal);

  // Open modal for editing
  const handleEdit = (invoice) => {
    setActiveInvoice(invoice);
    toggleModal();
  };

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Invoice List</h1>
      <div className="row">
        <div className="col-md-8 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4 text-right">
              <Button
                color="primary"
                onClick={() => {
                  setActiveInvoice({ invoice_date: "", customer: "", total_amount: "" });
                  toggleModal();
                }}
              >
                Add Invoice
              </Button>
            </div>
            <ul className="list-group list-group-flush">
              {invoices.map((invoice) => (
                <li key={invoice.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5>Invoice #{invoice.id}</h5>
                    <p className="mb-1"><strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Customer:</strong> {invoice.customer_name || "Unknown"}</p>
                    <p className="mb-0"><strong>Total:</strong> ${invoice.total_amount}</p>
                  </div>
                  <span>
                    <Button color="secondary" className="mr-2" onClick={() => handleEdit(invoice)}>
                      Edit
                    </Button>
                    <Button color="danger" onClick={() => handleDelete(invoice.id)}>
                      Delete
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Show the Modal when active */}
      {modal && <Modal toggle={toggleModal} onSave={handleSave} activeInvoice={activeInvoice} />}
    </main>
  );
};

export default Invoices;