const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const db = new AWS.DynamoDB.DocumentClient();
const stepfunctions = new AWS.StepFunctions();

/**
 * Sample Lambda function which mocks the operation of inserting item on DynamoDb by checking if the item exist
 * and update it if not it insert a new one
 *
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 * @returns {Object} object - Object containing the current price of the stock
 *
 */
exports.lambdaHandler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    throw new Error(`Only accept POST method, you tried: ${event.httpMethod}`);
  }

  let response = null;

  // All log statements are written to CloudWatch
  console.info("received:", event);

  const executionArn = JSON.parse(event.body).executionArn || null;

  if (executionArn === null || executionArn === undefined) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        error: "Provide StateMachine Execution Arn",
      }),
    };
  }

  if (response === null) {
    try {
      const stateResut = await stepfunctions
        .describeExecution({ executionArn: executionArn })
        .promise();

      console.info("State Machine Result", stateResut);

      response = {
        statusCode: 200,
        body: JSON.stringify(stateResut),
      };
    } catch (error) {
      console.error(error);
      response = {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }
  }

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
