import React, { useState, useEffect } from "react";
import {
  Button,
  Modal as BootstrapModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";

const Modal = ({ toggle, onSave, activeInvoice }) => {
  const defaultInvoice = { invoice_date: "", customer: "", total_amount: "" };
  const [formData, setFormData] = useState(activeInvoice || defaultInvoice);
  const [customers, setCustomers] = useState([]);

  // Fetch customer list
  useEffect(() => {
    axios.get("http://localhost:8000/api/customers/")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  useEffect(() => {
    if (activeInvoice) {
      setFormData({
        ...activeInvoice,
        invoice_date: activeInvoice.invoice_date ? activeInvoice.invoice_date.split("T")[0] : "", // ✅ Fix the date format
      });
    } else {
      setFormData(defaultInvoice);
    }
  }, [activeInvoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <BootstrapModal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Invoice Information</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="invoice-date">Invoice Date</Label>
            <Input
              type="date"
              id="invoice-date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="invoice-customer">Customer</Label>
            <Input
              type="select"
              id="invoice-customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
            >
              <option value="">Select a customer</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.title} {/* Display customer names instead of IDs */}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="invoice-total">Total Amount</Label>
            <Input
              type="text"
              id="invoice-total"
              name="total_amount"
              value={formData.total_amount}
              onChange={(e) => {
                let val = e.target.value.replace(",", "."); // ✅ Convert comma to dot
                setFormData({ ...formData, total_amount: val });
              }}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={() => onSave(formData)}>
          Save
        </Button>
      </ModalFooter>
    </BootstrapModal>
  );
};

export default Modal;