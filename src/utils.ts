
export function randomUUID() {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getVisiblePages(current: number, total: number) {

    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);

    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    if (start > 2) {
        rangeWithDots.push(1, "...");
    } else {
        rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (end < total - 1) {
        rangeWithDots.push("...", total);
    } else if (total > 1) {
        rangeWithDots.push(total);
    }

    return rangeWithDots;
}