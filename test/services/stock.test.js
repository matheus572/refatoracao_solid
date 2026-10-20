const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const StockService = require('../../src/services/StockService');
const ProductRepository = require('../../src/repositories/ProductRepository');
const OrderItem = require('../../src/domain/OrderItem');

describe('StockService', () => {
  let productRepository;
  let stockService;

  beforeEach(() => {
    productRepository = new ProductRepository();
    stockService = new StockService(productRepository);
  });

  test('validateStock passes when enough stock', () => {
    const product = productRepository.findById('p1'); // stock 8
    const items = [new OrderItem(product, 5)];
    assert.doesNotThrow(() => stockService.validateStock(items));
  });

  test('validateStock throws when insufficient stock', () => {
    const product = productRepository.findById('p1'); // stock 8
    const items = [new OrderItem(product, 10)];
    assert.throws(() => stockService.validateStock(items), /Estoque insuficiente/);
  });

  test('validateStock throws when product not found', () => {
    const fakeProduct = { id: 'nonexistent', name: 'Fake', price: 10, weight: 1 };
    const items = [new OrderItem(fakeProduct, 1)];
    assert.throws(() => stockService.validateStock(items), /Produto nonexistent nao encontrado/);
  });

  test('reserveStock reduces stock', () => {
    const product = productRepository.findById('p2'); // stock 30
    const initialStock = product.stock;
    const items = [new OrderItem(product, 3)];
    stockService.reserveStock(items);
    assert.strictEqual(product.stock, initialStock - 3);
  });
});