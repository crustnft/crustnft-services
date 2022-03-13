export function getFitSize(
  preferHeight: number,
  preferWidth: number,
  height: number,
  width: number
) {
  let scaleRatio = preferWidth / width;

  let newHeight = Math.ceil(height * scaleRatio);
  let newWidth = Math.ceil(width * scaleRatio);

  if (newHeight - preferHeight > 1) {
    scaleRatio = preferHeight / height;

    newHeight = Math.ceil(height * scaleRatio);
    newWidth = Math.ceil(width * scaleRatio);
  }
  return {
    height: newHeight > preferHeight ? preferHeight : newHeight,
    width: newWidth > preferWidth ? preferWidth : newWidth,
  };
}
