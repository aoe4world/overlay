import ab from "./flags/ab.png";
import ch from "./flags/ch.png";
import de from "./flags/de.png";
import en from "./flags/en.png";
import fr from "./flags/fr.png";
import hr from "./flags/hr.png";
import ma from "./flags/ma.png";
import mo from "./flags/mo.png";
import ot from "./flags/ot.png";
import ru from "./flags/ru.png";

export const FLAGS = Object.fromEntries(Object.entries(import.meta.glob('./flags/*.png', { eager: true, as: 'url' })).map(([k, v]) => [k.match(/\.\/flags\/(.*)\.png/)![1], v]));

export const BADGES = import.meta.glob('./badges/s3/*.svg', { eager: true, as: 'url' });