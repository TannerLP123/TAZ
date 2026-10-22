import { staff } from './schedule.mjs';
// Demo identities only; replace with the authenticated session when sign-in exists.
export function demoIdentity(role, person) {
  return {
    name: role === 'professional' ? staff.find(p => p.id === person)?.name ?? '' : role === 'owner' ? 'Morgan Ellis' : 'Jamie Brooks',
    role: role === 'owner' ? 'Owner' : role === 'receptionist' ? 'Receptionist' : 'Professional',
  };
}
export function canConfirmCancellation(fields) {
  return ['name', 'role', 'reason'].every(key => typeof fields[key] === 'string' && fields[key].trim().length > 0);
}
