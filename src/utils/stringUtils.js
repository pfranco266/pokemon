export function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sanitizeFlavorText(text) {
    if (!text) return '';
    return text
        .replace(/[\f\n]/g, ' ')          // form feed + newline → space
        .replace(/\u00AD/g, '')           // soft hyphen → removed
        .replace(/[\u2190-\u21FF]/g, '')  // unicode arrows (←↑→↓ etc.) → removed
        .replace(/  +/g, ' ')             // collapse multiple spaces
        .trim();
}
