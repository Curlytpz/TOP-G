import nylexGermanLeather from "../assets/materials-real/nylex-german-leather.webp";
import nylexGermanLeatherMiddle from "../assets/materials-real/nylex-german-leather-middle.webp";
import montecarloItalianLeather1 from "../assets/materials-real/montecarlo-italian-leather-1.webp";
import montecarloItalianLeather2 from "../assets/materials-real/montecarlo-italian-leather-2.webp";
import montecarloItalianLeather3 from "../assets/materials-real/montecarlo-italian-leather-3.webp";
import copperItalianLeather1 from "../assets/materials-real/copper-italian-leather-1.webp";
import copperItalianLeather2 from "../assets/materials-real/copper-italian-leather-2.webp";
import copperItalianLeather3 from "../assets/materials-real/copper-italian-leather-3.webp";

export const materialDetails = {
  nylex: {
    slug: "nylex",
    name: "NYLEX German Leather",
    type: "German Leather",
    warrantyYears: 3,
    intro: "A TOP-G material line for shaping a custom automotive interior around the finish and color direction you prefer.",
    description: "Review the supplied sample photos to compare color and texture directions for your build. NYLEX German Leather is available through TOP-G Auto Seat and is covered by a 3-year warranty.",
    images: [
      { src: nylexGermanLeather, alt: "NYLEX German Leather color sample collection" },
      { src: nylexGermanLeatherMiddle, alt: "NYLEX German Leather sample book" },
      { src: nylexGermanLeather, alt: "NYLEX German Leather sample collection detail" },
    ],
  },
  montecarlo: {
    slug: "montecarlo",
    name: "MONTECARLO Italian Leather",
    type: "Italian Leather",
    warrantyYears: 5,
    intro: "A TOP-G material line for a custom automotive interior, with color and texture choices shown in the supplied samples.",
    description: "Use the real sample photos as a starting point for selecting the color and finish that fit your interior design. MONTECARLO Italian Leather is available through TOP-G Auto Seat and is covered by a 5-year warranty.",
    images: [
      { src: montecarloItalianLeather1, alt: "MONTECARLO Italian Leather color sample book" },
      { src: montecarloItalianLeather2, alt: "MONTECARLO Italian Leather color samples" },
      { src: montecarloItalianLeather3, alt: "MONTECARLO Italian Leather texture samples" },
    ],
  },
  copper: {
    slug: "copper",
    name: "COPPER Italian Leather",
    type: "Italian Leather",
    warrantyYears: 5,
    intro: "A TOP-G material line for custom automotive interiors, shown here through the supplied color and texture samples.",
    description: "Explore the real sample photos when considering your preferred color and finish for a custom interior. COPPER Italian Leather is available through TOP-G Auto Seat and is covered by a 5-year warranty.",
    images: [
      { src: copperItalianLeather1, alt: "COPPER Italian Leather color sample collection" },
      { src: copperItalianLeather2, alt: "COPPER Italian Leather texture samples" },
      { src: copperItalianLeather3, alt: "COPPER Italian Leather sample collection detail" },
    ],
  },
};

export function getMaterialDetail(slug) {
  return materialDetails[slug] || null;
}
