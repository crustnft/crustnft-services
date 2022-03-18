export function isCloudFunctions() {
  return !!process.env.FUNCTION_SIGNATURE_TYPE;
}
