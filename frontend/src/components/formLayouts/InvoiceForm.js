const InvoiceForm = {
    apiLink: 'invoices',
  layout:
  [
    
      {
        type: 'input',
        label: 'customer_name',
        key: 'customer_name',
        size: 6,
        inputType: 'text',
        readOnly: true,
        validation: {
          required: true,
          minLength: 5,
          validate: (v) => {
                return v !== 'fuck' || 'ругательные слова недопустимы!'
            }
        }
      },
      {
        type: 'input',
        label: 'invoice_date',
        key: 'invoice_date',
        size: 6,
        inputType: 'date',
        validation: {
          minLength: 5
        }
      }
    ]
  }
  
    export default InvoiceForm