/** Local images bundled in /public — used as defaults*/

export const FLAVOR_LOCAL_IMAGES: Record<string, string> = {
  "classic-cinnamon": "/CR/CR_Classic.jpeg",
  tiramisu: "/CR/CR_Tiramissu.jpeg",
  "caramel-pecan": "/CR/CR_Caramel_Pecan.jpeg",
  lotus: "/CR/CR_Lotus.jpeg",
  oreo: "/CR/CR_Oreo.jpeg",
  "hot-chocolate": "/CR/CR_Hot_Choco.jpeg",
  "apple-pie": "/CR/CR_Apple_Pie.jpeg",
};

/** Transparent PNG cutouts for floating flavor strip. */
export const FLAVOR_CUTOUT_IMAGES: Record<string, string> = {
  "classic-cinnamon": "/CR-cutout/CR_Classic-cutout.png",
  tiramisu: "/CR-cutout/CR_Tiramissu-cutout.png",
  "caramel-pecan": "/CR-cutout/CR_Caramel_Pecan-cutout.png",
  lotus: "/CR-cutout/CR_Lotus-cutout.png",
  oreo: "/CR-cutout/CR_Oreo-cutout.png",
  "hot-chocolate": "/CR-cutout/CR_Hot_Choco-cutout.png",
  "apple-pie": "/CR-cutout/CR_Apple_Pie-cutout.png",
};

export const MINI_BOX_IMAGE = "/mini-box.jpeg";
export const MINI_BOX_CUTOUT = "/mini-box-cutout.png";
export const HERO_DEFAULT_IMAGE = MINI_BOX_CUTOUT;

/** Transparent cutouts for hero arch marquee (order matches flavor lineup). */
export const HERO_MARQUEE_IMAGES = [
  "/CR-cutout/CR_Classic-cutout.png",
  "/CR-cutout/CR_Tiramissu-cutout.png",
  "/CR-cutout/CR_Caramel_Pecan-cutout.png",
  "/CR-cutout/CR_Lotus-cutout.png",
  "/CR-cutout/CR_Oreo-cutout.png",
  "/CR-cutout/CR_Hot_Choco-cutout.png",
  "/CR-cutout/CR_Apple_Pie-cutout.png",
] as const;

export const BUNDLED_FLAVOR_IMAGES = Object.entries(FLAVOR_LOCAL_IMAGES).map(
  ([id, path]) => ({
    id,
    label: id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    path,
  }),
);
