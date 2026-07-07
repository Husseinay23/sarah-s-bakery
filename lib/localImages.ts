/** Local images bundled in /public — used as defaults and for one-click Firestore sync. */

export const FLAVOR_LOCAL_IMAGES: Record<string, string> = {
  "classic-cinnamon": "/CR/CR_Classic.jpeg",
  tiramisu: "/CR/CR_Tiramissu.jpeg",
  "caramel-pecan": "/CR/CR_Caramel_Pecan.jpeg",
  lotus: "/CR/CR_Lotus.jpeg",
  oreo: "/CR/CR_Oreo.jpeg",
  "hot-chocolate": "/CR/CR_Hot_Choco.jpeg",
  "apple-pie": "/CR/CR_Apple_Pie.jpeg",
};

export const MINI_BOX_IMAGE = "/mini-box.jpeg";
export const HERO_DEFAULT_IMAGE = MINI_BOX_IMAGE;

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
