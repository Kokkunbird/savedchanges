export const CATEGORY_CONFIG = {
  armory: {
    title: "Armory",
    eyebrow: "Protection Layer",
    description:
      "Defensive builds, reinforced pieces, and ceremonial protection systems for identities that need a harder shell.",
    keywords: ["armory", "armour", "armor", "shield", "defense", "defence", "protection"],
  },
  arsenal: {
    title: "Arsenal",
    eyebrow: "Offensive Loadout",
    description:
      "Aggressive silhouettes, threat displays, and statement pieces engineered to feel confrontational on sight.",
    keywords: ["arsenal", "weapon", "blade", "sword", "knife", "offense", "offence"],
  },
  accessories: {
    title: "Accessories",
    eyebrow: "Signal Objects",
    description:
      "Small attachments, wearable details, and finishing components that complete the transformation.",
    keywords: ["accessories", "accessory", "charm", "strap", "ring", "chain", "add-on", "addon"],
  },
  apparel: {
    title: "Apparel",
    eyebrow: "Outer Identity",
    description:
      "Garments, uniforms, and soft goods designed to carry the character system beyond the mask itself.",
    keywords: ["apparel", "shirt", "hoodie", "jacket", "pants", "garment", "wear"],
  },
};

export const CATEGORY_ORDER = ["armory", "arsenal", "accessories", "apparel"];

export function normalizeCategory(value = "") {
  return value.trim().toLowerCase();
}

export function resolveProductCategory(product) {
  const metadataCategory = normalizeCategory(product?.metadata?.category);
  if (CATEGORY_CONFIG[metadataCategory]) {
    return metadataCategory;
  }

  const haystack = [product?.name, product?.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    CATEGORY_ORDER.find((slug) =>
      CATEGORY_CONFIG[slug].keywords.some((keyword) => haystack.includes(keyword))
    ) || null
  );
}
