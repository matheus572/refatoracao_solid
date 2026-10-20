class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log(`[NOTIFICATION] Enviando confirmação para ${customer.email}`);
    console.log(`Pedido: ${orderId} | Total: R$ ${total.toFixed(2)}`);
  }

  sendPaymentWaiting(customer, orderId) {
    console.log(`[NOTIFICATION] Pedido ${orderId} aguardando pagamento de ${customer.email}`);
  }
}

module.exports = NotificationService;