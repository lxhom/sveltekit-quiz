export let normalize = (s: any) => s
    .toString()
    .toLowerCase()
    .replace(/[\s.,"'=?!]/g, '')
