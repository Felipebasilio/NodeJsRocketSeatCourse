import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 1',
        description: 'Gym 1 description',
        phone: '1234567890',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 2',
        description: 'Gym 2 description',
        phone: '1234567890',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const searchGymsResponse = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(searchGymsResponse.statusCode).toEqual(200)
    expect(searchGymsResponse.body.gyms).toHaveLength(1)
    expect(searchGymsResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym 1',
      }),
    ])
  })
})
