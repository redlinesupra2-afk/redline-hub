import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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
}

interface NewsItem {
  id: string
  title: string
  summary: string
  date: string
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

const sampleNews: NewsItem[] = [
  { id: 'n1', title: 'Supra Automation Hits Mainnet', summary: 'Native zero-delay automation is now live for all dApps.', date: 'Oct 20, 2026' },
  { id: 'n2', title: 'Redline Army Crosses 10k Holders', summary: 'Community milestone reached as $REDLINE gains traction.', date: 'Oct 19, 2026' },
  { id: 'n3', title: 'SupraEVM Devnet Update', summary: 'New RPC endpoints and improved stability for EVM builders.', date: 'Oct 18, 2026' },
  { id: 'n4', title: 'HyperNova Bridge Expansion', summary: 'Additional assets now supported for seamless bridging.', date: 'Oct 15, 2026' },
]

function App() {
  const [account, setAccount] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [profile, setProfile] = useState<UserProfile>({
    wallet: null, name: '', supraDns: '', twitter: '', telegram: '', rank: 'Recruit', points: 0,
  })

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
        <Header account={account} onConnect={connectWallet} onDisconnect={disconnectWallet} />
        <Routes>
          <Route path="/" element={<HomePage tasks={tasks} news={sampleNews} />} />
          <Route path="/missions" element={<MissionsPage tasks={tasks} setTasks={setTasks} profile={profile} />} />
          <Route path="/profile" element={<ProfilePage profile={profile} setProfile={setProfile} account={account} />} />
          <Route path="/news" element={<NewsPage news={sampleNews} />} />
          <Route path="/soldiers" element={<SoldiersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function Header({ account, onConnect, onDisconnect }: any) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const close = () => setDrawerOpen(false)

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="/redline logo.jpg" alt="Redline" className="logo-img" />
          <div className="logo-text">
            <span className="redline">REDLINE</span>
            <span className="hub">ARMY</span>
          </div>
        </div>

        <div className="header-right">
          <button className="menu-btn" onClick={() => setDrawerOpen(true)}>MENU</button>
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
        </div>
      </header>

      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={close} />
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span>MENU</span>
          <button onClick={close} className="close-btn">✕</button>
        </div>
        <nav className="drawer-nav">
          <Link to="/" className="drawer-link" onClick={close}>🏠 Home</Link>
          <Link to="/missions" className="drawer-link" onClick={close}>🛡️ Missions</Link>
          <Link to="/profile" className="drawer-link" onClick={close}>👤 Profile</Link>
          <Link to="/news" className="drawer-link" onClick={close}><span className="supra-mark">S</span> Ecosystem News</Link>
          <Link to="/soldiers" className="drawer-link" onClick={close}>⚔️ Soldiers Hub</Link>
        </nav>
      </aside>
    </>
  )
}

function HomePage({ tasks, news }: any) {
  const newestTasks = [...tasks].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)).slice(0, 3)
  const newestNews = news.slice(0, 3)

  return (
    <main className="main">
      <div className="hero">
        <img src="/Redline Banner.jpg" alt="Banner" className="banner" />
        <div className="hero-text">
          <h1>Redline Supra Army</h1>
          <p>One Army. One Chain. One Mission.</p>
        </div>
      </div>

      <section className="highlight-section">
        <h2>Newest Missions</h2>
        <div className="task-list">
          {newestTasks.map((task: Task) => (
            <div key={task.id} className="task">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p className="task-desc">{task.description}</p>
                <span className="points">+{task.points} PTS</span>
              </div>
              <Link to="/missions" className="task-btn">View</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="highlight-section">
        <h2>Latest Ecosystem News</h2>
        <div className="task-list">
          {newestNews.map((item: NewsItem) => (
            <div key={item.id} className="task">
              <div className="task-info">
                <h3>{item.title}</h3>
                <p className="task-desc">{item.summary}</p>
                <span className="points">{item.date}</span>
              </div>
              <Link to="/news" className="task-btn">Read</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
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
    <main className="main">
      <div className="hero">
        <img src="/Redline Banner.jpg" alt="Banner" className="banner" />
        <div className="hero-text">
          <h1>Active Missions</h1>
          <p>Complete tasks. Earn points. Rise in rank.</p>
        </div>
      </div>

      <div className="points-card">
        <div className="points-info">
          <div className="label">Current Score</div>
          <div className="points-value">{profile.points}</div>
          <div className="points-sub">Rank: {profile.rank}</div>
        </div>
      </div>

      <section className="tasks">
        <h2>All Missions</h2>
        <div className="task-list">
          {tasks.map((task: Task) => (
            <div key={task.id} className="task">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p className="task-desc">{task.description}</p>
                <span className="points">+{task.points} PTS</span>
                {task.status !== 'available' && <span className="status"> • {task.status.toUpperCase()}</span>}
              </div>
              <button className="task-btn" onClick={() => handleTaskAction(task)} disabled={task.status !== 'available'}>
                {task.status === 'available' ? 'Start' : task.status}
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedTask.title}</h3>
            <p>{selectedTask.description}</p>
            <textarea placeholder="Paste the link or details..." value={submissionText} onChange={e => setSubmissionText(e.target.value)} rows={5} />
            <div className="modal-actions">
              <button onClick={() => setSelectedTask(null)} className="disconnect-btn">Cancel</button>
              <button onClick={submitForm} className="connect-btn">Submit for Review</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function ProfilePage({ profile, setProfile, account }: any) {
  const [saved, setSaved] = useState(false)
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((p: UserProfile) => ({ ...p, [field]: value }))
    setSaved(false)
  }
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <main className="main">
      <h1 className="page-title">Soldier Profile</h1>
      <div className="profile-header">
        <div className="rank-badge">{profile.rank.toUpperCase()}</div>
        <div className="profile-summary">
          <div className="name">{profile.name || 'Unnamed Soldier'}</div>
          <div className="wallet-short">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Wallet not connected'}</div>
        </div>
      </div>
      <div className="profile-card">
        <div className="profile-row"><label>Display Name</label><input value={profile.name} onChange={e => handleChange('name', e.target.value)} placeholder="Your callsign or name" /></div>
        <div className="profile-row"><label>Supra DNS</label><input value={profile.supraDns} onChange={e => handleChange('supraDns', e.target.value)} placeholder="yourname.supra" /></div>
        <div className="profile-row"><label>X / Twitter</label><input value={profile.twitter} onChange={e => handleChange('twitter', e.target.value)} placeholder="@username" /></div>
        <div className="profile-row"><label>Telegram</label><input value={profile.telegram} onChange={e => handleChange('telegram', e.target.value)} placeholder="@username" /></div>
        <div className="profile-row"><label>Wallet ID</label><span className="value">{account || 'Not connected'}</span></div>
        <div className="profile-row"><label>Current Rank</label><span className="value rank">{profile.rank}</span></div>
        <div className="profile-row"><label>Points</label><span className="value">{profile.points}</span></div>
      </div>
      <div className="profile-actions">
        <button onClick={handleSave} className="connect-btn">Save Profile</button>
        {saved && <span className="saved-msg">Profile saved</span>}
      </div>
      <p className="profile-note">Rank and points will update automatically once on-chain verification is live.</p>
    </main>
  )
}

function NewsPage({ news }: any) {
  return (
    <main className="main">
      <h1 className="page-title">Supra Ecosystem News</h1>
      <div className="task-list">
        {news.map((item: NewsItem) => (
          <div key={item.id} className="task">
            <div className="task-info">
              <h3>{item.title}</h3>
              <p className="task-desc">{item.summary}</p>
              <span className="points">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

function SoldiersPage() {
  const sampleSoldiers = [
    { name: 'Alpha', rank: 'Captain', points: 1250, supra: 'alpha.supra' },
    { name: 'Bravo', rank: 'Sergeant', points: 840, supra: 'bravo.supra' },
    { name: 'Charlie', rank: 'Soldier', points: 510, supra: 'charlie.supra' },
  ]
  return (
    <main className="main">
      <h1 className="page-title">Soldiers Standing Strong</h1>
      <p style={{ marginBottom: '1.2rem', color: '#888' }}>Soldiers actively supporting the Supra blockchain.</p>
      <div className="task-list">
        {sampleSoldiers.map((s, i) => (
          <div key={i} className="task">
            <div className="task-info">
              <h3>{s.name}</h3>
              <p className="task-desc">{s.supra} • {s.rank}</p>
              <span className="points">{s.points} PTS</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App