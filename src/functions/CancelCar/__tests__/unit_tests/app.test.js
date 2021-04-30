// Import all functions from get-all-tickets.js
const lambda = require("../../app");
// Import dynamodb from aws-sdk
const dynamodb = require("aws-sdk/clients/dynamodb");

// This includes all tests for lambdaHandler
describe("Test CancelCar", () => {
  let getSpy;
  let putSpy;

  // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
  beforeAll(() => {
    // Mock dynamodb get and put methods
    // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
    getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, "get");
    putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, "put");
  });

  // Clean up mocks
  afterAll(() => {
    getSpy.mockRestore();
    putSpy.mockRestore();
  });

  it("should return success for new Item", async () => {
    const dbItems = {
      tripId: "5c12d94a-ee6a-40d9-889b-1d49142248b7",
      status: "CANCELLED",
    };
    const event = dbItems;

    // Return the specified value whenever the spied scan function is called
    getSpy.mockReturnValue({
      promise: () => Promise.resolve({ Item: null }),
    });

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(dbItems),
    });

    // Invoke helloFromLambdaHandler()
    const result = await lambda.lambdaHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(dbItems),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it("should return success for existing Item", async () => {
    const dbItems = {
      tripId: "5c12d94a-ee6a-40d9-889b-1d49142248b7",
      status: "CANCELLED",
    };
    const event = dbItems;

    // Return the specified value whenever the spied scan function is called
    getSpy.mockReturnValue({
      promise: () => Promise.resolve({ Item: dbItems }),
    });

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(dbItems),
    });

    // Invoke helloFromLambdaHandler()
    const result = await lambda.lambdaHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(dbItems),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it("should return 500", async () => {
    const dbItems = [{}];
    const event = dbItems;

    // Return the specified value whenever the spied scan function is called
    getSpy.mockReturnValue({
      promise: () => Promise.resolve({ Item: dbItems }),
    });

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(dbItems),
    });

    // Invoke helloFromLambdaHandler()
    const result = await lambda.lambdaHandler(event);

    const expectedResult = 500;

    // Compare the result with the expected result
    expect(result.statusCode).toEqual(expectedResult);
  });
});
