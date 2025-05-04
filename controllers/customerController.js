const { Customer } = require('../models');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: customers.length,
      data: {
        customers
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'No customer found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        customer
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { name, phone, address, trustScore, notes } = req.body;

    const newCustomer = await Customer.create({
      userId: req.user.id,
      name,
      phone,
      address,
      trustScore: trustScore || 50,
      notes
    });

    res.status(201).json({
      status: 'success',
      data: {
        customer: newCustomer
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'No customer found with that ID'
      });
    }

    const { name, phone, address, trustScore, notes } = req.body;

    const updatedCustomer = await customer.update({
      name: name || customer.name,
      phone: phone || customer.phone,
      address: address || customer.address,
      trustScore: trustScore || customer.trustScore,
      notes: notes || customer.notes
    });

    res.status(200).json({
      status: 'success',
      data: {
        customer: updatedCustomer
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'No customer found with that ID'
      });
    }

    await customer.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};