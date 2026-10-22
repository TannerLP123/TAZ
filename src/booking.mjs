import { visibleStaff } from './schedule.mjs';
export function validateBooking(draft, bookings, role, person) {
  if (!visibleStaff(role, person).some(p => p.id === draft.staff)) return 'Choose a professional available in your schedule view.';
  if (!draft.customer.trim() || !draft.service.trim()) return 'Customer name and service are required.';
  if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) return 'Enter a valid email address or leave it blank.';
  if (!Number.isFinite(draft.price) || draft.price < 0 || draft.price > 100000 || Math.abs(draft.price * 100 - Math.round(draft.price * 100)) > 0.00001) return 'Enter a price between $0 and $100,000 with up to two decimal places.';
  if (!Number.isFinite(draft.start) || draft.start < 9 || draft.start % .5 || ![.5, 1, 1.5, 2].includes(draft.duration) || draft.start + draft.duration > 17) return 'Choose a time and duration between 9 AM and 5 PM.';
  if (bookings.some(a => a.id !== draft.id && a.staff === draft.staff && draft.start < a.start + a.duration && draft.start + draft.duration > a.start)) return 'This professional already has an appointment at that time. Choose another time.';
  return '';
}
export function firstAvailable(bookings, staffId, duration = 1) {
  for (let start = 9; start + duration <= 17; start += .5) {
    if (!bookings.some(a => a.staff === staffId && start < a.start + a.duration && start + duration > a.start)) return start;
  }
  return 9;
}
