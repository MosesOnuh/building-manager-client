export const GetDate = (time) => {
  const date = new Date(time);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-NG', options);
};