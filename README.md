# Live Weather App 🌤️

A clean, modern, and responsive web weather application built with HTML5, CSS3 (Glassmorphism), and vanilla JavaScript. Powered by the free, open-source **Open-Meteo API** (no API key required), it provides real-time current weather conditions and a 3-day daily forecast for any city worldwide.

![Weather App Preview](https://raw.githubusercontent.com/open-meteo/open-meteo/main/docs/logo.png)

---

## 🚀 Features

- **Live City Search**: Search for any city globally (e.g., Chennai, London, Tokyo, New York).
- **Current Weather Metrics**:
  - Live temperature in Celsius with large readable typography.
  - Wind speed in km/h.
  - Relative humidity percentage.
  - "Feels-like" apparent temperature.
  - Condition emoji (☀️, ⛅, 🌧️, ⛈️, ❄️, 🌫️) and descriptive status.
- **3-Day Daily Forecast**: Displays "Today", "Tomorrow", and the upcoming weekday with condition emojis and daily maximum/minimum temperatures.
- **Quick-City Selection**: 1-click shortcut buttons to instantly check weather for popular cities.
- **Keyboard Friendly**: Search triggers smoothly using either the "Get Weather" button or by pressing the **Enter** key.
- **Resilient Error Handling**: Friendly user-facing alerts for:
  - Empty search submissions.
  - Misspelled or unrecognized cities.
  - Offline mode or network connectivity loss.
- **Glassmorphic Aesthetic & Responsive Design**: Centered frosted-glass card, vibrant sky-blue gradient backdrop, and mobile-first touch optimization.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic document structure and accessible metadata.
- **CSS3**:
  - Modern Glassmorphism using `backdrop-filter: blur(...)` and semi-transparent RGBA borders.
  - Flexbox and CSS Grid layouts.
  - Custom font pairings (`Plus Jakarta Sans` for body, `JetBrains Mono` for tabular numerals).
  - Media queries for small screens and mobile devices.
- **JavaScript (ES6+)**:
  - Asynchronous HTTP requests using `fetch()` and `async/await`.
  - DOM manipulation and dynamic element creation.
  - Event listeners for click and keydown (`Enter`).
  - WMO weather code translation dictionary.

---

## 🌐 APIs Used

This project uses the **Open-Meteo API**, which is 100% free for open use and requires **no API key** or account registration.

### 1. Open-Meteo Geocoding API
Converts human city names into geographical latitude and longitude coordinates.
* **Endpoint**:
  ```text
  https://geocoding-api.open-meteo.com/v1/search?name={CITY_NAME}&count=1&language=en&format=json
  ```

### 2. Open-Meteo Weather Forecast API
Fetches live conditions and multi-day forecasts based on latitude and longitude coordinates.
* **Endpoint (Chennai Example)**:
  ```text
  https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto
  ```

---

## 💻 How to Run Locally

You can run this project locally without installing any complex frameworks or backend servers:

### Option 1: Direct Browser Launch
1. Clone or download this repository to your computer.
2. Locate the project folder containing `index.html`, `style.css`, and `script.js`.
3. Double-click **`index.html`** or right-click $\to$ **Open with** $\to$ **Google Chrome / Firefox / Safari / Edge**.

### Option 2: Using VS Code Live Server (Recommended)
1. Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions tab (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Right-click `index.html` and select **"Open with Live Server"**.
4. Your browser will automatically open at `http://127.0.0.1:5500/index.html`.

### Option 3: Using Node.js / NPX
If you have Node.js installed, open your terminal in the project directory and run:
```bash
npx serve .
```

---

## 🧪 Test Cases

| Test Case | Input | Expected Behavior |
| :--- | :--- | :--- |
| **Valid City** | `Chennai` | Weather card updates with Chennai's live temperature, wind speed, condition emoji, and 3-day forecast. |
| **Misspelled City** | `Zzzzqxyt` | Displays friendly alert: *"Sorry, we couldn't find 'Zzzzqxyt'. Please check the spelling and try again."* |
| **Empty Input** | ` ` (blank) | Displays alert: *"Please enter a city name to search."* Main card remains intact. |
| **No Internet / Offline** | Turn off Wi-Fi & search | Displays alert: *"You seem to be offline. Please check your internet connection."* |
| **Enter Key** | Type `Tokyo` + press Enter | Search executes immediately without requiring a mouse click. |
| **Quick Buttons** | Click `London` button | Input populates with "London" and triggers live fetch. |

---

## 📄 License

This project is open-source and free to use for personal, educational, and commercial purposes. Weather data courtesy of [Open-Meteo](https://open-meteo.com/).
