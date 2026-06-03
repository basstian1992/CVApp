export const formatRut = (rut: string): string => {
  // Remove any non-alphanumeric character
  let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  if (cleanRut.length === 0) return '';
  
  if (cleanRut.length <= 1) return cleanRut;

  const dv = cleanRut.slice(-1);
  const rutBody = cleanRut.slice(0, -1);
  
  // Format body with dots
  let formattedBody = '';
  for (let i = rutBody.length - 1, j = 1; i >= 0; i--, j++) {
    formattedBody = rutBody.charAt(i) + formattedBody;
    if (j % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody;
    }
  }

  return `${formattedBody}-${dv}`;
};

export const validateRut = (rut: string): boolean => {
  if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
  const [rutBody, dv] = rut.split('-');
  
  let t = parseInt(rutBody.replace(/\./g, ''), 10);
  let m = 0, s = 1;
  while (t > 0) {
    s = (s + t % 10 * (9 - m++ % 6)) % 11;
    t = Math.floor(t / 10);
  }
  const v = s > 0 ? '' + (s - 1) : 'K';
  return v === dv.toUpperCase();
};
