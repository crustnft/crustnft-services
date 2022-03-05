export function getFitSize(
  preferHeight: number,
  preferWidth: number,
  height: number,
  width: number
) {
  const preferRatio = preferHeight / preferWidth;
  const inputRatio = height / width;
  let scaleRatio = preferWidth / width;
  if (height > width) {
    scaleRatio = preferHeight / height;
  }

  let extraRatio = 1;
  if (preferRatio > inputRatio) {
    extraRatio = inputRatio / preferRatio;
  }
  const newHeight = Math.ceil(height * scaleRatio * extraRatio);
  const newWidth = Math.floor(width * scaleRatio * extraRatio);
  return {
    height: newHeight > preferHeight ? preferHeight : newHeight,
    width: newWidth > preferWidth ? preferWidth : newWidth,
  };
}
