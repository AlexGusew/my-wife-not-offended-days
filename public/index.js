const API_URL =
  'https://y24gvbi6pc.execute-api.eu-west-1.amazonaws.com/default';
const pluralRoles = new Intl.PluralRules('ru-RU');
const pluralFormToDay = {
  one: 'день',
  few: 'дня',
  many: 'дней',
};

const getDate = async () => {
  const request = await fetch(`${API_URL}/get-date`);
  return request.json();
};

const resetDate = async () => {
  const request = await fetch(`${API_URL}/reset-date`);
  return request.json();
};

const onResetDaysCount = async () => {
  setDaysCountText('...');
  const { date } = await resetDate();
  const initialDate = new Date(date);
  const deltaDays = getDelta(initialDate);
  setDaysCountText(deltaDays);
};

const setDaysCountText = (daysCount) => {
  const pluralForm = pluralRoles.select(daysCount);

  pluralFormElement.innerText = pluralFormToDay[pluralForm] ?? '';
  daysElement.innerText = daysCount;
};

const getDelta = (initialDate) => {
  const nowDate = new Date();
  const deltaDays = Math.floor(
    (nowDate.getTime() - initialDate.getTime()) / (24 * 60 * 60 * 1000),
  );
  return deltaDays;
};

const daysElement = document.getElementById('days-counter');
const pluralFormElement = document.getElementById('plural-form');
const resetButtonElement = document.getElementById('reset-button');

resetButtonElement.addEventListener('click', onResetDaysCount);

const main = async () => {
  const { date } = await getDate();
  const initialDate = new Date(date);
  const deltaDays = getDelta(initialDate);
  setDaysCountText(deltaDays);
};

main();
