import request from 'supertest'
import { app } from '../src/app'
import { expect, it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
// execSync ->  Able to execute shell commands inside the test
import { execSync } from 'node:child_process'
// import { knex } from '../src/database'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salary',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should be able to list all transactions for a given session', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salary',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createResponse.get('Set-Cookie')!

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Salary',
        amount: 5000,
      }),
    ])
  })

  it('Should be able to get a specific transaction by ID', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salary',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createResponse.headers['set-cookie']

    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listResponse.body.transactions[0].id

    const getResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getResponse.status).toBe(200)
    expect(getResponse.body.transaction).toBeDefined()
  })

  it('Should be able to get the transaction summary', async () => {
    const cookies = (
      await request(app.server)
        .post('/transactions')
        .send({ title: 'Salary', amount: 5000, type: 'credit' })
    ).headers['set-cookie']

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({ title: 'Groceries 1', amount: 2000, type: 'debit' })

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({ title: 'Groceries 2', amount: 2000, type: 'debit' })

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(response.status).toBe(200)
    expect(response.body.summary.amount).toBe(1000)
  })

  // test('Should return 400 if transaction ID is invalid', async () => {
  //   const response = await request(app.server).get('/transactions/invalid-id')

  //   expect(response.status).toBe(400)
  // })

  // test('Should return 404 if transaction is not found', async () => {
  //   const response = await request(app.server)
  //     .get(`/transactions/${randomUUID()}`)
  //     .set('Cookie', `sessionId=${randomUUID()}`)

  //   expect(response.status).toBe(404)
  // })
})
