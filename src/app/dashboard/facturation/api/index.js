// API functions for Facturation module

/**
 * Send invoice to patient via email
 * @param {Object} invoice - The invoice object to send
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const sendInvoiceByEmail = async (invoice) => {
  try {
    // Verify if patient email exists
    if (!invoice.patient?.email) {
      console.error("L'adresse email du patient n'est pas disponible.");
      return false;
    }

    // Here you would make an API call to your backend service
    // For the demo, we'll simulate a successful API call with the email data
    console.log('Sending email with the following data:');
    console.log('- To:', invoice.patient.email);
    console.log('- Subject:', invoice.emailSubject || `Facture ${invoice.id}`);
    console.log('- Message:', invoice.emailMessage || 'Votre facture est jointe.');
    console.log('- Invoice ID:', invoice.id);
    console.log('- Amount:', invoice.total);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return success
    return true;
  } catch (error) {
    console.error('Error sending invoice by email:', error);
    return false;
  }
};

/**
 * Generate a shareable invoice link
 * @param {Object} invoice - The invoice object
 * @returns {string} - The shareable link
 */
export const generateInvoiceLink = (invoice) => {
  // In a real app, this might generate a unique, secure link via the backend
  return `https://app.tuatha.io/invoices/${invoice.id}`;
};
