const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const db = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.HOTEL_BOOKINGS_TABLE_NAME;

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
  console.info("received:", event);
  let response = null;
  const tripId = event.tripId || event[0].tripId || undefined;

  if (tripId === null || tripId === undefined) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        bookFlightSuccess: false,
        error: "Cancel Hotel Error",
      }),
    };
  }

  if (response === null) {
    let params = {
      TableName: tableName,
      Key: {
        tripId: tripId,
      },
    };

    const dbData = await db.get(params).promise();
    let dbItem = Object.assign(dbData.Item || {}, {
      tripId: tripId,
      status: "CANCELLED",
    });

    delete params.Key;
    params["Item"] = dbItem;

    await db.put(params).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify(dbItem),
    };
  }

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
