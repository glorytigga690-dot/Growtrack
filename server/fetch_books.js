const https = require('https');
const fs = require('fs');

const bookTitles = [
  "How to Win Friends and Influence People",
  "The 7 Habits of Highly Effective People",
  "Atomic Habits",
  "Man’s Search for Meaning",
  "Think and Grow Rich",
  "Meditations Marcus Aurelius",
  "The Power of Habit",
  "Influence Robert Cialdini",
  "Emotional Intelligence Daniel Goleman",
  "Daring Greatly",
  "You Are a Badass",
  "The Subtle Art of Not Giving a Fck*",
  "Mindset Carol Dweck",
  "The Alchemist",
  "Awaken the Giant Within",
  "The Four Agreements",
  "Flow Mihaly Csikszentmihalyi",
  "The Power of Now",
  "Grit Angela Duckworth",
  "Quiet Susan Cain",
  "The Road Less Traveled",
  "How to Stop Worrying and Start Living",
  "As a Man Thinketh",
  "The Miracle Morning",
  "Drive Daniel H. Pink",
  "The One Thing Gary Keller",
  "The 48 Laws of Power",
  "The Art of Happiness",
  "The Power of Your Subconscious Mind",
  "The Gifts of Imperfection",
  "The War of Art",
  "Getting Things Done",
  "The Confidence Code",
  "Presence Amy Cuddy",
  "The Magic of Thinking Big",
  "Mindfulness in Plain English",
  "The Compound Effect",
  "The Success Principles",
  "The Road to Character",
  "The Power of Positive Thinking",
  "The Seven Spiritual Laws of Success",
  "The Laws of Human Nature",
  "The Artist’s Way",
  "Emotional Agility",
  "The Slight Edge",
  "Who Moved My Cheese",
  "Boundaries Henry Cloud",
  "The Untethered Soul",
  "The Road to Character", 
  "50 Self-Help Classics"
];

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
};

async function fetchBooks() {
  const booksData = [];
  console.log("Fetching book data from Google Books API using https...");
  
  for (let title of bookTitles) {
    try {
      const url = "https://openlibrary.org/search.json?title=" + encodeURIComponent(title) + "&limit=1";
      const data = await fetchJson(url);
      
      if (data && data.docs && data.docs.length > 0) {
        const item = data.docs[0];
        const coverUrl = item.cover_i ? "https://covers.openlibrary.org/b/id/" + item.cover_i + "-L.jpg" : "https://via.placeholder.com/180x270?text=No+Cover";
        
        booksData.push({
          title: item.title,
          author: item.author_name ? item.author_name.join(', ') : 'Unknown Author',
          description: 'A classic self-help book to improve your life and mindset.',
          coverUrl: coverUrl,
          readLink: "https://openlibrary.org" + item.key
        });
        console.log("✅ Fetched: " + item.title);
      } else {
        booksData.push({
          title: title,
          author: 'Unknown',
          description: 'A classic self-help book to improve your life and mindset.',
          coverUrl: 'https://via.placeholder.com/180x270?text=No+Cover',
          readLink: "https://www.google.com/search?q=" + encodeURIComponent(title + " book")
        });
        console.log("❌ Not found: " + title);
      }
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error("Failed to fetch: " + title);
    }
  }

  const jsContent = `/**
 * GrowTrack — Knowledge Hub
 */

const knowledgeBooks = ${JSON.stringify(booksData, null, 2)};

async function renderKnowledge() {
  const container = document.getElementById('page-content');
  container.innerHTML = \`
    <div class="mb-lg animate-in">
      <h2 style="font-family:var(--font-heading);font-weight:800;">Knowledge Hub</h2>
      <p class="text-sm text-muted">A curated collection of the 50 greatest self-help books to fuel your personal growth.</p>
    </div>
    
    <div class="knowledge-grid" id="books-grid">
      \${knowledgeBooks.map((book, index) => \`
        <div class="book-card animate-in animate-in-delay-\${(index % 6) + 1}">
          <div class="book-cover-container" onclick="window.open('\${book.readLink}', '_blank')">
            <img src="\${book.coverUrl}" alt="\${book.title} Cover" loading="lazy" onerror="this.src='https://via.placeholder.com/180x270?text=Cover+Not+Found'">
          </div>
          <div class="book-info">
            <div class="book-title">\${book.title}</div>
            <div class="book-author">\${book.author}</div>
            <div class="book-desc">\${book.description}</div>
            <a href="\${book.readLink}" target="_blank" class="btn btn-primary btn-sm" style="width: 100%; margin-top: auto;">Read It</a>
          </div>
        </div>
      \`).join('')}
    </div>
  \`;
  
  if (window.lucide) lucide.createIcons();
}
`;

  fs.writeFileSync('../client/js/knowledge.js', jsContent);
  console.log("Successfully generated client/js/knowledge.js");
}

fetchBooks();
