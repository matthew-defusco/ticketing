import { OrderStatus } from '@mdcommon/gittix-common';
import mongoose, { mongo } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('returns 404 when purchasing an order that does not exist', async () => {
  await request(app).post('/api/payments').set('Cookie', signin()).send({
    token: 'asdfasdf',
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });

  expect(404);
});

it('returns 401 when purchasing an order that does not belong to user', async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 30,
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({ token: 'asdf', orderId: order.id })
    .expect(401);
});

it('returns 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 30,
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({ token: 'asdf', orderId: order.id })
    .expect(400);
});

// it('returns 204 when purchasing an order with valid inputs', async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const order = await Order.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     price: 30,
//     status: OrderStatus.Created,
//     version: 0,
//     userId,
//   });

//   await order.save();

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', signin(userId))
//     .send({
//       token: 'tok_visa',
//       orderId: order.id,
//     })
//     .expect(201);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

//   expect(stripe.charges.create).toHaveBeenCalled();
//   expect(chargeOptions.currency).toEqual('usd');
//   expect(chargeOptions.source).toEqual('tok_visa');
//   expect(chargeOptions.amount).toEqual(30 * 100);
// });

it('returns 204 when purchasing an order with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    version: 0,
    userId,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const charges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = charges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
