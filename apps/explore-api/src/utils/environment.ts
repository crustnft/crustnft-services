export function isCloudFunctions() {
  return !!process.env.FUNCTION_SIGNATURE_TYPE;
}

export function getAppEnv() {
  return process.env.APP_ENV || 'local';
}
