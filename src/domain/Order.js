class Order {
  constructor(id, customer, items, couponCode, paymentMethod, installments) {
    this.id = id;
    this.customer = customer;
    this.items = items;
    this.couponCode = couponCode;
    this.paymentMethod = paymentMethod;
    this.installments = installments;
    this.status = "created";
    this.createdAt = new Date();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getTotalWeight() {
    return this.items.reduce((total, item) => {
      return total + item.product.weight * item.quantity;
    }, 0);
  }

  validate() {
    if (!this.customer) {
      throw new Error('Cliente obrigatorio.');
    }
    if (!this.customer.email || !this.customer.email.includes('@')) {
      throw new Error('E-mail do cliente invalido.');
    }
    if (!this.items || this.items.length === 0) {
      throw new Error('Pedido sem itens.');
    }
    for (const item of this.items) {
      if (!item.product) {
        throw new Error('Item sem produto.');
      }
      if (item.quantity <= 0) {
        throw new Error('Quantidade invalida.');
      }
    }
  }

  confirm(paymentStatus) {
    this.status = paymentStatus === 'approved' ? 'confirmed' : 'waiting_payment';
  }

  toSummary({ subtotal, discount, freight, paymentFee, total }) {
    return {
      id: this.id,
      customerName: this.customer.name,
      customerEmail: this.customer.email,
      city: this.customer.address.city,
      state: this.customer.address.state,
      items: this.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total: Number(total.toFixed(2)),
      paymentMethod: this.paymentMethod,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}

module.exports = Order;
