import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { Dummy, CreateSquare, reset, vals, ListFiles } from './routes';


describe('routes', function() {

  // After you know what to do, feel free to delete this Dummy test
  it('Dummy', function() {
    // Feel free to copy this test structure to start your own tests, but look at these
    // comments first to understand what's going on.

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}}); 
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    Dummy(req1, res1);

    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  });


  // TODO: add tests for your routes
  it('create', function () {
    // 1 case
    reset();
    let req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new', sq: 'yellow' } });
    let res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData(), 'yellow');
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new2', sq: 'blue' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getJSONData(),'blue');

    // duplicate key => override
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new2', sq: 'orange' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getJSONData(), 'orange');
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new2', sq: 'purple' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getJSONData(), 'purple');
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new2', sq: '["yellow","yellow",["white","red","white","white"],"yellow"]' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getJSONData(), '["yellow","yellow",["white","red","white","white"],"yellow"]');

    // base case: missing sq param
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new3' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getData(), 'missing "sq" parameter!!');
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new4' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getData(), 'missing "sq" parameter!!');

    // base case: missing filename param
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { sq: 'yellow' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getData(), 'missing "filename" parameter!!');
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { sq: 'blue' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(vals.size, 2);
    assert.deepStrictEqual(res1._getData(), 'missing "filename" parameter!!');

    // many case
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new9', sq: '["yellow","yellow",["white","red","white","white"],"yellow"]' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(vals.size, 3);
    assert.deepStrictEqual(res1._getJSONData(), '["yellow","yellow",["white","red","white","white"],"yellow"]');
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new90', sq: '["yellow",["white","red","white","white"],"yellow", ["white","red","white","white"]]' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(vals.size, 4);
    assert.deepStrictEqual(res1._getJSONData(), '["yellow",["white","red","white","white"],"yellow", ["white","red","white","white"]]');
  });

  it('list', function () {
    reset();

    // empty
    let req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    let res1 = httpMocks.createResponse();
    ListFiles(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData().files, {});

    // 1 element
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new', sq: 'yellow' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    res1 = httpMocks.createResponse();
    ListFiles(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData().files, { 'new': 'yellow' });

    // 1+ element
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new2', sq: 'blue' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    res1 = httpMocks.createResponse();
    ListFiles(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData().files, {'new': 'yellow', 'new2': 'blue'});
    req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { filename: 'new3', sq: '["yellow","yellow",["white","red","white","white"],"yellow"]' } });
    res1 = httpMocks.createResponse();
    CreateSquare(req1, res1);
    req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    res1 = httpMocks.createResponse();
    ListFiles(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData().files, { 'new': 'yellow', 'new2': 'blue', 'new3': '["yellow","yellow",["white","red","white","white"],"yellow"]' });   // 1+ element
  });
});
