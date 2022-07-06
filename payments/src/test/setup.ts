import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  function signin(id?: string): string[];
}

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): Promise<string[]>
//     }
//   }
// }

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51K1Ld4FMqA0Mai1pH5ZvdZ4u6aRpQL4bJs0zcraCY4uTAMZdsqX2xXAqQExbe93AFbJITMn3PushuconvepTwh9p00rr944uX0';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take SON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
