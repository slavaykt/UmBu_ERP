const InvoiceForm = {
    apiLink: 'invoices',
  layout:
  [
      {
        type: 'foreignKeySelect',
        label: 'customer',
        key: 'customer',
        size: 12,
        readOnly: true,
        api: {
          link: 'customers',
          key: 'customers'
        },
        validation: {
          required: true
        }
      },
      {
        type: 'date',
        label: 'invoice date',
        key: 'invoice_date',
        size: 6,
        validation: {
          minLength: 5
        }   
      },
      {
        type: 'number',
        label: 'total amount',
        key: 'total_amount',
        size: 6,
        validation: {
          minLength: 5
        }
      }
    ]
  }
  
    export default InvoiceForm