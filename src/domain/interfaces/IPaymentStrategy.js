class IPaymentStrategy {
  process(order, subtotal) {
    throw new Error('Method not implemented');
  }
}
module.exports = IPaymentStrategy;