const request = require('supertest');
const { app } = require('../server');

// eslint-disable-next-line no-undef
describe('TEST FOR CONNECTION', () => {
  // eslint-disable-next-line no-undef
  test('should pass if connection is ok', done => {
    return request(app)
      .get('/api/v1/health-check')
      .expect(200)
      .then(res => {
        // eslint-disable-next-line no-undef
        expect(res.status).toEqual(200);
        done();
      });
  });
});
