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

export const FLAGS = { ab, ch, de, en, fr, hr, ma, mo, ot, ru };

export const BADGES = import.meta.glob('./badges/s3/*.svg', { eager: true, as: 'url' });