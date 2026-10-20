class ShippingService {
  constructor(strategies, defaultStrategy) {
    this.strategies = strategies; // map region -> strategy
    this.defaultStrategy = defaultStrategy;
  }

  calculate(order) {
    const totalWeight = order.getTotalWeight();
    const region = order.customer.address.region?.toLowerCase();
    const strategy = this.strategies[region] || this.defaultStrategy;
    let freight = strategy.calculate(totalWeight);
    if (order.couponCode === 'FRETEGRATIS') {
      freight = 0;
    }
    return Number(freight.toFixed(2));
  }
}
module.exports = ShippingService;