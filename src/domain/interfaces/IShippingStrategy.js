class IShippingStrategy {
  calculate(totalWeight) {
    throw new Error('Method not implemented');
  }
}
module.exports = IShippingStrategy;