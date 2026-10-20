class IProductRepository {
  findById(id) {
    throw new Error('Method not implemented');
  }
  updateStock(productId, quantity) {
    throw new Error('Method not implemented');
  }
  list() {
    throw new Error('Method not implemented');
  }
}
module.exports = IProductRepository;