import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { formatTime } from './schedule.mjs';
import { firstAvailable, validateBooking } from './booking.mjs';
export default function AppointmentEditor({ initial, people, bookings, role, person, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial);
  const [price, setPrice] = useState(String(initial.price));
  const [error, setError] = useState('');
  const update = (key, value) => { setDraft(d => ({ ...d, [key]: value })); setError(''); };
  const field = (label, key, extra = {}) => <View style={s.field}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} value={draft[key]} onChangeText={value => update(key, value)} style={s.input} {...extra} /></View>;
  const chip = (title, active, onPress, key = title) => <Pressable key={key} accessibilityRole="button" accessibilityState={{ selected: active }} aria-selected={active} onPress={onPress} style={[s.chip, active && s.active]}><Text style={[s.chipText, active && s.activeText]}>{title}</Text></Pressable>;
  return <View testID="appointment-editor"><Text style={s.eyebrow}>TODAY’S SCHEDULE</Text><View style={s.heading}><Text accessibilityRole="header" style={s.title}>{draft.id ? 'Edit appointment' : 'New appointment'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Cancel appointment changes" onPress={onCancel} style={s.cancel}><Text>✕</Text></Pressable></View><Text style={s.note}>Quick booking · Changes stay in this session until the app reloads.</Text>
    {field('Customer name', 'customer', { autoCapitalize: 'words', autoFocus: !draft.id })}
    {field('Email (optional)', 'email', { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false })}
    <Text style={s.label}>Professional</Text><View style={s.chips}>{people.map(p => chip(p.name, draft.staff === p.id, () => { setDraft(d => ({ ...d, staff: p.id, start: d.id ? d.start : firstAvailable(bookings, p.id, d.duration) })); setError(''); }, p.id))}</View>
    {field('Service', 'service')}
    <Text style={s.label}>Service price ($)</Text><TextInput accessibilityLabel="Service price in dollars" value={price} onChangeText={v => { setPrice(v); setError(''); }} keyboardType="decimal-pad" style={s.input} />
    <Text style={s.label}>Duration</Text><View style={s.chips}>{[.5,1,1.5,2].map(d => chip(`${d * 60} min`, draft.duration === d, () => update('duration', d)))}</View>
    <Text style={s.label}>Start time</Text><View style={s.chips}>{Array.from({length:16},(_,i)=>9+i*.5).map(t=>chip(formatTime(t),draft.start===t,()=>update('start',t)))}</View>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Pressable accessibilityRole="button" onPress={() => { const next = { ...draft, customer: draft.customer.trim(), service: draft.service.trim(), email: draft.email.trim(), price: price.trim() ? Number(price) : NaN }; const message = validateBooking(next, bookings, role, person); if (message) { setError(message); return; } onSave(next); }} style={s.save}><Text style={s.saveText}>Save appointment</Text></Pressable>
  </View>;
}
const s=StyleSheet.create({field:{marginBottom:4},eyebrow:{fontSize:10,letterSpacing:1.5,color:'#7B887C'},heading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:8},title:{fontSize:26,fontWeight:'600',color:'#243F35',flex:1},cancel:{width:44,height:44,alignItems:'center',justifyContent:'center',backgroundColor:'#F7F8F3',borderRadius:22},note:{fontSize:11,color:'#7B887C',lineHeight:18,marginVertical:14},label:{fontSize:12,color:'#243F35',marginTop:15,marginBottom:9},input:{borderWidth:1,borderColor:'#DDE5D4',borderRadius:7,padding:13,fontSize:16,color:'#243F35'},chips:{flexDirection:'row',flexWrap:'wrap',gap:7},chip:{borderWidth:1,borderColor:'#DDE5D4',minHeight:44,paddingHorizontal:12,justifyContent:'center',borderRadius:7},active:{backgroundColor:'#1C4D3C',borderColor:'#1C4D3C'},chipText:{color:'#243F35',fontSize:12},activeText:{color:'white'},error:{color:'#AA4433',fontSize:13,lineHeight:20,marginTop:18},save:{backgroundColor:'#1C4D3C',padding:17,alignItems:'center',borderRadius:8,marginTop:24},saveText:{color:'white',fontWeight:'600',fontSize:14}});
