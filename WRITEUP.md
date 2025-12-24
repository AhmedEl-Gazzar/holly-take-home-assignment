# Holly Engineering Take-Home Assignment - Writeup

## Approach

The application is a simple chat interface built with **Next.js** and **React**, using **server actions** to handle backend logic. Users can ask questions about jobs and salaries, and the system identifies the relevant job record and returns structured answers using the **Google Gemini API**.

The core backend logic uses a **deterministic, token-based matching algorithm** to identify the correct job based on user input. Once the job is identified, both the job description and salary information are passed to the LLM for structured response generation.

---

## Technologies Used

Aside from the default technologies (NextJS, Typescript, Tailwindcss, etc), the following additional technologies were used:

- **Google Gemini API** (LLM integration with structured output)
- **Zod** (schema validation for structured LLM responses)

No additional libraries were needed beyond the above.

---

## Key Decisions

- **Single-job assumption:** For simplicity and in line with the assignment requirements, each message is assumed to refer to a single job.
- **Dual intent handling:** Users may ask about both job information **and** salary in the same question. To support this, the system sends **all relevant job data** to the LLM once a job is identified. Intent classification was considered, but avoided to allow dual-intent queries without restricting the user.

---

## Matching Algorithm

The job matching algorithm works as follows:

1. **Preprocessing:** Both job data (title, jurisdiction, description) and user input are normalized and tokenized. Stop words are removed to reduce noise.
2. **Weighted token scoring:** Matches are scored based on token overlap across three fields, with assigned weights:

   - **Title** (weight: 6 – highest priority)
   - **Jurisdiction** (weight: 3 – medium priority)
   - **Description** (weight: 1 – lowest priority, used for disambiguation)

   This ensures that jobs with similar titles are correctly distinguished based on jurisdiction and additional description context, while still allowing the description to help resolve ambiguities.

3. **Job selection:** The highest-scoring job is selected. If multiple jobs tie for the highest score, the backend throws an error with a message prompting the user to provide more specific input. In a production system, this would trigger a clarification prompt.

**Rationale:**

- Some job titles are **not unique**, e.g., “Assistant Chief Probation Officer,” and jobs are truly identifiable only through a combination of title and jurisdiction.
- Descriptions provide additional disambiguation for titles with abbreviations or uncommon terms (e.g., “APCD Public Information Specialist” where APCD stands for Air Pollution Control District).
- Weighted scoring allows prioritization of title matches while still considering jurisdiction and description.

---

## Challenges and Limitations

- **Weight selection:** Determining reasonable weights for title, jurisdiction, and description required careful consideration. Initially, a power-of-10 weighting scheme (100 for title, 10 for jurisdiction, 1 for description) was tested, but this gave titles overwhelming influence, causing the system to occasionally prioritize title matches even when jurisdiction or description suggested a different job. After experimentation, the final weights were set to 6 (title), 3 (jurisdiction), and 1 (description), which provided a more balanced approach and improved the accuracy of job selection.
- **Token noise:** Some tokens in the input are not directly related to job fields or are less important, even after stop words were removed. For example, the word "Assistant" appears in many job titles. Occasionally, this caused some jobs to receive slightly boosted scores, but in practice it very rarely led to incorrect matches. This was not addressed in the final implementation, but a more customized tokenization strategy that recognizes and downweights specific tokens based on HR and Township context could handle this in the future.
- **Tied rankings:** In some cases, multiple jobs receive equal scores. For now, the system throws an error and the UI show an error message prompting the user to provide more specific input; in a production scenario, inline chat clarification would be prompted to user.
- **Data inconsistencies:** Some jurisdiction labels required aliasing, and the salary data contained inconsistencies such as extra whitespace. Also, one salary entry referenced job code `0265` in the `kerncounty` jurisdiction, while the corresponding job record listed `sdcounty`. This discrepancy was assumed to be an error.


---

## AI-assisted Work

- AI (ChatGPT) was used **to refine this writeup and improve README clarity**.
- The **`tokenize` function** used to preprocess user input and job data was **AI-generated** based on my initial implementation idea for assistance with regex:

```ts
function tokenize(text: string) {
  if (!text) return []

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .split(/\s+/) // Split by whitespace
    .filter(t => t && !STOPWORDS.has(t)) // Remove empty strings and stop words
}
```

- The system prompt (SYSTEM_INSTRUCTIONS) was initially written manually, then refined with AI assistance to improve clarity and completeness. The prompt ensures that the chatbot provides concise, structured, and accurate responses strictly based on the job description and compensation data, without introducing assumptions or external information.

- **All core implementation**, including server actions, weighted token scoring, job selection logic, and LLM integration, was written manually without AI assistance.
