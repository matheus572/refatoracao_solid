class IDiscountStrategy {
  apply(order, subtotal) {
    throw new Error('Method not implemented');
  }
}
module.exports = IDiscountStrategy;