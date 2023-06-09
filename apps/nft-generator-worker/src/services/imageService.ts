import sharp from 'sharp';
import { Logger } from '@crustnft-explore/util-config-api';
import { getFitSize } from '../utils/image';
import { ImageMeta } from '../types/file';
import { WEBP_FILE_EXTENSION } from '../constants/image';

const resizedImageCache = new Map<string, Buffer>();

const logger = Logger('imageService');

export async function normalizeImages(
  backgroundImage: ImageMeta,
  layers: ImageMeta[]
) {
  logger.debug('Start normalize images');

  const { height, width } = await sharp(backgroundImage.content).metadata();

  return Promise.all(layers.map((layer) => resizeImage(height, width, layer)));
}

async function resizeImage(
  preferHeight: number,
  preferWidth: number,
  image: ImageMeta
) {
  const { height, width } = await sharp(image.content).metadata();

  if (preferHeight === height && preferWidth === width) {
    logger.debug(`Skipped resize image , cause of same height and width`);
    return image.content;
  }

  const fitSize = getFitSize(preferHeight, preferWidth, height, width);
  const cacheKey = `${image.id}-${fitSize.height}-${fitSize.width}`;
  const cached = resizedImageCache.get(cacheKey);
  if (cached) {
    logger.debug(`Hit cache : ${cacheKey}`);
    return cached;
  }

  logger.debug('Start resizing image %s %j', image.id, {
    preferHeight,
    preferWidth,
    height,
    width,
  });

  const resizedImage = await sharp(image.content)
    .resize({
      width: fitSize.width,
      height: fitSize.height,
    })
    .toBuffer();

  resizedImageCache.set(cacheKey, resizedImage);
  return resizedImage;
}

export async function compositeImages(
  background: Buffer,
  layerBuffers: Buffer[]
) {
  logger.debug(
    `Start composite a background with ${layerBuffers.length} layers`
  );
  const toComposeLayers = layerBuffers.map((buffer) => ({
    input: buffer,
    top: 0,
    left: 0,
  }));

  return sharp(background)
    .composite(toComposeLayers)
    .flatten({ background: '#ffffff' })
    .toFormat(WEBP_FILE_EXTENSION)
    .toBuffer();
}
