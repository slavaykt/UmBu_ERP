import { useState } from "react";
import InvoiceList from "./InvoiceList"
import EditForm from './EditForm'
import InvoiceForm from "./formLayouts/InvoiceForm";

const Invoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Open modal for editing
  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice)
    setShowEditForm(true)
  };

  const handleAdd = (invoice) => {
    setSelectedInvoice(null)
    setShowEditForm(true)
  };

  const refreshInvoices = () => {
    console.log('Тут можно будет перезагрузить список инвойсов')
  }

  return (
    <div className='row'>
      <aside className="col-3">
        <h1 className="text-uppercase text-center my-4">Invoice List</h1>
        <InvoiceList onEdit={handleEdit}
          onAdd={handleAdd} />
      </aside>
      <main className="col-9">
        <div className="row">

          {showEditForm && (
            <div className="col">
              <h1 className="text-uppercase text-center my-4">
                {selectedInvoice ? "Edit Invoice" : "Create New Invoice"}
              </h1>
              <EditForm
                itemId={selectedInvoice?.id}
                refreshTodoList={refreshInvoices}
                layout={InvoiceForm.layout}
                apiLink={InvoiceForm.apiLink}
                setShowEdit={setShowEditForm}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Invoices;