import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided ID does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'asdfasdf', price: 30 })
    .expect(404);
});

it('returns a 401 if the user is not autheticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'asdfasdf', price: 30 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'Whatever', price: 300 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({ title: 'Update', price: 1 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'Whatever', price: 300 });

  await request(app).put(`/api/tickets/${response.body.id}`);
});

it('updates the ticket provided invalid inputs', async () => {
  const cookie = signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Whatever', price: 300 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 1 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated', price: -1 })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Whatever', price: 300 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated', price: 1 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('Updated');
  expect(ticketResponse.body.price).toEqual(1);
});

it('publishes an event', async () => {
  const cookie = signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Whatever', price: 300 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated', price: 1 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
