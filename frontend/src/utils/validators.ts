export function validateEmail(email: string): string | null {
  if (!email) return 'E-posta adresi gereklidir';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Geçerli bir e-posta adresi girin';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Şifre gereklidir';
  if (password.length < 6) return 'Şifre en az 6 karakter olmalıdır';
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return 'İsim gereklidir';
  if (name.length < 2) return 'İsim en az 2 karakter olmalıdır';
  return null;
}

export function validatePrice(price: string | number): string | null {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num) || num <= 0) return 'Geçerli bir fiyat girin';
  return null;
}

export function validateRequired(value: string, field: string): string | null {
  if (!value || !value.trim()) return `${field} gereklidir`;
  return null;
}

export function validateUrl(url: string): string | null {
  if (!url) return null; // URL is optional
  try {
    new URL(url);
    return null;
  } catch {
    return 'Geçerli bir URL girin';
  }
}
