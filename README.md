

### 🧠 Professor Recommendation RAG App

A **Retrieval-Augmented Generation (RAG)** web application designed to help students find professor recommendations based on custom input criteria (e.g., teaching quality, difficulty, clarity).

#### 🚀 Key Features:

* **Natural Language Processing (NLP)** is used to interpret and extract intent from student queries.
* Integrates **vector search algorithms** with **Pinecone** to retrieve the most relevant professor profiles based on semantic similarity.
* Allows users to **submit RateMyProfessor URLs**, which are then **scraped and embedded** as dense vectors into the Pinecone index.
* Dynamically surfaces top-matching professors using **cosine similarity** over vectorized metadata and review content.
* The app leverages **OpenAI's language models** to refine search results and generate explainable, human-like responses.

#### 🧰 Stack:

* **Frontend:** React
* **Backend:** Python 
* **NLP & Embeddings:** OpenAI  + Pinecone text empeddings
* **Vector Database:** Pinecone
* **Scraping:** BeautifulSoup / Playwright

#### 📌 Impact:

This tool simplifies course planning by offering smart, personalized faculty recommendations. It also allows crowdsourced expansion of the database through user-submitted RateMyProfessor profiles, making the system scalable and community-driven.
