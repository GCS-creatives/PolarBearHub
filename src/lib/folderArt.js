// Maps an admin-selected icon key (see ICON_OPTIONS in AdminCategories.jsx)
// to an illustrated folder-art PNG, if one has been supplied. Icons without
// matching art fall back to the coded CategoryIcon SVG glyph, so adding a
// new category/icon combination never breaks - it just looks a little
// plainer until matching art is dropped in the same folder.
const ART_ICONS = new Set(['calendar', 'chat', 'people', 'document', 'laptop', 'books', 'heart', 'star']);

export function hasFolderArt(icon) {
  return ART_ICONS.has(icon);
}

export function folderArtSrc(icon) {
  return `/images/folders/${icon}.png`;
}
