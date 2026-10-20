class INotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    throw new Error('Method not implemented');
  }
  sendPaymentWaiting(customer, orderId) {
    throw new Error('Method not implemented');
  }
}
module.exports = INotificationService;