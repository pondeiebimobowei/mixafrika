import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { test_user } from 'src/test_data/data';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/auth/signup1 (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        first_name: test_user.first_name,
        last_name: test_user.last_name,
        phone_number: "+2348105910313",
        email: test_user.email,
        role: 'trader',
        password: test_user.password,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('refresh_token')
        expect(res.body.data).toHaveProperty('token')
        expect(res.body.data).toHaveProperty('user')

        expect(res.body.data.user).toHaveProperty('id');
        expect(res.body.data.user).toHaveProperty('user_name');
        expect(res.body.data.user).toHaveProperty('first_name', test_user.first_name);
        expect(res.body.data.user).toHaveProperty('last_name', test_user.last_name);
        expect(res.body.data.user).toHaveProperty('email', test_user.email);
        expect(res.body.data.user).toHaveProperty('password');
        expect(res.body.data.user).toHaveProperty('role', 'trader');
        expect(res.body.data.user).toHaveProperty('is_verified', false);
        expect(res.body.data.user).toHaveProperty('is_email_verified', false);
        expect(res.body.data.user).toHaveProperty('credit_score', "0.00");
        expect(res.body.data.user).toHaveProperty('credit_score_status', 'not set');
      });
  });

  it('/v1/auth/signup2 (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'Aria',
        last_name: 'Brown',
        phone_number: "+2348105910313",
        email: 'ariabrown@test.com',
        role: 'trader',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('refresh_token')
        expect(res.body.data).toHaveProperty('token')
        expect(res.body.data).toHaveProperty('user')

        expect(res.body.data.user).toHaveProperty('id');
        expect(res.body.data.user).toHaveProperty('password');
        expect(res.body.data.user).toHaveProperty('first_name', 'Aria');
        expect(res.body.data.user).toHaveProperty('last_name', 'Brown');
        expect(res.body.data.user).toHaveProperty('email', 'ariabrown@test.com');
        expect(res.body.data.user).toHaveProperty('role', 'trader');
      });
  });

  it('/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: test_user.email,
        password: test_user.password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message', 'Login Successful');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data).toHaveProperty('refresh_token');
        expect(res.body.data).toHaveProperty('user');

        expect(res.body.data.user).toHaveProperty('first_name', test_user.first_name);
        expect(res.body.data.user).toHaveProperty('last_name', test_user.last_name);
        expect(res.body.data.user).toHaveProperty('password');
        expect(res.body.data.user).toHaveProperty('email', test_user.email);
        expect(res.body.data.user).toHaveProperty('business');
      });
  });
});


