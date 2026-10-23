import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Home, Shield, User, Newspaper, Users, Map, Trophy, Heart, Eye, Share2, Image as ImageIcon, Copy, ExternalLink } from 'lucide-react'
import './App.css'

type TaskType =
  | 'x_follow' | 'x_like' | 'x_repost' | 'x_quote' | 'x_post'
  | 'telegram' | 'hold_redline' | 'hold_supra' | 'buy_nft'
  | 'host_event' | 'join_live'

interface Task {
  id: string
  title: string
  description: string
  points: number
  type: TaskType
  status: 'available' | 'submitted' | 'verified' | 'rejected'
  requiresForm?: boolean
  addedAt?: number
}

interface UserProfile {
  wallet: string | null
  name: string
  supraDns: string
  twitter: string
  telegram: string
  rank: string
  points: number
  avatar: string
}

interface Comment {
  id: string
  text: string
  image?: string
  author: string
  authorAvatar?: string
  date: string
}

interface Article {
  id: string
  title: string
  content: string
  image?: string
  author: string
  authorAvatar?: string
  date: string
  likes: number
  views: number
  likedBy: string[]
  comments: Comment[]
}

interface Soldier {
  name: string
  rank: string
  points: number
  supra: string
}

const initialTasks: Task[] = [
  { id: '1', title: 'Follow @Redline_Sup on X', description: 'Follow the official Redline Supra Army account', points: 50, type: 'x_follow', status: 'available', addedAt: 1 },
  { id: '2', title: 'Like our latest post', description: 'Like the most recent announcement on X', points: 25, type: 'x_like', status: 'available', addedAt: 2 },
  { id: '3', title: 'Repost announcement', description: 'Repost the latest Redline post', points: 75, type: 'x_repost', status: 'available', addedAt: 3 },
  { id: '4', title: 'Quote the launch post', description: 'Quote tweet the launch post with your thoughts', points: 100, type: 'x_quote', status: 'available', requiresForm: true, addedAt: 4 },
  { id: '5', title: 'Make a post about Supra', description: 'Create an original post talking about Supra or Redline', points: 150, type: 'x_post', status: 'available', requiresForm: true, addedAt: 5 },
  { id: '6', title: 'Join Redline Telegram', description: 'Join the official Telegram group', points: 50, type: 'telegram', status: 'available', addedAt: 6 },
  { id: '7', title: 'Hold 1,000,000 $REDLINE', description: 'Hold at least 1,000,000 $REDLINE in your connected wallet', points: 100, type: 'hold_redline', status: 'available', addedAt: 7 },
  { id: '8', title: 'Hold 100,000 $SUPRA', description: 'Hold at least 100,000 $SUPRA in your connected wallet', points: 100, type: 'hold_supra', status: 'available', addedAt: 8 },
  { id: '9', title: 'Buy a Redline NFT', description: 'Purchase any Redline NFT', points: 200, type: 'buy_nft', status: 'available', addedAt: 9 },
  { id: '10', title: 'Host a Supra event', description: 'Host or co-host a community event about Supra', points: 300, type: 'host_event', status: 'available', requiresForm: true, addedAt: 10 },
  { id: '11', title: 'Join the Sup Live', description: 'Join a Supra community live session', points: 75, type: 'join_live', status: 'available', addedAt: 11 },
]

const sampleArticles: Article[] = [
  {
    id: 'a1',
    title: 'Supra Automation Hits Mainnet',
    content: 'Native zero-delay automation is now live for all dApps. This marks a major milestone for the Supra ecosystem as builders can now deploy automated workflows without external infrastructure. The technology allows for complex multi-step operations to execute instantly on-chain.',
    author: 'Redline Official',
    date: 'Oct 20, 2026',
    likes: 42,
    views: 1280,
    likedBy: [],
    comments: [],
  },
  {
    id: 'a2',
    title: 'Redline Army Crosses 10k Holders',
    content: 'Community milestone reached as $REDLINE gains traction across the Supra ecosystem. More soldiers are joining every day and the community continues to grow stronger.',
    author: 'Redline Official',
    date: 'Oct 19, 2026',
    likes: 28,
    views: 890,
    likedBy: [],
    comments: [],
  },
]

const sampleSoldiers: Soldier[] = [
  { name: 'Alpha', rank: 'Captain', points: 1250, supra: 'alpha.supra' },
  { name: 'Bravo', rank: 'Sergeant', points: 840, supra: 'bravo.supra' },
  { name: 'Charlie', rank: 'Soldier', points: 510, supra: 'charlie.supra' },
  { name: 'Delta', rank: 'Recruit', points: 320, supra: 'delta.supra' },
  { name: 'Echo', rank: 'Lieutenant', points: 980, supra: 'echo.supra' },
]

const roadmapItems = [
  { phase: 'Phase 1', title: 'Launch Hub', status: 'Completed', items: ['Frontend deployment', 'Basic missions', 'Profile system'] },
  { phase: 'Phase 2', title: 'Verification', status: 'In Progress', items: ['X API integration', 'On-chain hold checks', 'Form review system'] },
  { phase: 'Phase 3', title: 'On-Chain Points', status: 'Upcoming', items: ['Move smart contract', 'Points claiming', 'Snapshot for airdrop'] },
  { phase: 'Phase 4', title: 'Army Expansion', status: 'Upcoming', items: ['NFT missions', 'Event hosting', 'Leaderboard rewards'] },
]

function App() {
  const [account, setAccount] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [profile, setProfile] = useState<UserProfile>({
    wallet: null, name: '', supraDns: '', twitter: '', telegram: '', rank: 'Recruit', points: 0, avatar: '',
  })
  const [articles, setArticles] = useState<Article[]>(sampleArticles)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem('redline_profile')
    if (savedProfile) try { setProfile(JSON.parse(savedProfile)) } catch {}
    const savedArticles = localStorage.getItem('redline_articles')
    if (savedArticles) try { setArticles(JSON.parse(savedArticles)) } catch {}
  }, [])

  useEffect(() => { localStorage.setItem('redline_profile', JSON.stringify(profile)) }, [profile])
  useEffect(() => { localStorage.setItem('redline_articles', JSON.stringify(articles)) }, [articles])

  const connectWallet = async () => {
    try {
      const provider = (window as any).starkey?.supra
      if (!provider) return alert('StarKey wallet not detected.')
      const accounts = await provider.connect()
      if (accounts?.[0]) {
        setAccount(accounts[0])
        setProfile(p => ({ ...p, wallet: accounts[0] }))
      }
    } catch { alert('Failed to connect wallet') }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProfile(p => ({ ...p, wallet: null }))
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
        <div className="main-content">
          <Header account={account} onConnect={connectWallet} onDisconnect={disconnectWallet} onMenuClick={() => setMobileMenuOpen(true)} />
          <Routes>
            <Route path="/" element={<HomePage tasks={tasks} articles={articles} />} />
            <Route path="/missions" element={<MissionsPage tasks={tasks} setTasks={setTasks} profile={profile} />} />
            <Route path="/profile" element={<ProfilePage profile={profile} setProfile={setProfile} account={account} />} />
            <Route path="/news" element={<NewsPage articles={articles} setArticles={setArticles} profile={profile} />} />
            <Route path="/news/:id" element={<ArticlePage articles={articles} setArticles={setArticles} profile={profile} />} />
            <Route path="/soldiers" element={<SoldiersPage soldiers={sampleSoldiers} />} />
            <Route path="/leaderboard" element={<LeaderboardPage soldiers={sampleSoldiers} />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
          </Routes>
          <RightSidebar profile={profile} account={account} className="mobile-right" />
        </div>
        <RightSidebar profile={profile} account={account} className="desktop-right" />
      </div>
    </BrowserRouter>
  )
}

function Sidebar({ mobileOpen, setMobileOpen }: any) {
  const location = useLocation()
  const close = () => setMobileOpen(false)
  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/missions', label: 'Missions', icon: Shield },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/soldiers', label: 'Soldiers', icon: Users },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
  ]

  return (
    <>
      <div className={`drawer-overlay ${mobileOpen ? 'open' : ''}`} onClick={close} />
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/redline logo.jpg" alt="Redline" />
          <div>
            <div className="redline">REDLINE</div>
            <div className="hub">HUB</div>
          </div>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={`sidebar-link ${location.pathname === to ? 'active' : ''}`} onClick={close}>
              <Icon size={18} /><span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

function Header({ account, onConnect, onDisconnect, onMenuClick }: any) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>☰</button>
        <span className="live-dot" />
        <span className="top-title">REDLINE SUPRA ARMY</span>
      </div>
      <div className="wallet">
        {account ? (
          <>
            <span className="address">{account.slice(0, 6)}...{account.slice(-4)}</span>
            <button onClick={onDisconnect} className="disconnect-btn">Disconnect</button>
          </>
        ) : (
          <button onClick={onConnect} className="connect-btn">Connect Wallet</button>
        )}
      </div>
    </header>
  )
}

function RightSidebar({ profile, account, className }: any) {
  return (
    <aside className={`right-sidebar ${className || ''}`}>
      <div className="sidebar-card">
        <div className="sidebar-title">Soldier Status</div>
        {profile.avatar && <div className="sidebar-avatar"><img src={profile.avatar} alt="Avatar" /></div>}
        <div className="stat-row"><span>Rank</span><strong className="rank">{profile.rank}</strong></div>
        <div className="stat-row"><span>Points</span><strong>{profile.points}</strong></div>
        <div className="stat-row"><span>Wallet</span><strong className="mono">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</strong></div>
      </div>
      <div className="sidebar-card">
        <div className="sidebar-title">Quick Actions</div>
        <Link to="/missions" className="quick-btn">View Missions</Link>
        <Link to="/leaderboard" className="quick-btn">Leaderboard</Link>
      </div>
      <div className="sidebar-card">
        <div className="sidebar-title">Tokens</div>
        <div className="token-card">
          <div className="token-header"><div className="token-name">$SUPRA</div><div className="token-price">$0.0042</div></div>
          <div className="token-change positive">+4.8%</div>
          <div className="mini-chart">
            <div className="chart-line" style={{ height: '45%' }} /><div className="chart-line" style={{ height: '62%' }} />
            <div className="chart-line" style={{ height: '38%' }} /><div className="chart-line" style={{ height: '70%' }} />
            <div className="chart-line" style={{ height: '55%' }} /><div className="chart-line" style={{ height: '82%' }} />
            <div className="chart-line" style={{ height: '68%' }} />
          </div>
        </div>
        <div className="token-card">
          <div className="token-header"><div className="token-name">$REDLINE</div><div className="token-price">$0.00018</div></div>
          <div className="token-change positive">+12.4%</div>
          <div className="mini-chart">
            <div className="chart-line" style={{ height: '30%' }} /><div className="chart-line" style={{ height: '48%' }} />
            <div className="chart-line" style={{ height: '55%' }} /><div className="chart-line" style={{ height: '42%' }} />
            <div className="chart-line" style={{ height: '75%' }} /><div className="chart-line" style={{ height: '88%' }} />
            <div className="chart-line" style={{ height: '92%' }} />
          </div>
        </div>
      </div>
    </aside>
  )
}

function HomePage({ tasks, articles }: any) {
  const newestTasks = [...tasks].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)).slice(0, 3)
  const newestArticles = articles.slice(0, 3)

  return (
    <div className="page">
      <section className="section">
        <h2>Newest Missions</h2>
        <div className="task-list">
          {newestTasks.map((task: Task) => (
            <div key={task.id} className="task">
              <div><h3>{task.title}</h3><p>{task.description}</p><span className="points">+{task.points} PTS</span></div>
              <Link to="/missions" className="task-btn">View</Link>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Latest News</h2>
        <div className="task-list">
          {newestArticles.map((item: Article) => (
            <div key={item.id} className="task">
              <div><h3>{item.title}</h3><p>{item.content.slice(0, 120)}...</p><span className="points">{item.date}</span></div>
              <Link to="/news" className="task-btn">Read</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function MissionsPage({ tasks, setTasks, profile }: any) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [submissionText, setSubmissionText] = useState('')

  const handleTaskAction = (task: Task) => {
    if (task.requiresForm) setSelectedTask(task)
    else alert(`Verification for "${task.title}" will be handled automatically later.`)
  }

  const submitForm = () => {
    if (!selectedTask || !submissionText.trim()) return alert('Please provide details.')
    setTasks((prev: Task[]) => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'submitted' } : t))
    alert('Submission received. It will be reviewed.')
    setSelectedTask(null)
    setSubmissionText('')
  }

  return (
    <div className="page">
      <h1 className="page-title">Active Missions</h1>
      <div className="points-card">
        <div>
          <div className="label">Current Score</div>
          <div className="points-value">{profile.points}</div>
          <div className="points-sub">Rank: {profile.rank}</div>
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task: Task) => (
          <div key={task.id} className="task">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="points">+{task.points} PTS</span>
              {task.status !== 'available' && <span className="status"> • {task.status.toUpperCase()}</span>}
            </div>
            <button className="task-btn" onClick={() => handleTaskAction(task)} disabled={task.status !== 'available'}>
              {task.status === 'available' ? 'Start' : task.status}
            </button>
          </div>
        ))}
      </div>
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedTask.title}</h3>
            <textarea placeholder="Paste the link or details..." value={submissionText} onChange={e => setSubmissionText(e.target.value)} rows={5} />
            <div className="modal-actions">
              <button onClick={() => setSelectedTask(null)} className="disconnect-btn">Cancel</button>
              <button onClick={submitForm} className="connect-btn">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfilePage({ profile, setProfile, account }: any) {
  const [saved, setSaved] = useState(false)

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((p: UserProfile) => ({ ...p, [field]: value }))
    setSaved(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('Please upload an image file.')
    const reader = new FileReader()
    reader.onload = () => {
      setProfile((p: UserProfile) => ({ ...p, avatar: reader.result as string }))
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="page">
      <h1 className="page-title">Soldier Profile</h1>
      <div className="profile-header">
        <div className="avatar-wrapper">
          {profile.avatar ? <img src={profile.avatar} alt="Profile" className="avatar" /> : <div className="avatar-placeholder">No Photo</div>}
          <label className="avatar-upload">Change Photo<input type="file" accept="image/*" onChange={handleAvatarUpload} hidden /></label>
        </div>
        <div className="profile-summary">
          <div className="name">{profile.name || 'Unnamed Soldier'}</div>
          <div className="wallet-short">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Wallet not connected'}</div>
          <div className="rank-badge">{profile.rank.toUpperCase()}</div>
        </div>
      </div>
      <div className="profile-card">
        <div className="profile-row"><label>Display Name</label><input value={profile.name} onChange={e => handleChange('name', e.target.value)} placeholder="Your callsign" /></div>
        <div className="profile-row"><label>Supra DNS</label><input value={profile.supraDns} onChange={e => handleChange('supraDns', e.target.value)} placeholder="yourname.supra" /></div>
        <div className="profile-row"><label>X / Twitter</label><input value={profile.twitter} onChange={e => handleChange('twitter', e.target.value)} placeholder="@username" /></div>
        <div className="profile-row"><label>Telegram</label><input value={profile.telegram} onChange={e => handleChange('telegram', e.target.value)} placeholder="@username" /></div>
        <div className="profile-row"><label>Wallet</label><span className="value">{account || 'Not connected'}</span></div>
        <div className="profile-row"><label>Rank</label><span className="value rank">{profile.rank}</span></div>
        <div className="profile-row"><label>Points</label><span className="value">{profile.points}</span></div>
      </div>
      <div className="profile-actions">
        <button onClick={handleSave} className="connect-btn">Save Profile</button>
        {saved && <span className="saved-msg">Saved</span>}
      </div>
    </div>
  )
}

function NewsPage({ articles, setArticles, profile }: any) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [articleImage, setArticleImage] = useState('')
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})
  const [commentImages, setCommentImages] = useState<Record<string, string>>({})
  const [shareOpen, setShareOpen] = useState<string | null>(null)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  const handleArticleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setArticleImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const postArticle = () => {
    if (!title.trim() || !content.trim()) return alert('Title and content are required.')
    if (wordCount > 5000) return alert('Article exceeds 5000 words.')
    const newArticle: Article = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      image: articleImage || undefined,
      author: profile.name || 'Anonymous Soldier',
      authorAvatar: profile.avatar,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: 0,
      views: 0,
      likedBy: [],
      comments: [],
    }
    setArticles((prev: Article[]) => [newArticle, ...prev])
    setTitle(''); setContent(''); setArticleImage('')
  }

  const toggleLike = (id: string) => {
    const key = profile.wallet || profile.name || 'anon'
    setArticles((prev: Article[]) => prev.map(a => {
      if (a.id !== id) return a
      const already = a.likedBy.includes(key)
      return {
        ...a,
        likes: already ? a.likes - 1 : a.likes + 1,
        likedBy: already ? a.likedBy.filter(x => x !== key) : [...a.likedBy, key],
      }
    }))
  }

  const openArticle = (article: Article) => {
    const words = article.content.trim().split(/\s+/).filter(Boolean).length
    if (words > 200) {
      setArticles((prev: Article[]) => prev.map(a => a.id === article.id ? { ...a, views: a.views + 1 } : a))
      navigate(`/news/${article.id}`)
    }
  }

  const handleCommentImage = (articleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCommentImages(prev => ({ ...prev, [articleId]: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const postComment = (articleId: string) => {
    const text = commentTexts[articleId]?.trim()
    if (!text && !commentImages[articleId]) return
    const newComment: Comment = {
      id: Date.now().toString(),
      text: text || '',
      image: commentImages[articleId],
      author: profile.name || 'Anonymous',
      authorAvatar: profile.avatar,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
    setArticles((prev: Article[]) => prev.map(a => a.id === articleId ? { ...a, comments: [...a.comments, newComment] } : a))
    setCommentTexts(prev => ({ ...prev, [articleId]: '' }))
    setCommentImages(prev => ({ ...prev, [articleId]: '' }))
  }

  const shareUrl = (id: string) => window.location.origin + '/news/' + id

  return (
    <div className="page">
      <h1 className="page-title">Ecosystem News</h1>

      <div className="article-form x-style">
        <div className="post-header">
          {profile.avatar ? <img src={profile.avatar} className="post-avatar" alt="" /> : <div className="post-avatar placeholder" />}
          <div>
            <div className="post-author">{profile.name || 'Anonymous Soldier'}</div>
            <div className="post-sub">Posting as soldier</div>
          </div>
        </div>
        <input className="form-input" placeholder="Article title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="form-textarea" placeholder="What's happening in the Supra ecosystem? (max 5000 words)" value={content} onChange={e => setContent(e.target.value)} rows={5} />
        <div className="form-meta">
          <span className={wordCount > 5000 ? 'over-limit' : ''}>{wordCount}/5000</span>
          <div className="post-actions">
            <label className="icon-btn" title="Add image">
              <ImageIcon size={18} />
              <input type="file" accept="image/*" onChange={handleArticleImage} hidden />
            </label>
            <button onClick={postArticle} className="connect-btn small">Post</button>
          </div>
        </div>
        {articleImage && <img src={articleImage} alt="Preview" className="article-preview" />}
      </div>

      <div className="articles">
        {articles.map((article: Article) => {
          const words = article.content.trim().split(/\s+/).filter(Boolean).length
          const isLong = words > 200
          const liked = article.likedBy.includes(profile.wallet || profile.name || 'anon')
          return (
            <div key={article.id} className="article-card x-card">
              <div className="post-header">
                {article.authorAvatar ? <img src={article.authorAvatar} className="post-avatar" alt="" /> : <div className="post-avatar placeholder" />}
                <div>
                  <div className="post-author">{article.author}</div>
                  <div className="post-sub">{article.date}</div>
                </div>
              </div>
              <h3 className="x-title" onClick={() => isLong && openArticle(article)} style={{ cursor: isLong ? 'pointer' : 'default' }}>
                {article.title}
              </h3>
              {article.image && <img src={article.image} alt="" className="article-image" />}
              <p className="article-content" onClick={() => isLong && openArticle(article)}>
                {isLong ? article.content.slice(0, 280) + '...' : article.content}
                {isLong && <span className="read-more"> Read more</span>}
              </p>
              <div className="x-actions">
                <button className={`icon-btn ${liked ? 'liked' : ''}`} onClick={() => toggleLike(article.id)}>
                  <Heart size={16} fill={liked ? '#ff2d2d' : 'none'} /> {article.likes}
                </button>
                <span className="icon-btn"><Eye size={16} /> {article.views}</span>
                <button className="icon-btn" onClick={() => setShareOpen(shareOpen === article.id ? null : article.id)}>
                  <Share2 size={16} />
                </button>
              </div>
              {shareOpen === article.id && (
                <div className="share-panel">
                  <button onClick={() => { navigator.clipboard.writeText(shareUrl(article.id)); alert('Link copied') }}><Copy size={14} /> Copy Link</button>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl(article.id))}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Share to X</a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl(article.id))}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Telegram</a>
                  <a href={`https://discord.com/channels/@me`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Discord</a>
                </div>
              )}
              <div className="comments">
                <div className="comments-title">Comments ({article.comments.length})</div>
                {article.comments.slice(0, 2).map((c: Comment) => (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      {c.authorAvatar ? <img src={c.authorAvatar} className="comment-avatar" alt="" /> : <div className="comment-avatar placeholder" />}
                      <span className="comment-meta">{c.author} • {c.date}</span>
                    </div>
                    {c.text && <p>{c.text}</p>}
                    {c.image && <img src={c.image} alt="" className="comment-image" />}
                  </div>
                ))}
                <div className="comment-form">
                  <textarea placeholder="Reply..." value={commentTexts[article.id] || ''} onChange={e => setCommentTexts(prev => ({ ...prev, [article.id]: e.target.value }))} rows={2} />
                  <div className="comment-actions">
                    <label className="icon-btn" title="Add image/GIF"><ImageIcon size={16} /><input type="file" accept="image/*" onChange={e => handleCommentImage(article.id, e)} hidden /></label>
                    <button onClick={() => postComment(article.id)} className="connect-btn small">Reply</button>
                  </div>
                  {commentImages[article.id] && <img src={commentImages[article.id]} alt="" className="comment-preview" />}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ArticlePage({ articles, setArticles, profile }: any) {
  const { id } = useParams()
  const navigate = useNavigate()
  const article = articles.find((a: Article) => a.id === id)
  const [commentText, setCommentText] = useState('')
  const [commentImage, setCommentImage] = useState('')
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    if (article) {
      setArticles((prev: Article[]) => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a))
    }
  }, [id])

  if (!article) return <div className="page"><h1 className="page-title">Article not found</h1></div>

  const sameAuthor = articles.filter((a: Article) => a.author === article.author && a.id !== article.id).slice(0, 3)
  const related = articles.filter((a: Article) => a.author !== article.author).slice(0, 3)
  const liked = article.likedBy.includes(profile.wallet || profile.name || 'anon')

  const toggleLike = () => {
    const key = profile.wallet || profile.name || 'anon'
    setArticles((prev: Article[]) => prev.map(a => {
      if (a.id !== id) return a
      const already = a.likedBy.includes(key)
      return { ...a, likes: already ? a.likes - 1 : a.likes + 1, likedBy: already ? a.likedBy.filter(x => x !== key) : [...a.likedBy, key] }
    }))
  }

  const handleCommentImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCommentImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const postComment = () => {
    if (!commentText.trim() && !commentImage) return
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText.trim(),
      image: commentImage || undefined,
      author: profile.name || 'Anonymous',
      authorAvatar: profile.avatar,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
    setArticles((prev: Article[]) => prev.map(a => a.id === id ? { ...a, comments: [...a.comments, newComment] } : a))
    setCommentText(''); setCommentImage('')
  }

  const shareUrl = window.location.origin + '/news/' + id

  return (
    <div className="page">
      <button onClick={() => navigate('/news')} className="back-btn">← Back to News</button>
      <div className="article-full">
        <div className="post-header">
          {article.authorAvatar ? <img src={article.authorAvatar} className="post-avatar large" alt="" /> : <div className="post-avatar large placeholder" />}
          <div>
            <div className="post-author">{article.author}</div>
            <div className="post-sub">{article.date}</div>
          </div>
        </div>
        <h1 className="full-title">{article.title}</h1>
        {article.image && <img src={article.image} alt="" className="article-image full" />}
        <p className="article-content full">{article.content}</p>
        <div className="x-actions">
          <button className={`icon-btn ${liked ? 'liked' : ''}`} onClick={toggleLike}><Heart size={18} fill={liked ? '#ff2d2d' : 'none'} /> {article.likes}</button>
          <span className="icon-btn"><Eye size={18} /> {article.views}</span>
          <button className="icon-btn" onClick={() => setShareOpen(!shareOpen)}><Share2 size={18} /></button>
        </div>
        {shareOpen && (
          <div className="share-panel">
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied') }}><Copy size={14} /> Copy Link</button>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Share to X</a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Telegram</a>
            <a href="https://discord.com/channels/@me" target="_blank" rel="noreferrer"><ExternalLink size={14} /> Discord</a>
          </div>
        )}
        <div className="comments">
          <div className="comments-title">All Comments ({article.comments.length})</div>
          {article.comments.map((c: Comment) => (
            <div key={c.id} className="comment">
              <div className="comment-header">
                {c.authorAvatar ? <img src={c.authorAvatar} className="comment-avatar" alt="" /> : <div className="comment-avatar placeholder" />}
                <span className="comment-meta">{c.author} • {c.date}</span>
              </div>
              {c.text && <p>{c.text}</p>}
              {c.image && <img src={c.image} alt="" className="comment-image" />}
            </div>
          ))}
          <div className="comment-form">
            <textarea placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} />
            <div className="comment-actions">
              <label className="icon-btn"><ImageIcon size={16} /><input type="file" accept="image/*" onChange={handleCommentImage} hidden /></label>
              <button onClick={postComment} className="connect-btn small">Post Comment</button>
            </div>
            {commentImage && <img src={commentImage} alt="" className="comment-preview" />}
          </div>
        </div>
      </div>

      {sameAuthor.length > 0 && (
        <section className="section">
          <h2>More from {article.author}</h2>
          <div className="task-list">
            {sameAuthor.map((a: Article) => (
              <div key={a.id} className="task" onClick={() => navigate(`/news/${a.id}`)} style={{ cursor: 'pointer' }}>
                <div><h3>{a.title}</h3><p>{a.content.slice(0, 100)}...</p></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <h2>Related Articles</h2>
          <div className="task-list">
            {related.map((a: Article) => (
              <div key={a.id} className="task" onClick={() => navigate(`/news/${a.id}`)} style={{ cursor: 'pointer' }}>
                <div><h3>{a.title}</h3><p>{a.content.slice(0, 100)}...</p><span className="points">{a.author}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SoldiersPage({ soldiers }: any) {
  return (
    <div className="page">
      <h1 className="page-title">Soldiers Hub</h1>
      <div className="task-list">
        {soldiers.map((s: Soldier, i: number) => (
          <div key={i} className="task"><div><h3>{s.name}</h3><p>{s.supra} • {s.rank}</p><span className="points">{s.points} PTS</span></div></div>
        ))}
      </div>
    </div>
  )
}

function LeaderboardPage({ soldiers }: any) {
  const sorted = [...soldiers].sort((a, b) => b.points - a.points)
  return (
    <div className="page">
      <h1 className="page-title">Leaderboard</h1>
      <div className="task-list">
        {sorted.map((s: Soldier, i: number) => (
          <div key={i} className="task leaderboard-item">
            <div className="rank-number">#{i + 1}</div>
            <div><h3>{s.name}</h3><p>{s.supra} • {s.rank}</p></div>
            <div className="points-big">{s.points} PTS</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RoadmapPage() {
  return (
    <div className="page">
      <h1 className="page-title">Roadmap</h1>
      <div className="roadmap">
        {roadmapItems.map((item, i) => (
          <div key={i} className="roadmap-item">
            <div className="roadmap-phase">{item.phase}</div>
            <div>
              <h3>{item.title}</h3>
              <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
              <ul>{item.items.map((sub, j) => <li key={j}>{sub}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App