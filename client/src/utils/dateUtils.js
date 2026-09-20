/**
 * Converts Date or date string to DD/MM/YYYY
 */
export const formatDateToDDMMYYYY = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parses DD/MM/YYYY string to Date object
 */
export const parseDDMMYYYY = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.trim().split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (month < 1 || month > 12) return null;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;

  return new Date(year, month - 1, day);
};

/**
 * Validates a date string
 */
export const validateDate = (dateString, allowFuture = true) => {
  if (!dateString || !dateString.trim()) {
    return { valid: false, message: 'Please enter or select a Date of Birth.' };
  }

  const dateObj = parseDDMMYYYY(dateString);
  if (!dateObj) {
    return { valid: false, message: 'Invalid date. Format must be DD/MM/YYYY.' };
  }

  if (!allowFuture) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (dateObj > today) {
      return { valid: false, message: 'Date of Birth cannot be in the future.' };
    }
  }

  return { valid: true, dateObj };
};
