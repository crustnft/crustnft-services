import sharp from 'sharp';
import { Logger } from '@crustnft-explore/util-config-api';
import { getFitSize } from '../utils/image';

const logger = Logger('imageService');

export async function normalizeImages(
  backgroundImage: Buffer,
  layers: Buffer[]
) {
  logger.debug('Start normalize images');

  const { height, width } = await sharp(backgroundImage).metadata();

  return Promise.all(layers.map((layer) => resizeImage(height, width, layer)));
}

async function resizeImage(
  preferHeight: number,
  preferWidth: number,
  image: Buffer
) {
  const { height, width } = await sharp(image).metadata();
  const fitSize = getFitSize(preferHeight, preferWidth, height, width);

  logger.debug('Start resizing image : ', {
    preferHeight,
    preferWidth,
    height,
    width,
  });

  return sharp(image)
    .resize({
      width: fitSize.width,
      height: fitSize.height,
    })
    .toBuffer();
}

export async function compositeImages(
  background: Buffer,
  layerBuffers: Buffer[]
) {
  logger.debug(`Start composite background with ${layerBuffers.length} layers`);
  const toComposeLayers = layerBuffers.map((buffer) => ({
    input: buffer,
    top: 0,
    left: 0,
  }));

  return sharp(background)
    .composite(toComposeLayers)
    .toFormat('jpeg')
    .toBuffer();
}
