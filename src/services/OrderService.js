class OrderService {
  constructor({
    orderRepository,
    productRepository,
    stockService,
    shippingService,
    discountService,
    paymentService,
    notificationService,
    logger
  }) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.stockService = stockService;
    this.shippingService = shippingService;
    this.discountService = discountService;
    this.paymentService = paymentService;
    this.notificationService = notificationService;
    this.logger = logger;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);

    order.validate();

    this.stockService.validateStock(order.items);

    const subtotal = order.getSubtotal();

    const discount = this.discountService.calculate(order, subtotal);

    const freight = this.shippingService.calculate(order);

    const { paymentStatus, paymentFee, extraDiscount } = this.paymentService.process(order, subtotal);

    const totalDiscount = Number((discount + extraDiscount).toFixed(2));

    const total = Number((subtotal - totalDiscount + freight + paymentFee).toFixed(2));

    if (total <= 0) {
      throw new Error('Total do pedido invalido.');
    }

    this.stockService.reserveStock(order.items);

    order.confirm(paymentStatus);

    const summary = order.toSummary({
      subtotal,
      discount: totalDiscount,
      freight,
      paymentFee,
      total
    });

    this.orderRepository.save(summary);

    if (order.status === 'confirmed') {
      this.notificationService.sendOrderConfirmation(order.customer, order.id, total);
    } else {
      this.notificationService.sendPaymentWaiting(order.customer, order.id);
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }

    console.log('Resumo do pedido');
    console.log(`Cliente: ${order.customer.name}`);
    console.log(`Cidade: ${order.customer.address.city}/${order.customer.address.state}`);
    console.log(`Itens: ${order.getTotalItems()}`);
    console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`);
    console.log(`Desconto: R$ ${totalDiscount.toFixed(2)}`);
    console.log(`Frete: R$ ${freight.toFixed(2)}`);
    console.log(`Taxas: R$ ${paymentFee.toFixed(2)}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);

    return summary;
  }
}

module.exports = OrderService;