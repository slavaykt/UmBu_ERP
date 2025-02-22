import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

const CustomerModal = ({ toggle, onSave, activeCustomer: initialCustomer }) => {
  const [activeCustomer, setActiveCustomer] = useState(initialCustomer);

  // Update state when props change (important when reusing modal)
  useEffect(() => {
    setActiveCustomer(initialCustomer);
  }, [initialCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setActiveCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Customer Information</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="customer-title">Customer Name</Label>
            <Input
              type="text"
              id="customer-title"
              name="title"
              value={activeCustomer.title}
              onChange={handleChange}
              placeholder="Enter Customer Name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="customer-tax-id">Tax ID</Label>
            <Input
              type="text"
              id="customer-tax-id"
              name="tax_id"
              value={activeCustomer.tax_id}
              onChange={handleChange}
              placeholder="Enter Tax ID"
            />
          </FormGroup>
          <FormGroup>
            <Label for="customer-address">Address</Label>
            <Input
              type="text"
              id="customer-address"
              name="address"
              value={activeCustomer.address}
              onChange={handleChange}
              placeholder="Enter Customer Address"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={() => onSave(activeCustomer)}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomerModal;