// ===== CONFIG =====
var WEB3FORMS_KEY = 'e0035a00-9ab9-4b1f-9922-a5a8ec5c23d9';

// ===== MENU MOBILE =====
function toggleMenu(btn) {
  var links = document.getElementById('navLinks');
  var open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
    document.querySelector('.burger').setAttribute('aria-expanded', 'false');
  });
});

// ===== PRE-SELECTION BOUQUET =====
function selectBouquet(name) {
  var select = document.getElementById('bouquet');
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].text === name) { select.selectedIndex = i; break; }
  }
  document.getElementById('reserver').scrollIntoView({ behavior: 'smooth' });
  setTimeout(function() { document.getElementById('fname').focus({ preventScroll: true }); }, 650);
}

// ===== PHONE COUNTRY FLAG =====
(function() {
  var phone = document.getElementById('phone');
  var flag = document.getElementById('phoneFlag');
  var CODES = [
    ['+377','\u{1F1F2}\u{1F1E8}'],['+376','\u{1F1E6}\u{1F1E9}'],['+352','\u{1F1F1}\u{1F1FA}'],
    ['+351','\u{1F1F5}\u{1F1F9}'],['+212','\u{1F1F2}\u{1F1E6}'],['+213','\u{1F1E9}\u{1F1FF}'],
    ['+216','\u{1F1F9}\u{1F1F3}'],['+225','\u{1F1E8}\u{1F1EE}'],['+237','\u{1F1E8}\u{1F1F2}'],
    ['+221','\u{1F1F8}\u{1F1F3}'],['+242','\u{1F1E8}\u{1F1EC}'],
    ['+41','\u{1F1E8}\u{1F1ED}'],['+44','\u{1F1EC}\u{1F1E7}'],['+49','\u{1F1E9}\u{1F1EA}'],
    ['+34','\u{1F1EA}\u{1F1F8}'],['+39','\u{1F1EE}\u{1F1F9}'],['+32','\u{1F1E7}\u{1F1EA}'],
    ['+31','\u{1F1F3}\u{1F1F1}'],['+33','\u{1F1EB}\u{1F1F7}'],['+30','\u{1F1EC}\u{1F1F7}'],
    ['+36','\u{1F1ED}\u{1F1FA}'],['+40','\u{1F1F7}\u{1F1F4}'],['+43','\u{1F1E6}\u{1F1F9}'],
    ['+45','\u{1F1E9}\u{1F1F0}'],['+46','\u{1F1F8}\u{1F1EA}'],['+47','\u{1F1F3}\u{1F1F4}'],
    ['+48','\u{1F1F5}\u{1F1F1}'],['+90','\u{1F1F9}\u{1F1F7}'],['+55','\u{1F1E7}\u{1F1F7}'],
    ['+52','\u{1F1F2}\u{1F1FD}'],['+81','\u{1F1EF}\u{1F1F5}'],['+82','\u{1F1F0}\u{1F1F7}'],
    ['+86','\u{1F1E8}\u{1F1F3}'],['+91','\u{1F1EE}\u{1F1F3}'],['+61','\u{1F1E6}\u{1F1FA}'],
    ['+1','\u{1F1FA}\u{1F1F8}']
  ];
  function detectFlag(val) {
    var clean = val.replace(/[\s.()-]/g, '');
    if (clean.charAt(0) === '+') {
      for (var i = 0; i < CODES.length; i++) {
        if (clean.indexOf(CODES[i][0]) === 0) return CODES[i][1];
      }
    }
    if (/^0[1-9]/.test(clean) && clean.length >= 4) return '\u{1F1EB}\u{1F1F7}';
    return null;
  }
  phone.addEventListener('input', function() {
    var emoji = detectFlag(this.value);
    if (emoji) { flag.textContent = emoji; flag.classList.add('show'); }
    else { flag.classList.remove('show'); }
  });
})();

// ===== CUSTOM CALENDAR =====
(function() {
  var trigger = document.getElementById('dateTrigger');
  var dropdown = document.getElementById('calDropdown');
  var grid = document.getElementById('calGrid');
  var monthLabel = document.getElementById('calMonth');
  var hiddenInput = document.getElementById('date');
  var dateLabel = document.getElementById('dateLabel');
  var prevBtn = document.getElementById('calPrev');
  var nextBtn = document.getElementById('calNext');
  var marketSelect = document.getElementById('market');
  var MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  var MARKET_DAYS = {
    "L'Isle-sur-la-Sorgue (84) \u2014 Jeudi": [4],
    "L'Isle-sur-la-Sorgue (84) \u2014 Dimanche": [0],
    "Salon-de-Provence (13) \u2014 Mercredi": [3],
    "Pont-Saint-Esprit (30) \u2014 Samedi": [6]
  };
  function getAllowedDays() {
    return MARKET_DAYS[marketSelect.value] || null;
  }
  var currentMonth = tomorrow.getMonth();
  var currentYear = tomorrow.getFullYear();
  var selectedDate = null;
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function renderCalendar() {
    monthLabel.textContent = MONTHS_FR[currentMonth] + ' ' + currentYear;
    grid.innerHTML = '';
    var allowedDays = getAllowedDays();
    var firstDay = new Date(currentYear, currentMonth, 1);
    var startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var today = new Date(); today.setHours(0, 0, 0, 0);

    for (var i = 0; i < startDay; i++) {
      var empty = document.createElement('span');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }
    for (var d = 1; d <= daysInMonth; d++) {
      (function(day) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        btn.textContent = day;
        var thisDate = new Date(currentYear, currentMonth, day);
        thisDate.setHours(0, 0, 0, 0);
        var dayOfWeek = thisDate.getDay();
        if (thisDate < tomorrow || (allowedDays !== null && allowedDays.indexOf(dayOfWeek) === -1)) {
          btn.classList.add('disabled');
        }
        if (thisDate.getTime() === today.getTime()) btn.classList.add('today');
        if (selectedDate && thisDate.getTime() === selectedDate.getTime()) btn.classList.add('selected');
        btn.addEventListener('click', function() {
          selectedDate = thisDate;
          hiddenInput.value = currentYear + '-' + pad(currentMonth + 1) + '-' + pad(day);
          dateLabel.textContent = day + ' ' + MONTHS_FR[currentMonth] + ' ' + currentYear;
          trigger.classList.add('has-value');
          dropdown.classList.remove('open');
          renderCalendar();
        });
        grid.appendChild(btn);
      })(d);
    }
  }

  marketSelect.addEventListener('change', function() {
    selectedDate = null;
    hiddenInput.value = '';
    dateLabel.textContent = 'Choisir une date';
    trigger.classList.remove('has-value');
    if (dropdown.classList.contains('open')) renderCalendar();
  });
  trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) renderCalendar();
  });
  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });
  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
})();

// ===== PETAL RAIN =====
function petalRain() {
  var container = document.getElementById('petalRain');
  var petals = ['\u273F', '\u2740', '\u273E', '\u2741'];
  for (var i = 0; i < 35; i++) {
    var p = document.createElement('span');
    p.className = 'falling-petal';
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    p.style.animationDuration = (2.5 + Math.random() * 3) + 's';
    p.style.animationDelay = (Math.random() * 1.8) + 's';
    p.style.color = Math.random() > 0.5 ? '#CA1311' : '#FDA8A7';
    container.appendChild(p);
  }
  setTimeout(function() { container.innerHTML = ''; }, 7000);
}

// ===== FORM SUBMISSION =====
function submitReservation(e) {
  e.preventDefault();

  // Get fields by ID to avoid form.name collision
  var nameField = document.getElementById('fname');
  var phoneField = document.getElementById('phone');
  var bouquetField = document.getElementById('bouquet');
  var marketField = document.getElementById('market');
  var dateField = document.getElementById('date');
  var timeField = document.getElementById('time');
  var messageField = document.getElementById('message');
  var submitBtn = document.querySelector('.submit-btn');

  // Validate name
  var nameVal = nameField.value.trim();
  var nameLetters = nameVal.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if (nameLetters.length < 2 || new Set(nameLetters.toLowerCase()).size < 2) {
    nameField.setCustomValidity('Entrez un vrai prénom et nom (au moins 2 lettres différentes)');
    nameField.reportValidity();
    nameField.setCustomValidity('');
    return false;
  }

  // Validate phone
  var phoneDigits = phoneField.value.replace(/\D/g, '');
  if (phoneDigits.length < 7) {
    phoneField.setCustomValidity('Entrez un numéro valide (au moins 7 chiffres)');
    phoneField.reportValidity();
    phoneField.setCustomValidity('');
    return false;
  }

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours...';

  var data = {
    access_key: WEB3FORMS_KEY,
    subject: 'Nouvelle réservation \u2014 ' + bouquetField.value,
    from_name: 'Co & Son Provence',
    Nom: nameField.value,
    Telephone: phoneField.value,
    Bouquet: bouquetField.value,
    Marche: marketField.value,
    Date: dateField.value,
    Heure: timeField.value,
    Message: messageField.value.trim() || '(aucun message)'
  };

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    if (result.success) {
      document.getElementById('formSuccess').classList.add('show');
      petalRain();
      document.getElementById('reservationForm').reset();
      document.getElementById('dateLabel').textContent = 'Choisir une date';
      document.querySelector('.date-trigger').classList.remove('has-value');
      document.getElementById('phoneFlag').classList.remove('show');
    } else {
      alert('Erreur : ' + (result.message || 'Veuillez réessayer.'));
    }
  })
  .catch(function(err) {
    alert('Erreur de connexion. Vérifiez votre internet et réessayez.');
  })
  .finally(function() {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Envoyer ma réservation \u2192';
  });

  return false;
}

// ===== REVEAL ON SCROLL =====
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(en) {
    if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });

// ===== SCROLLSPY =====
var spyLinks = document.querySelectorAll('[data-spy]');
var spy = new IntersectionObserver(function(entries) {
  entries.forEach(function(en) {
    if (en.isIntersecting) {
      spyLinks.forEach(function(l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
['bouquets', 'histoire', 'marches', 'whatsapp'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) spy.observe(el);
});

// ===== BACK TO TOP =====
var topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', function() {
  topBtn.classList.toggle('show', window.scrollY > 700);
}, { passive: true });
