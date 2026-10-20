class StockService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  validateStock(items) {
    for (const item of items) {
      const product = this.productRepository.findById(item.product.id);
      if (!product) {
        throw new Error(`Produto ${item.product.id} nao encontrado.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}.`);
      }
    }
  }

  reserveStock(items) {
    for (const item of items) {
      this.productRepository.updateStock(item.product.id, item.quantity);
    }
  }
}
module.exports = StockService;