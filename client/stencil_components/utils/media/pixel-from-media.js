export default function PixelFromMedia(media, x, y) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = media.width;
  ctx.canvas.height = media.height;
  ctx.drawImage(media, 0, 0, media.width, media.height);
  const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
  return { r, g, b };
}
