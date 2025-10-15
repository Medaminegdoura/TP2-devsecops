import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({
          id: expect.any(Number),
          name: 'John Doe',
          email: 'john@example.com',
          isActive: true,
        });
      });
  });

  it('/users (GET)', async () => {
    // Create a user first
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' });

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toMatchObject({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });
  });

  it('/users/stats/active-count (GET)', async () => {
    // Create users first
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' });

    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Jane Doe', email: 'jane@example.com' });

    return request(app.getHttpServer())
      .get('/users/stats/active-count')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ count: 2 });
      });
  });

  it('/users/:id (GET)', async () => {
    // Create a user first
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' });

    const userId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          id: userId,
          name: 'John Doe',
          email: 'john@example.com',
        });
      });
  });
});
