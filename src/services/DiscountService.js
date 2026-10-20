class DiscountService {
  constructor(strategies) {
    this.strategies = strategies; // array of IDiscountStrategy
  }

  calculate(order, subtotal) {
    let totalDiscount = 0;
    for (const strategy of this.strategies) {
      totalDiscount += strategy.apply(order, subtotal);
    }
    return Number(totalDiscount.toFixed(2));
  }
}
module.exports = DiscountService;