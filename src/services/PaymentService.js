class PaymentService {
  constructor(strategies) {
    this.strategies = strategies; // map paymentMethod -> strategy
  }

  process(order, subtotal) {
    const strategy = this.strategies[order.paymentMethod];
    if (!strategy) {
      throw new Error('Forma de pagamento invalida.');
    }
    const result = strategy.process(order, subtotal);
    return {
      paymentStatus: result.paymentStatus,
      paymentFee: Number(result.paymentFee.toFixed(2)),
      extraDiscount: Number(result.extraDiscount.toFixed(2))
    };
  }
}
module.exports = PaymentService;