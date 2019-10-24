module.exports.status = {
  isError: status => status >= 400,
  isUserError: status => status >= 400 && status < 500,
  isServerError: status => status >= 500,
  isSuccess: status => status >= 200 && status < 400
}