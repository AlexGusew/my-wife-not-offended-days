import { google } from 'googleapis';

export const spreadsheetId = process.env.SPREADSHEET_ID;

export const getSheetRange = ({ from = 2, until } = {}) =>
  `Sheet1!A${from ?? ''}:A${until ?? ''}`;
export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
export const sheets = google.sheets('v4');

export const dateTimeFormatter = new Intl.DateTimeFormat('en-US');

export const getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
};

export const getDate = async () => {
  try {
    const auth = await getAuthToken();
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      auth,
      range: getSheetRange(),
    });
    console.log(data);
    const [targetDate] = data.values.at(-1);
    return new Date(targetDate);
  } catch (error) {
    console.log(error.message, error.stack);
    throw error;
  }
};

export const setDate = async (newDate) => {
  try {
    const auth = await getAuthToken();
    const { data: currentData } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      auth,
      range: getSheetRange(),
    });
    const newDateFormatted = dateTimeFormatter.format(newDate);

    if (newDateFormatted === currentData.values.at(-1)[0]) {
      const [targetDate] = currentData.values.at(-1);
      return new Date(targetDate);
    }
    currentData.values.push([dateTimeFormatter.format(newDate)]);
    const until = currentData.values.length + 2;
    const range = getSheetRange({ until });
    const requestBody = {
      range,
      majorDimension: currentData.majorDimension,
      values: currentData.values,
    };
    const { data } = await sheets.spreadsheets.values.update({
      spreadsheetId,
      auth,
      range,
      requestBody,
      valueInputOption: 'USER_ENTERED',
      includeValuesInResponse: true,
    });
    const [targetDate] = data.updatedData.values.at(-1);
    return new Date(targetDate);
  } catch (error) {
    console.log(error.message, error.stack);
    throw error;
  }
};
