# **Days on Purpose**

*Turn time into meaningful action.*

## ✨ Overview
Days on Purpose is a single-page application designed to help you frame your life around purposeful action. By entering your birth date, country, and gender, you can estimate your remaining "purpose days" in days, weeks, months, and years using life expectancy data. Focus on clarity, momentum, and investment—not fear or countdowns.

## ✨ Key Features
* **No Dependencies**: A simple, zero-dependency web application that runs smoothly in any modern browser.
* **Life Expectancy Estimates**: Utilizes a comprehensive life expectancy dataset to provide customized estimates tailored to your demographic.
* **User-Friendly Interface**: Accessible and responsive UI designed for clarity and ease of use on any device.
* **Persistent Input**: Remembers your inputs for a seamless experience, ensuring you can return at any time.
* **Fallback Dataset**: Automatically switches to an embedded dataset if the primary data source fails, ensuring reliability.
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
3. Open `index.html` in a modern browser.

## 🏗️ Architecture
The application is built using TypeScript and React, structured to provide a clean separation of concerns. Key files include:
- `src/components/App.tsx`: The main application component.
- `src/lib/calculator.ts`: Contains the logic for calculating life expectancy and remaining days.
- `src/providers/expectancyProvider.ts`: Manages the life expectancy data fetching and caching.

### Tech Stack
- **Frontend**: TypeScript, React
- **Styling**: CSS
- **Data Handling**: CSV for life expectancy data

## 🤝 Contributing
We welcome contributions! Feel free to submit issues, suggestions, or pull requests to enhance the project.

## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

---

### 🤖 Contact
- **Developer**: [Richard Crane](https://inventingfirewith.ai)
- **Email**: [rich@mill5.com](mailto:rich@mill5.com)

### 🌐 Related Links
- [Microsoft MVP](https://mvp.microsoft.com/en-US/MVP/profile/10ce0bc0-7536-43f6-b28c-e9601a4a0d0d) - Rich has been a Microsoft Most Valued Professional for several years now in AI, Azure, Dev, DevOps, and more.
- [Inventing Fire with AI](https://inventingfirewith.ai) - The website for the Inventing Fire with AI podcast.
- [MILL5](https://www.mill5.com) - An AI innovation company.

---

<sub>Powered by [Days on Purpose](https://chiefinnovator.github.io/daysonpurpose/)</sub>


---

<sub>Powered by [RepoBeacon](https://repobeacon.com)</sub>
