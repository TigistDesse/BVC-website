(() => {
  const form = document.querySelector('#trail-form');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const message = document.querySelector('#form-message');
  const weather = document.querySelector('#weather-result');

  function setError(input, text) {
    const error = document.querySelector(`#${input.id}-error`);
    error.textContent = text;
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError(nameInput, name ? '' : 'Please enter your name.');
    setError(emailInput, !email ? 'Please enter your email address.' : (!validEmail ? 'Enter an email in a format like name@example.com.' : ''));
    if (!name || !validEmail) {
      message.textContent = 'Please fix the highlighted fields to continue.';
      message.classList.add('error');
      (!name ? nameInput : emailInput).focus();
      return;
    }
    const distance = document.querySelector('#length').value;
    message.textContent = `Thanks, ${name}! ${distance ? `We’ll look for a ${distance.toLowerCase()} route` : 'We’ll help you find a route'} for you. This demo keeps your details on this page.`;
    message.classList.remove('error');
  });

  [nameInput, emailInput].forEach((input) => input.addEventListener('input', () => setError(input, '')));

  async function loadWeather() {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.1784&longitude=-115.5708&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=celsius&timezone=America%2FEdmonton');
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      const current = data.current;
      const icons = {0:'☀',1:'🌤',2:'⛅',3:'☁',45:'🌫',48:'🌫',51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'🌧',71:'❄',73:'❄',75:'❄',80:'🌦',81:'🌧',82:'🌧',95:'⛈'};
      const descriptions = {0:'Clear skies',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Foggy',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorms'};
      const code = current.weather_code;
      weather.innerHTML = `<span class="weather-icon" aria-hidden="true">${icons[code] || '☁'}</span><span><strong>${Math.round(current.temperature_2m)}°C</strong> · ${descriptions[code] || 'Current conditions'}<br><small>Feels like ${Math.round(current.apparent_temperature)}°C in Banff</small></span>`;
    } catch {
      weather.innerHTML = '<span class="weather-icon" aria-hidden="true">🌲</span><span>Forecast is taking a breather. Check a local forecast before you head out.</span>';
    }
  }
  loadWeather();
})();
