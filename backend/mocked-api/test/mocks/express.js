module.exports.req = () => {
  const req = {};
  return req;
}

module.exports.res = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}