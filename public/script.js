// ===== CONFIG : remplacez par votre numéro WhatsApp (format international, sans +) =====
const WHATSAPP_NUMBER = "33600000000";

// Menu mobile
function toggleMenu(btn){
  const links = document.getElementById('navLinks');
  const open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>{
    document.getElementById('navLinks').classList.remove('open');
    document.querySelector('.burger').setAttribute('aria-expanded','false');
  });
});

// Pré-sélection du bouquet depuis les cartes
function selectBouquet(name){
  const select = document.getElementById('bouquet');
  [...select.options].forEach(o=>{ if(o.text === name) select.value = o.text; });
  document.getElementById('reserver').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>document.getElementById('name').focus({preventScroll:true}), 650);
}

// ===== PHONE COUNTRY FLAG =====
(function(){
  const phone = document.getElementById('phone');
  const flag = document.getElementById('phoneFlag');

  // Prefix → flag emoji (longer prefixes first for correct matching)
  const CODES = [
    ['+377','🇲🇨'],['+376','🇦🇩'],['+352','🇱🇺'],['+351','🇵🇹'],
    ['+212','🇲🇦'],['+213','🇩🇿'],['+216','🇹🇳'],['+225','🇨🇮'],
    ['+237','🇨🇲'],['+221','🇸🇳'],['+242','🇨🇬'],
    ['+41','🇨🇭'],['+44','🇬🇧'],['+49','🇩🇪'],['+34','🇪🇸'],
    ['+39','🇮🇹'],['+32','🇧🇪'],['+31','🇳🇱'],['+33','🇫🇷'],
    ['+30','🇬🇷'],['+36','🇭🇺'],['+40','🇷🇴'],['+43','🇦🇹'],
    ['+45','🇩🇰'],['+46','🇸🇪'],['+47','🇳🇴'],['+48','🇵🇱'],
    ['+35','🇵🇹'],['+90','🇹🇷'],['+55','🇧🇷'],['+52','🇲🇽'],
    ['+81','🇯🇵'],['+82','🇰🇷'],['+86','🇨🇳'],['+91','🇮🇳'],
    ['+61','🇦🇺'],['+1','🇺🇸'],
  ];

  function detectFlag(val){
    const clean = val.replace(/[\s.()-]/g, '');
    // International format with +
    if(clean.startsWith('+')){
      for(const [prefix, emoji] of CODES){
        if(clean.startsWith(prefix)) return emoji;
      }
    }
    // French local format (06, 07, 01-05, 09)
    if(/^0[1-9]/.test(clean) && clean.length >= 4) return '🇫🇷';
    return null;
  }

  phone.addEventListener('input', function(){
    const emoji = detectFlag(this.value);
    if(emoji){
      flag.textContent = emoji;
      flag.classList.add('show');
    } else {
      flag.classList.remove('show');
    }
  });
})();

// ===== CUSTOM CALENDAR =====
(function(){
  const trigger = document.getElementById('dateTrigger');
  const dropdown = document.getElementById('calDropdown');
  const grid = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonth');
  const hiddenInput = document.getElementById('date');
  const dateLabel = document.getElementById('dateLabel');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  const marketSelect = document.getElementById('market');

  const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0,0,0,0);

  // Map market options to allowed JS days (0=Sunday … 6=Saturday)
  const MARKET_DAYS = {
    "L'Isle-sur-la-Sorgue (84) — Jeudi": [4],
    "L'Isle-sur-la-Sorgue (84) — Dimanche": [0],
    "Salon-de-Provence (13) — Mercredi": [3],
    "Pont-Saint-Esprit (30) — Samedi": [6]
  };

  function getAllowedDays(){
    const val = marketSelect.value;
    return MARKET_DAYS[val] || null; // null = no filter (no market selected)
  }

  let currentMonth = tomorrow.getMonth();
  let currentYear = tomorrow.getFullYear();
  let selectedDate = null;

  function pad(n){ return n < 10 ? '0'+n : ''+n; }

  function renderCalendar(){
    monthLabel.textContent = MONTHS_FR[currentMonth] + ' ' + currentYear;
    grid.innerHTML = '';

    const allowedDays = getAllowedDays();

    const firstDay = new Date(currentYear, currentMonth, 1);
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Monday = 0

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    // Empty cells before first day
    for(let i = 0; i < startDay; i++){
      const empty = document.createElement('span');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for(let d = 1; d <= daysInMonth; d++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = d;

      const thisDate = new Date(currentYear, currentMonth, d);
      thisDate.setHours(0,0,0,0);

      const dayOfWeek = thisDate.getDay();
      const isPast = thisDate < tomorrow;
      const isWrongDay = allowedDays !== null && !allowedDays.includes(dayOfWeek);

      if(isPast || isWrongDay){
        btn.classList.add('disabled');
      }

      if(thisDate.getTime() === today.getTime()){
        btn.classList.add('today');
      }

      if(selectedDate && thisDate.getTime() === selectedDate.getTime()){
        btn.classList.add('selected');
      }

      btn.addEventListener('click', function(){
        selectedDate = thisDate;
        const iso = currentYear + '-' + pad(currentMonth + 1) + '-' + pad(d);
        hiddenInput.value = iso;
        dateLabel.textContent = d + ' ' + MONTHS_FR[currentMonth] + ' ' + currentYear;
        trigger.classList.add('has-value');
        dropdown.classList.remove('open');
        renderCalendar();
      });

      grid.appendChild(btn);
    }
  }

  // Reset date when market changes
  marketSelect.addEventListener('change', function(){
    selectedDate = null;
    hiddenInput.value = '';
    dateLabel.textContent = 'Choisir une date';
    trigger.classList.remove('has-value');
    if(dropdown.classList.contains('open')) renderCalendar();
  });

  trigger.addEventListener('click', function(e){
    e.stopPropagation();
    dropdown.classList.toggle('open');
    if(dropdown.classList.contains('open')) renderCalendar();
  });

  prevBtn.addEventListener('click', function(e){
    e.stopPropagation();
    currentMonth--;
    if(currentMonth < 0){ currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  nextBtn.addEventListener('click', function(e){
    e.stopPropagation();
    currentMonth++;
    if(currentMonth > 11){ currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  document.addEventListener('click', function(e){
    if(!dropdown.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)){
      dropdown.classList.remove('open');
    }
  });
})();

// ===== PETAL RAIN ANIMATION =====
function petalRain(){
  const container = document.getElementById('petalRain');
  const petals = ['✿','❀','✾','❁','✿','❀'];
  const count = 35;

  for(let i = 0; i < count; i++){
    const petal = document.createElement('span');
    petal.className = 'falling-petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    petal.style.animationDuration = (2.5 + Math.random() * 3) + 's';
    petal.style.animationDelay = (Math.random() * 1.8) + 's';
    petal.style.color = Math.random() > 0.5 ? '#CA1311' : '#FDA8A7';
    container.appendChild(petal);
  }

  // Cleanup after animation
  setTimeout(()=>{
    container.innerHTML = '';
  }, 7000);
}

// Soumission → message WhatsApp pré-rempli (zéro backend)
function submitReservation(e){
  e.preventDefault();
  const f = e.target;

  // Validation nom : au moins 2 lettres distinctes, pas de répétition d'une seule lettre
  const nameVal = f.name.value.trim();
  const nameLetters = nameVal.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if(nameLetters.length < 2 || new Set(nameLetters.toLowerCase()).size < 2){
    f.name.focus();
    f.name.setCustomValidity('Entrez un vrai prénom et nom (au moins 2 lettres différentes)');
    f.name.reportValidity();
    f.name.setCustomValidity('');
    return false;
  }

  // Validation téléphone : au moins 7 chiffres (couvre international)
  const phoneVal = f.phone.value.trim();
  const phoneDigits = phoneVal.replace(/\D/g, '');
  if(phoneDigits.length < 7){
    f.phone.focus();
    f.phone.setCustomValidity('Entrez un numéro valide (au moins 7 chiffres)');
    f.phone.reportValidity();
    f.phone.setCustomValidity('');
    return false;
  }

  const lines = [
    '🌸 NOUVELLE RÉSERVATION — Co & Son Provence',
    '👤 ' + f.name.value,
    '📞 ' + f.phone.value,
    '💐 ' + f.bouquet.value,
    '📍 ' + f.market.value,
    '📅 ' + f.date.value + ' · ' + f.time.value
  ];
  if (f.message.value.trim()) lines.push('💬 ' + f.message.value.trim());
  lines.push('(Paiement sur place au retrait)');
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  document.getElementById('formSuccess').classList.add('show');
  petalRain();
  window.open(url, '_blank');
  return false;
}

// Reveal on scroll
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Scrollspy — souligne le lien de la section visible
const spyLinks = document.querySelectorAll('[data-spy]');
const spy = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      spyLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    }
  });
},{rootMargin:'-40% 0px -55% 0px'});
['bouquets','histoire','marches','whatsapp'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) spy.observe(el);
});

// Bouton retour en haut
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll',()=>{
  topBtn.classList.toggle('show', window.scrollY > 700);
},{passive:true});
