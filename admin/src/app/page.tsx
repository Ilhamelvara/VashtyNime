'use client';

import React, { useState } from 'react';

// Interfaces for our state elements
interface AnimeItem {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  bannerUrl: string;
  genre: string[];
  rating: number;
  status: string;
  episodesCount: number;
}

interface EpisodeItem {
  id: string;
  animeId: string;
  episodeNumber: number;
  videoUrl: string;
  duration: string;
  thumbnail: string;
}

// Initial Mock data for visual completeness
const INITIAL_ANIME: AnimeItem[] = [
  {
    id: 'a87e4c19-1111-4444-8888-79715433b8a1',
    title: 'Solo Leveling Season 2',
    description: 'In a world where hunters must battle deadly monsters to protect mankind, Sung Jinwoo, the weakest hunter, receives an ultimate power.',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    genre: ['Action', 'Fantasy', 'Adventure'],
    rating: 9.25,
    status: 'ONGOING',
    episodesCount: 12
  },
  {
    id: 'b12c4c19-2222-4444-8888-79715433b8a2',
    title: 'Demon Slayer: Infinity Castle',
    description: 'Tanjirou and the Demon Slayer corps assemble for the final, ultimate showdown inside Muzan Kibutsuji\'s hyper-dimensional Infinity Castle.',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    genre: ['Action', 'Historical', 'Shounen'],
    rating: 9.80,
    status: 'ONGOING',
    episodesCount: 3
  },
  {
    id: 'c34e4c19-3333-4444-8888-79715433b8a3',
    title: 'One Piece: Egghead Island',
    description: 'The Straw Hat Pirates arrive at the futuristic island of Egghead, home of the genius scientist Dr. Vegapunk, triggering global wars.',
    coverUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    genre: ['Adventure', 'Fantasy', 'Comedy'],
    rating: 9.42,
    status: 'ONGOING',
    episodesCount: 1105
  },
  {
    id: 'd56f4c19-4444-4444-8888-79715433b8a4',
    title: 'Frieren: Beyond Journey\'s End',
    description: 'Elf mage Frieren and her courageous companions defeated the Demon King, embarking on a deep retrospective journey years later.',
    coverUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80',
    genre: ['Drama', 'Fantasy', 'Adventure'],
    rating: 9.94,
    status: 'COMPLETED',
    episodesCount: 28
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'cache'>('dashboard');
  
  // Simulated State Database
  const [animeList, setAnimeList] = useState<AnimeItem[]>(INITIAL_ANIME);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  
  // Notifications/Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Anime Form State
  const [animeTitle, setAnimeTitle] = useState('');
  const [animeDesc, setAnimeDesc] = useState('');
  const [animeCover, setAnimeCover] = useState('');
  const [animeBanner, setAnimeBanner] = useState('');
  const [animeGenres, setAnimeGenres] = useState('');
  const [animeRating, setAnimeRating] = useState('8.5');
  const [animeStatus, setAnimeStatus] = useState('ONGOING');

  // 2. Episode Form State
  const [selectedAnimeId, setSelectedAnimeId] = useState('');
  const [episodeNum, setEpisodeNum] = useState('1');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('24:00');
  const [episodeThumbnail, setEpisodeThumbnail] = useState('');

  // Handle Anime Submit
  const handleCreateAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeTitle) return;

    const newAnime: AnimeItem = {
      id: 'a' + Math.random().toString(36).substr(2, 9),
      title: animeTitle,
      description: animeDesc,
      coverUrl: animeCover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
      bannerUrl: animeBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      genre: animeGenres.split(',').map((g: string) => g.trim()).filter(Boolean),
      rating: parseFloat(animeRating) || 8.0,
      status: animeStatus,
      episodesCount: 0
    };

    setAnimeList([newAnime, ...animeList]);
    setShowAnimeModal(false);
    triggerToast(`"${newAnime.title}" successfully added! Evicted Redis cache.`);
    
    // Clear forms
    setAnimeTitle('');
    setAnimeDesc('');
    setAnimeCover('');
    setAnimeBanner('');
    setAnimeGenres('');
  };

  // Handle Episode Submit
  const handleCreateEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimeId) return;

    // Increment episode number in anime list state
    setAnimeList(animeList.map((anime: AnimeItem) => {
      if (anime.id === selectedAnimeId) {
        return { ...anime, episodesCount: anime.episodesCount + 1 };
      }
      return anime;
    }));

    setShowEpisodeModal(false);
    triggerToast(`Episode ${episodeNum} added successfully. HLS transcoding simulation complete.`);
  };

  // Handle Delete Anime
  const handleDeleteAnime = (id: string, title: string) => {
    setAnimeList(animeList.filter((anime: AnimeItem) => anime.id !== id));
    triggerToast(`Deleted "${title}". Cleared all Redis caches.`);
  };

  // Simulated Cache Eviction
  const handleEvictCache = () => {
    triggerToast("Redis 'anime:trending' and search caches evicted manually.");
  };

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(16, 185, 129, 0.95)',
          border: '1px solid #10b981',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease-out',
          backdropFilter: 'blur(10px)',
          fontWeight: 600
        }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* SIDEBAR SIDE */}
      <aside className="sidebar">
        <div className="logo">
          VashtyNime<span className="logo-dot"></span>
        </div>
        
        <ul className="nav-links">
          <li>
            <a 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Core Dashboard
            </a>
          </li>
          <li>
            <a 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 View Metrics
            </a>
          </li>
          <li>
            <a 
              className={`nav-item ${activeTab === 'cache' ? 'active' : ''}`}
              onClick={() => setActiveTab('cache')}
            >
              ⚡ Redis Cache Control
            </a>
          </li>
        </ul>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid var(--panel-border)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Backend Connection:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontWeight: 600, color: 'var(--secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 8px var(--secondary)' }}></span>
            Online (Spring Boot API)
          </div>
        </div>
      </aside>

      {/* DASHBOARD CONTENT */}
      <main className="dashboard-main animate-slide-up">
        {/* HEADER SECTION */}
        <header className="dashboard-header">
          <div className="header-title">
            <h1>
              {activeTab === 'dashboard' && 'Media Dashboard'}
              {activeTab === 'analytics' && 'Streaming Metrics'}
              {activeTab === 'cache' && 'Redis Optimization Console'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Upload new anime catalog details, manage episodes, and monitor streaming files.'}
              {activeTab === 'analytics' && 'Realtime charts representing watch durations, API response latencies, and storage.'}
              {activeTab === 'cache' && 'Explicitly evict, monitor, and preload high speed memory caches for peak API output.'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowEpisodeModal(true)}>
              ➕ Upload Episode
            </button>
            <button className="btn btn-primary" onClick={() => setShowAnimeModal(true)}>
              🎬 Create Anime Title
            </button>
          </div>
        </header>

        {/* CORE DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            {/* Quick Metrics */}
            <section className="metrics-grid">
              <div className="glass-panel metric-card">
                <div className="metric-icon-box metric-icon-blue">📺</div>
                <div>
                  <div className="metric-label">Anime Catalog</div>
                  <div className="metric-value">{animeList.length} Titles</div>
                </div>
              </div>

              <div className="glass-panel metric-card">
                <div className="metric-icon-box metric-icon-green">📁</div>
                <div>
                  <div className="metric-label">Total Stream Length</div>
                  <div className="metric-value">1,148 Eps</div>
                </div>
              </div>

              <div className="glass-panel metric-card">
                <div className="metric-icon-box metric-icon-pink">⚡</div>
                <div>
                  <div className="metric-label">Avg API Latency</div>
                  <div className="metric-value">12.4ms</div>
                </div>
              </div>

              <div className="glass-panel metric-card">
                <div className="metric-icon-box metric-icon-blue">💾</div>
                {/* Note: The R2 Cloudflare label represents the storage quota */}
                <div>
                  <div className="metric-label">R2 Storage</div>
                  <div className="metric-value">2.44 TB</div>
                </div>
              </div>
            </section>

            {/* Anime Catalog List Table */}
            <section className="content-section">
              <div className="glass-panel section-card">
                <div className="section-header">
                  <h2>Active Anime Catalog</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {animeList.length} items</span>
                </div>

                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Anime Details</th>
                      <th>Genres</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Episodes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animeList.map((anime: AnimeItem) => (
                      <tr key={anime.id}>
                        <td>
                          <div className="table-anime-meta">
                            <img className="table-anime-img" src={anime.coverUrl} alt={anime.title} />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{anime.title}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {anime.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {anime.genre.map((g: string) => (
                              <span key={g} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                                {g}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {anime.rating.toFixed(2)}</span>
                        </td>
                        <td>
                          <span className={`badge ${anime.status === 'ONGOING' ? 'badge-ongoing' : 'badge-completed'}`}>
                            {anime.status}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {anime.episodesCount} Episodes
                        </td>
                        <td>
                          <button 
                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                            onClick={() => handleDeleteAnime(anime.id, anime.title)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <section className="content-section">
            <div className="glass-panel section-card">
              <div className="section-header">
                <h2>Realtime User Watch Metrics</h2>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                  Live Streams
                </div>
              </div>

              {/* simulated chart columns */}
              <div className="chart-sim-container">
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '70%' }} data-value="12.4K"></div>
                  <span className="chart-label">Monday</span>
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '85%' }} data-value="15.1K"></div>
                  <span className="chart-label">Tuesday</span>
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '60%' }} data-value="10.8K"></div>
                  <span className="chart-label">Wednesday</span>
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '95%' }} data-value="21.5K"></div>
                  <span className="chart-label">Thursday</span>
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '80%' }} data-value="17.9K"></div>
                  <span className="chart-label">Friday</span>
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '100%' }} data-value="25.0K"></div>
                  <span className="chart-label">Saturday</span>
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: '90%' }} data-value="23.4K"></div>
                  <span className="chart-label">Sunday</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>🔥 Top Visited Stream (Weekly)</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span>1. Solo Leveling Season 2</span>
                    <strong style={{ color: 'var(--primary)' }}>4.2M views</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span>2. Demon Slayer: Infinity Castle</span>
                    <strong style={{ color: 'var(--primary)' }}>3.8M views</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span>3. One Piece: Egghead Island</span>
                    <strong style={{ color: 'var(--primary)' }}>2.9M views</strong>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>📊 Global CDN Latency Breakdown</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span>Cloudflare R2 US West</span>
                    <strong style={{ color: 'var(--secondary)' }}>8.4 ms</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span>Cloudflare R2 Europe Central</span>
                    <strong style={{ color: 'var(--secondary)' }}>11.2 ms</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span>Cloudflare R2 Asia-Pacific</span>
                    <strong style={{ color: 'var(--secondary)' }}>13.9 ms</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CACHE CONTROL TAB */}
        {activeTab === 'cache' && (
          <section className="content-section">
            <div className="glass-panel section-card">
              <div className="section-header">
                <h2>Redis Server Management</h2>
                <div style={{ background: 'var(--secondary-glow)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.25rem 0.60rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                  Active Connection
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    VashtyNime utilizes a Redis Cache layer to store heavy database operations like high traffic anime searches, trending sorted charts, and session token authentication records. Manually evicting cache keeps your local clients updated immediately.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleEvictCache}>
                      ⚡ Evict All Caches
                    </button>
                    <button className="btn btn-secondary" onClick={() => triggerToast("Preloaded 25 top anime records into Redis memory.")}>
                      🚀 Preload Cache
                    </button>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Server Stats</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Memory Usage:</span>
                    <strong>12.44 MB / 512 MB</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cached Keys:</span>
                    <strong>45 Active Keys</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cache Hit Rate:</span>
                    <strong style={{ color: 'var(--secondary)' }}>98.42%</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* CREATE ANIME MODAL */}
      {showAnimeModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <button className="close-btn" onClick={() => setShowAnimeModal(false)}>×</button>
            <h2 className="modal-title">Create New Anime Title</h2>
            
            <form onSubmit={handleCreateAnime}>
              <div className="form-group">
                <label className="form-label">Anime Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Naruto Shippuden"
                  value={animeTitle}
                  onChange={(e) => setAnimeTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  placeholder="Enter detailed plot synopsis..."
                  value={animeDesc}
                  onChange={(e) => setAnimeDesc(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https://example.com/cover.jpg"
                    value={animeCover}
                    onChange={(e) => setAnimeCover(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Banner Image URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https://example.com/banner.jpg"
                    value={animeBanner}
                    onChange={(e) => setAnimeBanner(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Genres (Comma separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Action, Shounen, Adventure"
                  value={animeGenres}
                  onChange={(e) => setAnimeGenres(e.target.value)}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="10" 
                    className="form-control" 
                    value={animeRating}
                    onChange={(e) => setAnimeRating(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-control"
                    value={animeStatus}
                    onChange={(e) => setAnimeStatus(e.target.value)}
                  >
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="HIATUS">HIATUS</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnimeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  🎬 Create Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD EPISODE MODAL */}
      {showEpisodeModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <button className="close-btn" onClick={() => setShowEpisodeModal(false)}>×</button>
            <h2 className="modal-title">Upload New Episode</h2>
            
            <form onSubmit={handleCreateEpisode}>
              <div className="form-group">
                <label className="form-label">Target Anime</label>
                <select 
                  className="form-control"
                  value={selectedAnimeId}
                  onChange={(e) => setSelectedAnimeId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Anime Title --</option>
                  {animeList.map((anime: AnimeItem) => (
                    <option key={anime.id} value={anime.id}>{anime.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Episode Number</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control" 
                    value={episodeNum}
                    onChange={(e) => setEpisodeNum(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (e.g. MM:SS)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Video Stream Source (.mp4 / .m3u8)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="https://r2.vashtynime.com/anime/naruto/ep1.m3u8"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  ℹ️ Non-HLS inputs are auto converted to multi-quality HLS streams inside our FFmpeg worker.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="https://example.com/ep_thumbnail.jpg"
                  value={episodeThumbnail}
                  onChange={(e) => setEpisodeThumbnail(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEpisodeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  🚀 Transcode & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
