# 🎭 Playwright Hybrid Testing Framework

[![Playwright](https://img.shields.io/badge/Playwright-v1.40+-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Allure Report](https://img.shields.io/badge/Allure_Report-Automated-orange?style=for-the-badge&logo=qameta)](https://allurereport.org/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Slack Notification](https://img.shields.io/badge/Slack-Block_Kit-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://slack.com/)

A production-ready hybrid automated testing framework built with **Playwright** and **TypeScript** targeting the [Conduit (RealWorld)](https://conduit.bondaracademy.com) platform. Designed with enterprise-level patterns, this project demonstrates scalable E2E and API testing architectures decoupled from application source code.

---

## 🚀 Key Highlights

* **Hybrid Testing Strategy:** Unified execution of HTTP REST API validations and browser-based end-to-end UI journeys.
* **Authentication Session Reuse (`storageState`):** Performs single authentication during test setup and persists session state to eliminate redundant login operations across test workers.
* **Strict Page Object Model (POM):** Enforces a clean separation between interaction locators and test assertions for maintainability.
* **Enterprise Reporting Dashboard:** Generates clean **Allure Reports** deployed automatically to **GitHub Pages**.
* **Automated Alerting:** Dispatches rich execution summaries with metrics (Passed/Failed/Skipped) and dynamic dashboard links via **Slack Block Kit**.
* **Automated AI Code Review:** Integrated with **CodeRabbit AI** using custom SDET rules to enforce testing anti-pattern prevention on Pull Requests.

---

## 📁 Architecture & Project Structure

```text
├── .auth/                          # Stored browser authentication state (git-ignored)
├── .github/
│   └── workflows/
│       └── e2e-pipeline.yml        # CI/CD pipeline (Test, Allure deploy, Slack notification)
├── api/                            # Reusable API HTTP clients and endpoint services
├── fixtures/                       # Custom Playwright test fixtures and test data setup
├── pages/                          # Page Object Model (POM) representations
├── scripts/
│   └── slack-notifier.js           # Custom Node.js ES Module notifier for Slack Block Kit
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts           # Pre-test authentication runner
│   ├── api/
│   │   └── connection.spec.ts      # REST API endpoint test suites
│   └── e2e/
│       ├── auth/                   # Unauthenticated user journeys
│       └── articles/               # Authenticated business flows (CRUD)
├── .coderabbit.yaml                # AI Code Review guidelines for QA patterns
├── playwright.config.ts            # Core Playwright configuration & project matrix
└── tsconfig.json                   # Path mappings and TypeScript compiler rules