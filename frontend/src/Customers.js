import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import Modal from "./components/Modal"; // Importing from components folder

const initialCustomers = [
  { id: 1, title: "John Doe", tax_id: "123-456-789", address: "123 Main St, Springfield" },
  { id: 2, title: "Jane Smith", tax_id: "987-654-321", address: "456 Elm St, Shelbyville" },
  { id: 3, title: "Sam Johnson", tax_id: "555-666-777", address: "789 Oak St, Capital City" },
  { id: 4, title: "Alice Brown", tax_id: "222-333-444", address: "159 Maple St, North Haverbrook" },
];

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);

  // Fetch Customers with async/await
  const refreshList = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/customers/");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    refreshList();
  }, []);

  // Toggle modal visibility
  const toggleModal = () => setModal(!modal);

  // Handle Add & Edit Customer
  const handleSave = (customer) => {
    if (customer.id) {
      // Update existing customer
      setCustomers(customers.map((item) => (item.id === customer.id ? customer : item)));
    } else {
      // Add new customer with an auto-incremented ID
      setCustomers([...customers, { ...customer, id: customers.length + 1 }]);
    }
    toggleModal();
  };

  // Open modal for editing a customer
  const handleEdit = (customer) => {
    setActiveCustomer(customer);
    toggleModal();
  };

  // Delete a customer
  const handleDelete = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Customer List</h1>
      <div className="row">
        <div className="col-md-8 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4 text-right">
              <Button
                color="primary"
                onClick={() => {
                  setActiveCustomer({ title: "", tax_id: "", address: "" });
                  toggleModal();
                }}
              >
                Add Customer
              </Button>
            </div>
            <ul className="list-group list-group-flush">
              {customers.map((customer) => (
                <li key={customer.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{customer.title}</h5>
                    <p className="mb-1"><strong>Tax ID:</strong> {customer.tax_id}</p>
                    <p className="mb-0"><strong>Address:</strong> {customer.address}</p>
                  </div>
                  <span>
                    <Button color="secondary" className="mr-2" onClick={() => handleEdit(customer)}>
                      Edit
                    </Button>
                    <Button color="danger" onClick={() => handleDelete(customer.id)}>
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
      {modal && <Modal toggle={toggleModal} onSave={handleSave} activeCustomer={activeCustomer} />}
    </main>
  );
};

export default Customers;