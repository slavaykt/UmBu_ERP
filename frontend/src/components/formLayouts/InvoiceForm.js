const InvoiceForm = {
    apiLink: 'invoices',
  layout:
  [
    
      {
        type: 'input',
        label: 'customer name',
        key: 'customer_name',
        size: 12,
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
        label: 'invoice date',
        key: 'invoice_date',
        size: 6,
        inputType: 'date',
        validation: {
          minLength: 5
        }
      },
      {
        type: 'input',
        label: 'total amount',
        key: 'total_amount',
        size: 6,
        inputType: 'number',
        validation: {
          minLength: 5
        }
      }
    ]
  }
  
    export default InvoiceForm