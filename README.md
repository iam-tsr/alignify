<!-- <img src="frontend/src/assets/images/logo/alignify-logo-wht.png" alt="Description of image" style="display: block; margin: auto; width: 30%;"/> -->

<div align="center">

[<img src="frontend/src/assets/images/logo/alignify-logo-wht.png" alt="Logo of alignify" style="width:150px;">](https://alignify-app.vercel.app/)

---

**AI-powered employee engagement platform**

[![deploy](https://img.shields.io/github/actions/workflow/status/actions/toolkit/unit-tests.yml?color=%23dbeafe
)](https://github.com/iam-tsr/alignify/actions/workflows/docker-image.yml)
[![Maintainers](https://img.shields.io/badge/maintainers-1-success.svg?color=%230077FF)](#maintainers)
[![GitHub contributors](https://img.shields.io/github/contributors/iam-tsr/alignify.svg?color=%230077FF)](https://github.com/alshedivat/al-folio/graphs/contributors/)
[![GitHub license](https://img.shields.io/github/license/iam-tsr/alignify?color=red)](https://github.com/iam-tsr/alignify/blob/main/LICENSE)
<!-- [![GitHub stars](https://img.shields.io/github/stars/iam-tsr/alignify)](https://github.com/iam-tsr/alignify/stargazers) -->
<!-- [![GitHub forks](https://img.shields.io/github/forks/iam-tsr/alignify)](https://github.com/iam-tsr/alignify/fork) -->

<!-- [![Code Wiki](https://img.shields.io/badge/Code_Wiki-ask_about_repo-blue?logo=googlegemini)](https://codewiki.google/github.com/iam-tsr/alignify) -->
<!-- [![DeepWiki](https://img.shields.io/badge/DeepWiki-ask_about_repo-lightcyan)](https://deepwiki.com/iam-tsr/alignify) -->

[Survey Page](https://alignify-app.vercel.app/) | [Dashboard](https://alignify-app.vercel.app/analytics/dashboard.html)

</div>

## PROJECT DOCUMENT
### Introduction
Employees are central to a company’s success, especially when they enjoy their work, workplace environment, and the people they work with. Alignify helps close the communication gap between employees and employers by conducting anonymous surveys.

### Problem Statement and Justification

A lack of effective employee management in many organizations results in reduced work quality, employee attrition, and significant losses for companies. Alignify provides a safe space for employees to share concerns they might never express directly to management. This approach is not about rebellion, but about understanding and addressing issues that could otherwise harm the organization’s reputation.

### Project Scope and Strategy

This project contains a survey panel where personnel can answer a number of questions and provide anonymous feedback. It will be examined after passing via the Alignify automated system. Employers or management can access the data through a dashboard that provides a graphic representation of data insights and AI-generated suggestions for improvements. This will assist in identifying the areas in which employees are most struggling.

Thus far, we have employed two models for automation: the Qwen model for question generation and the DistilBERT model for employee feedback classification for analytics. The synthetic data used to fine-tune both models was produced by other LLMs. Both models are now operating on CPU rather than GPU since we have to quantize and improve inference. Ten questions may be generated in approximately 8 seconds or less, while text classification takes approximately 2 seconds.

Since the project is currently in its early development stage, we have decided to release a beta version for suggestions and contribution perspectives.


### Project Activities

The functionality of automation system:
- Weekly question update and mailing employees the survey link.
- AI generated improvement suggestions.
- Automate data generalization and analysis. And much more...

### Impact

This project aligns closely with the vision of “For the people, by the people,” which is why we chose to make it open source. The challenge we are addressing serves the best interests of individuals. Alignify gives employees a voice, and its name symbolizes the critical balance and alignment between professional and personal life.
