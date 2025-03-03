// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Modal as BootstrapModal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Input,
//   Label,
// } from "reactstrap";
// import axios from "axios";

// const Modal = ({ toggle, onSave, activeInvoice }) => {
//   const defaultInvoice = { invoice_date: "", customer: "", total_amount: "" };
//   const [formData, setFormData] = useState(activeInvoice || defaultInvoice);
//   const [customers, setCustomers] = useState([]);

//   // Fetch customer list
//   useEffect(() => {
//     axios.get("http://localhost:8000/api/customers/")
//       .then((res) => setCustomers(res.data))
//       .catch((err) => console.error("Error fetching customers:", err));
//   }, []);

//   useEffect(() => {
//     if (activeInvoice) {
//       setFormData({
//         ...activeInvoice,
//         invoice_date: activeInvoice.invoice_date ? activeInvoice.invoice_date.split("T")[0] : "", // ✅ Fix the date format
//       });
//     } else {
//       setFormData(defaultInvoice);
//     }
//   }, [activeInvoice]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <BootstrapModal isOpen={true} toggle={toggle}>
//       <ModalHeader toggle={toggle}>Invoice Information</ModalHeader>
//       <ModalBody>
//         <Form>
//           <FormGroup>
//             <Label for="invoice-date">Invoice Date</Label>
//             <Input
//               type="date"
//               id="invoice-date"
//               name="invoice_date"
//               value={formData.invoice_date}
//               onChange={handleChange}
//             />
//           </FormGroup>
//           <FormGroup>
//             <Label for="invoice-customer">Customer</Label>
//             <Input
//               type="select"
//               id="invoice-customer"
//               name="customer"
//               value={formData.customer}
//               onChange={handleChange}
//             >
//               <option value="">Select a customer</option>
//               {customers.map((cust) => (
//                 <option key={cust.id} value={cust.id}>
//                   {cust.title} {/* Display customer names instead of IDs */}
//                 </option>
//               ))}
//             </Input>
//           </FormGroup>
//           <FormGroup>
//             <Label for="invoice-total">Total Amount</Label>
//             <Input
//               type="text"
//               id="invoice-total"
//               name="total_amount"
//               value={formData.total_amount}
//               onChange={(e) => {
//                 let val = e.target.value.replace(",", "."); // ✅ Convert comma to dot
//                 setFormData({ ...formData, total_amount: val });
//               }}
//             />
//           </FormGroup>
//         </Form>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="success" onClick={() => onSave(formData)}>
//           Save
//         </Button>
//       </ModalFooter>
//     </BootstrapModal>
//   );
// };


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
  const defaultInvoice = { invoice_date: "", customer: "", total_amount: "", invoice_items: [] };
  const [formData, setFormData] = useState(activeInvoice || defaultInvoice);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/customers/").then((res) => setCustomers(res.data));
    axios.get("http://localhost:8000/api/items/").then((res) => setItems(res.data));
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.invoice_items];
    updatedItems[index][field] = value;
    if (field === "quantity" || field === "price") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].price;
    }
    setFormData({ ...formData, invoice_items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      invoice_items: [...formData.invoice_items, { item: "", quantity: 1, price: 0, amount: 0 }],
    });
  };

  return (
    <BootstrapModal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Invoice Information</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="invoice-date">Invoice Date</Label>
            <Input type="date" id="invoice-date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="invoice-customer">Customer</Label>
            <Input type="select" id="invoice-customer" name="customer" value={formData.customer} onChange={handleChange}>
              <option value="">Select a customer</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.title}
                </option>
              ))}
            </Input>
          </FormGroup>

          <h5>Invoice Items</h5>
          {formData.invoice_items.map((item, index) => (
            <div key={index} className="mb-3">
              <FormGroup>
                <Label>Item</Label>
                <Input type="select" value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)}>
                  <option value="">Select an item</option>
                  {items.map((itm) => (
                    <option key={itm.id} value={itm.id}>
                      {itm.name} - ${itm.price}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Quantity</Label>
                <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Price</Label>
                <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
              </FormGroup>
              <p>Amount: ${item.amount.toFixed(2)}</p>
            </div>
          ))}
          <Button onClick={addItem}>Add Item</Button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={() => onSave(formData)}>Save</Button>
      </ModalFooter>
    </BootstrapModal>
  );
};

export default Modal;