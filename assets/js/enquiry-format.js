/* One WhatsApp message layout for hotel and guide enquiries. No data is sent here. */
window.ZUNGU_ENQUIRY = (() => {
  const clean=value=>String(value == null ? '' : value).replace(/\r\n?/g,'\n').trim();
  function message({title,body=[],details=[],items=[],reference}) {
    const sections=['ZUNGU HOTEL\n'+clean(title),'Hello Zungu Hotel,'];
    const copy=body.map(clean).filter(Boolean).join('\n\n');
    if(copy)sections.push(copy);
    const fields=details.filter(([,value])=>clean(value));
    const line=([label,value])=>label+': '+clean(value);
    const stayLabels=['Check-in','Check-out','Nights'];
    const partyLabels=['Guests','Rooms'];
    const general=fields.filter(([label])=>!stayLabels.includes(label)&&!partyLabels.includes(label)&&label!=='Notes');
    if(general.length)sections.push(general.map(line).join('\n'));
    const stay=fields.filter(([label])=>stayLabels.includes(label));
    if(stay.length)sections.push('STAY DETAILS\n'+stay.map(line).join('\n'));
    const party=fields.filter(([label])=>partyLabels.includes(label));
    if(party.length)sections.push(party.map(line).join('\n'));
    const notes=fields.find(([label])=>label==='Notes');
    if(notes)sections.push('NOTES\n'+clean(notes[1]));
    if(items.length)sections.push('SAVED PLACES\n'+items.map(value=>'• '+clean(value)).join('\n\n'));
    sections.push('Thank you.');
    if(reference)sections.push('Reference: ['+reference+']');
    return sections.join('\n\n');
  }
  const url=options=>'https://wa.me/255766003050?text='+encodeURIComponent(message(options));
  return {message,url};
})();
