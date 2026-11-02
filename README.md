# **Days on Purpose**

*Turn time into meaningful action.*

## ✨ Overview
Days on Purpose is a single-page application designed to help you frame your life around purposeful action. By entering your birth date, country, and gender, you can estimate your remaining "purpose days" in days, weeks, months, and years using life expectancy data. Focus on clarity, momentum, and investment—not fear or countdowns.

## ✨ Key Features
* **No Build or Runtime Dependencies**: Plain HTML, CSS, and JavaScript modules served as static files.
* **Private**: No data leaves your browser. No accounts, tracking, or third-party requests.
* **Life Expectancy Estimates**: Uses UN World Population Prospects 2024 life expectancy at birth (2023 estimates) for 237 countries and areas.
* **User-Friendly Interface**: Accessible and responsive UI designed for clarity and ease of use on any device.
* **Persistent Input**: Remembers your inputs for a seamless experience, ensuring you can return at any time.
* **Celebratory Messaging**: Provides uplifting messages when users exceed average life expectancy, reinforcing a positive outlook on life.
* **Gender-Specific Calculations**: Offers tailored calculations based on gender for more accurate results.
* **Mobile-First Design**: Responsive layout ensures a great experience on smartphones and tablets.

## 🚀 Getting Started
1. **Access the App**: Visit our [live demo](https://chiefinnovator.github.io/daysonpurpose/) to try it out directly in your browser.
2. **Input Your Details**: Enter your birth date, select your country, and choose your gender.
3. **Calculate**: Click the "Calculate" button to see your estimated remaining purpose days.

### Local Setup
To run the application locally:
1. Clone the repository:
    ```bash
    git clone https://github.com/ChiefInnovator/daysonpurpose.git
    ```
2. Navigate to the project directory:
    ```bash
    cd daysonpurpose
    ```
3. Serve the folder (ES modules do not load from `file://`): use VS Code Live Server (port 5501, configured in `.vscode/settings.json`) or run `python3 -m http.server` and open http://localhost:8000.

## 🏗️ Architecture
A static page with no build step. `index.html` holds the markup and CSS and loads `src/main.js` as an ES module.
- `src/config.js`: shared constants (365.2425 days per year, storage keys, data path).
- `src/calculator.js`: computes each unit from remaining years (pure).
- `src/provider.js`: loads and parses `data/lifeexpectancy.csv` and looks up a country (pure apart from `fetch`).
- `src/countries.js`: country aliases, browser-language country suggestion, and saved-form restore (pure).
- `src/ui.js`: form, result card, and live journey display (DOM).
- `src/main.js`: entry point.

### Tech Stack
- **Frontend**: HTML, CSS, JavaScript ES modules; no build
- **Data**: `data/lifeexpectancy.csv` from UN World Population Prospects 2024
- **Tests**: Node's built-in test runner

## 🧪 Tests
Requires Node 22 or later:
```bash
npm test
```

## 📊 Data
Regenerate the dataset from the UN source (Python 3, standard library only):
```bash
python3 scripts/build_dataset.py
```

## 🌿 Branching
Work on `feature/<name>` branches and open PRs into `develop`. Promote with a `develop` → `main` PR; merging to `main` publishes to GitHub Pages.

## 🤝 Contributing
We welcome contributions! Feel free to submit issues, suggestions, or pull requests to enhance the project.

## 📄 License
This project is licensed under the PolyForm Strict License 1.0.0. See [LICENSE](LICENSE).

---

### 🤖 Contact
- **Developer**: [Richard Crane](https://inventingfirewith.ai)
- **Email**: [rich@mill5.com](mailto:rich@mill5.com)

### 🌐 Related Links
- [MILL5](https://www.mill5.com) - An AI innovation company.
- [Microsoft MVP](https://mvp.microsoft.com/en-US/MVP/profile/10ce0bc0-7536-43f6-b28c-e9601a4a0d0d) - Rich has been a Microsoft Most Valued Professional for several years in AI, Azure, Developer Technologies, and DevOps — building with [Visual Studio Code](https://code.visualstudio.com) and shipping on [GitHub](https://github.com/ChiefInnovator) every day.
- [Visual Studio Code](https://code.visualstudio.com) - The editor behind this project.
- [GitHub](https://github.com/ChiefInnovator) - Source, releases, and issues.
- [Inventing Fire with AI](https://inventingfirewith.ai) - The website for the Inventing Fire with AI podcast.

---

Discover your remaining purpose-days and frame your life around clarity, focus, and momentum with **Days on Purpose**. ⏳

---

*Powered by [MILL5](https://www.mill5.com)*
*Built in [Visual Studio Code](https://code.visualstudio.com) and shipped on [GitHub](https://github.com/ChiefInnovator/daysonpurpose)*
*Explore Richard Crane on [Microsoft MVP](https://mvp.microsoft.com/en-US/MVP/profile/10ce0bc0-7536-43f6-b28c-e9601a4a0d0d)*
*Listen to the [Inventing Fire with AI](https://inventingfirewith.ai) podcast for insights on technology and innovation.*
*For support, contact: rich@mill5.com*


---

<sub>Powered by [RepoBeacon](https://repobeacon.com)</sub>
