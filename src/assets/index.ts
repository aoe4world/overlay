export const FLAGS = Object.fromEntries(Object.entries(import.meta.glob('./flags/*.png', { eager: true, as: 'url' })).map(([k, v]) => [k.match(/\.\/flags\/(.*)\.png/)![1], v]));

export const BADGES = import.meta.glob('./badges/s3/*.svg', { eager: true, as: 'url' });