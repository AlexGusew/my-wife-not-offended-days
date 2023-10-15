import { getDate } from './common.mjs';

export const handler = async (_event) => {
  const date = await getDate();

  const response = {
    statusCode: 200,
    body: JSON.stringify({ date }),
  };
  return response;
};

console.log(await handler());
