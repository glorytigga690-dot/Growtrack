/**
 * GrowTrack — Knowledge Hub
 */

const knowledgeBooks = [
  {
    "title": "How to Win Friends and Influence People",
    "author": "Dale Carnegie",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/13314878-L.jpg",
    "readLink": "https://openlibrary.org/works/OL1063267W"
  },
  {
    "title": "The 7 Habits of Highly Effective People",
    "author": "Stephen R. Covey, Sean Covey",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/10079937-L.jpg",
    "readLink": "https://openlibrary.org/works/OL2629977W"
  },
  {
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/12539702-L.jpg",
    "readLink": "https://openlibrary.org/works/OL17930368W"
  },
  {
    "title": "Man's Search for Meaning adapted for Young Adults [adaptation]",
    "author": "Viktor E. Frankl",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/11203708-L.jpg",
    "readLink": "https://openlibrary.org/works/OL24557376W"
  },
  {
    "title": "Think and Grow Rich",
    "author": "Napoleon Hill",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/14542536-L.jpg",
    "readLink": "https://openlibrary.org/works/OL527464W"
  },
  {
    "title": "The Meditations of Marcus Aurelius",
    "author": "Marcus Aurelius, Jeremy Collier",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/10994538-L.jpg",
    "readLink": "https://openlibrary.org/works/OL24429090W"
  },
  {
    "title": "The Power of Habit",
    "author": "Charles Duhigg",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/9078085-L.jpg",
    "readLink": "https://openlibrary.org/works/OL16015154W"
  },
  {
    "title": "Summary : Influence by Robert Cialdini",
    "author": "Alpha Minds",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL37492786W"
  },
  {
    "title": "Resumen de Inteligencia Emocional ( Emotional Intelligence ) - de Daniel Goleman",
    "author": "Sapiens Editorial",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL29548458W"
  },
  {
    "title": "Daring Greatly",
    "author": "Brené Brown",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7367250-L.jpg",
    "readLink": "https://openlibrary.org/works/OL16664399W"
  },
  {
    "title": "You Are a Badass",
    "author": "Jen Sincero",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7436635-L.jpg",
    "readLink": "https://openlibrary.org/works/OL17102197W"
  },
  {
    "title": "The Subtle Art of Not Giving a F*ck",
    "author": "Mark Manson",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/8231990-L.jpg",
    "readLink": "https://openlibrary.org/works/OL17590212W"
  },
  {
    "title": "Summary of Mindset by Carol Dweck",
    "author": "Speed Read Publishing",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL25592741W"
  },
  {
    "title": "The Alchemist, 1612",
    "author": "Ben Jonson, Elizabeth Cook",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7463992-L.jpg",
    "readLink": "https://openlibrary.org/works/OL1085186W"
  },
  {
    "title": "Awaken the Giant Within",
    "author": "Tony Robbins",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/406852-L.jpg",
    "readLink": "https://openlibrary.org/works/OL3749279W"
  },
  {
    "title": "The Four Agreements",
    "author": "Don Miguel Ruiz",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/924521-L.jpg",
    "readLink": "https://openlibrary.org/works/OL27203W"
  },
  {
    "title": "Flow Mihaly Csikszentmihalyi",
    "author": "Unknown",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://www.google.com/search?q=Flow%20Mihaly%20Csikszentmihalyi%20book"
  },
  {
    "title": "The Power of Now",
    "author": "Eckhart Tolle",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/551262-L.jpg",
    "readLink": "https://openlibrary.org/works/OL5727686W"
  },
  {
    "title": "Summary and Detail Review of Grit by Angela Duckworth",
    "author": "pressprint",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL26715826W"
  },
  {
    "title": "Susan Cain : Quiet",
    "author": "Susan Cain",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL31906588W"
  },
  {
    "title": "The Road Less Traveled",
    "author": "M. Scott Peck",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/4434829-L.jpg",
    "readLink": "https://openlibrary.org/works/OL2868914W"
  },
  {
    "title": "How to Stop Worrying and Start Living",
    "author": "Dale Carnegie, Kaneiji Dale",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/10829208-L.jpg",
    "readLink": "https://openlibrary.org/works/OL1063338W"
  },
  {
    "title": "As a man thinketh",
    "author": "James Allen",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/6268048-L.jpg",
    "readLink": "https://openlibrary.org/works/OL43024W"
  },
  {
    "title": "The Miracle Morning",
    "author": "Hal, Austin Elrod",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/8539416-L.jpg",
    "readLink": "https://openlibrary.org/works/OL19629024W"
  },
  {
    "title": "Summary of Drive by Daniel H Pink",
    "author": "Jeremy Y. Peterson",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL29518796W"
  },
  {
    "title": "The One Thing: The Suprisingly Simple Truth Behind Extraordinary Results [Jul 04, 2013] Keller, Gary and Papasan, Jay",
    "author": "gary keller",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/8757842-L.jpg",
    "readLink": "https://openlibrary.org/works/OL20092720W"
  },
  {
    "title": "The 48 Laws of Power",
    "author": "Robert Greene",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/6424160-L.jpg",
    "readLink": "https://openlibrary.org/works/OL1968368W"
  },
  {
    "title": "The art of happiness",
    "author": "His Holiness Tenzin Gyatso the XIV Dalai Lama, Howard C. Cutler",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/6671211-L.jpg",
    "readLink": "https://openlibrary.org/works/OL318761W"
  },
  {
    "title": "The Power of Your Subconscious Mind",
    "author": "Joseph Murphy",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/6553019-L.jpg",
    "readLink": "https://openlibrary.org/works/OL55806W"
  },
  {
    "title": "The Gifts of Imperfection",
    "author": "Brené Brown",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7237826-L.jpg",
    "readLink": "https://openlibrary.org/works/OL16010306W"
  },
  {
    "title": "The War of Art",
    "author": "Steven Pressfield",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/288439-L.jpg",
    "readLink": "https://openlibrary.org/works/OL497483W"
  },
  {
    "title": "Getting Things Done",
    "author": "David Allen, David Allen, David Allen",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/109288-L.jpg",
    "readLink": "https://openlibrary.org/works/OL271504W"
  },
  {
    "title": "The Confidence Code",
    "author": "Katty Kay, Claire Shipman",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7754579-L.jpg",
    "readLink": "https://openlibrary.org/works/OL17526448W"
  },
  {
    "title": "Resumen de el Poder de la Presencia - de Amy Cuddy : (Presence)",
    "author": "Sapiens Editorial",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL29750311W"
  },
  {
    "title": "The Magic of Thinking Big",
    "author": "David Joseph Schwartz",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/480539-L.jpg",
    "readLink": "https://openlibrary.org/works/OL1906484W"
  },
  {
    "title": "Mindfulness in Plain English",
    "author": "Bhante H. Gunaratana",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/652683-L.jpg",
    "readLink": "https://openlibrary.org/works/OL8666082W"
  },
  {
    "title": "The Compound effect",
    "author": "Darren Hardy",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7115046-L.jpg",
    "readLink": "https://openlibrary.org/works/OL16118274W"
  },
  {
    "title": "The Success Principles",
    "author": "Jack Canfield, Janet Switzer",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/31560-L.jpg",
    "readLink": "https://openlibrary.org/works/OL3180509W"
  },
  {
    "title": "The Road to Character",
    "author": "David Brooks",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7442841-L.jpg",
    "readLink": "https://openlibrary.org/works/OL17364754W"
  },
  {
    "title": "The Power of Positive Thinking",
    "author": "Norman Vincent Peale",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/14570194-L.jpg",
    "readLink": "https://openlibrary.org/works/OL2917168W"
  },
  {
    "title": "The Seven Spiritual Laws of Success",
    "author": "Deepak Chopra",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/6632013-L.jpg",
    "readLink": "https://openlibrary.org/works/OL548626W"
  },
  {
    "title": "The Laws of Human Nature",
    "author": "Robert Greene",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/10170095-L.jpg",
    "readLink": "https://openlibrary.org/works/OL19761410W"
  },
  {
    "title": "The Artist's Way",
    "author": "Julia Cameron",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/10840008-L.jpg",
    "readLink": "https://openlibrary.org/works/OL14856321W"
  },
  {
    "title": "Emotional Agility",
    "author": "Susan David",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/8906617-L.jpg",
    "readLink": "https://openlibrary.org/works/OL20250601W"
  },
  {
    "title": "The Slight Edge",
    "author": "Jeff Olson, John David Mann",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/8532947-L.jpg",
    "readLink": "https://openlibrary.org/works/OL19605293W"
  },
  {
    "title": "Who Moved My Cheese?",
    "author": "Spencer Johnson",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/258839-L.jpg",
    "readLink": "https://openlibrary.org/works/OL1864135W"
  },
  {
    "title": "Summary of Boundaries by Henry Cloud",
    "author": "Bookhabits",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://via.placeholder.com/180x270?text=No+Cover",
    "readLink": "https://openlibrary.org/works/OL38219994W"
  },
  {
    "title": "The untethered soul",
    "author": "Michael A. Singer",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/10630553-L.jpg",
    "readLink": "https://openlibrary.org/works/OL15845722W"
  },
  {
    "title": "The Road to Character",
    "author": "David Brooks",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/7442841-L.jpg",
    "readLink": "https://openlibrary.org/works/OL17364754W"
  },
  {
    "title": "50 Self-Help Classics",
    "author": "Tom Butler-Bowdon",
    "description": "A classic self-help book to improve your life and mindset.",
    "coverUrl": "https://covers.openlibrary.org/b/id/910300-L.jpg",
    "readLink": "https://openlibrary.org/works/OL8998226W"
  }
];

async function renderKnowledge() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="mb-lg animate-in">
      <h2 style="font-family:var(--font-heading);font-weight:800;">Knowledge Hub</h2>
      <p class="text-sm text-muted">A curated collection of the 50 greatest self-help books to fuel your personal growth.</p>
    </div>
    
    <div class="knowledge-grid" id="books-grid">
      ${knowledgeBooks.map((book, index) => `
        <div class="book-card animate-in animate-in-delay-${(index % 6) + 1}">
          <div class="book-cover-container" onclick="window.open('${book.readLink}', '_blank')">
            <img src="${book.coverUrl}" alt="${book.title} Cover" loading="lazy" onerror="this.src='https://via.placeholder.com/180x270?text=Cover+Not+Found'">
          </div>
          <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-desc">${book.description}</div>
            <a href="${book.readLink}" target="_blank" class="btn btn-primary btn-sm" style="width: 100%; margin-top: auto;">Read It</a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  if (window.lucide) lucide.createIcons();
}
