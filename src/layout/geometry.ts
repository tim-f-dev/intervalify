/** Choose an evenly filled grid with the largest square tiles that fit the available area. */
export function levelGridLayout(width: number, height: number, count = 20) {
  const gap = 8;
  let best = { columns: 5, rows: 4, side: 0, gap };
  for (const columns of [5, 4, 10, 2, 1]) {
    const rows = Math.ceil(count / columns);
    const side = Math.max(0, Math.floor(Math.min(132, (width - (columns - 1) * gap) / columns, (height - (rows - 1) * gap) / rows)));
    if (side > best.side) best = { columns, rows, side, gap };
  }
  return best;
}

/** Reflow the original notice into bounded pages without removing any words. */
export function paginateNotice(text: string, columns: number, rows: number): string[] {
  columns = Math.max(1, Math.floor(columns)); rows = Math.max(1, Math.floor(rows));
  const lines: string[] = [];
  for (let line of text.replace(/\r\n/g, '\n').split('\n')) {
    while (line.length > columns) {
      const space = line.lastIndexOf(' ', columns);
      const cut = space > 0 ? space : columns;
      lines.push(line.slice(0, cut));
      line = line.slice(cut + (space > 0 ? 1 : 0));
    }
    lines.push(line);
  }
  const pages: string[] = [];
  for (let start = 0; start < lines.length; start += rows) pages.push(lines.slice(start, start + rows).join('\n'));
  return pages.length ? pages : [''];
}
