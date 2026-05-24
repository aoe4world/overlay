export const FLAGS = Object.fromEntries(Object.entries(import.meta.glob('./flags/*.png', { eager: true, as: 'url' })).map(([k, v]) => [k.match(/\.\/flags\/(.*)\.png/)![1], v]));

export const BADGES = Object.fromEntries(Object.entries(import.meta.glob('./badges/s3/*.svg', { eager: true, as: 'url' })).map(([k, v]) => [k.match(/\/([^/]*)\.svg/)![1], v]));
export const BADGES_INGAME = Object.fromEntries(Object.entries(import.meta.glob('./badges/s3_ingame/*.png', { eager: true, as: 'url' })).map(([k, v]) => [k.match(/\/([^/]*)\.png/)![1], v]));

export const STYLESETS = {
  's3': {
    flags: FLAGS,
    badges: BADGES
  },
  's3_ingame': {
    flags: FLAGS,
    badges: BADGES_INGAME
  }
};

export type STYLESET_TYPES = 's3' | 's3_ingame';
