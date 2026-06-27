import React, { useState, useEffect } from 'react';

function App() {
  // --- ÉTATS NAVIGATION & AUTH ---
  const [currentPage, setCurrentPage] = useState('signin'); // 'signin', 'signup', 'docia'
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'history', 'settings'
  const [userId, setUserId] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false); // Visibilité Connexion
  const [showSignUpPassword, setShowSignUpPassword] = useState(false); // Visibilité Inscription

  // --- ÉTATS APPLICATION ---
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [articleId, setArticleId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Récupérer l'historique quand on bascule sur l'onglet correspondant
  useEffect(() => {
    if (activeTab === 'history' && userId) {
      fetchHistory();
    }
  }, [activeTab]);

  // --- LOGIQUE AUTH ---
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMessage('Compte créé ! Connectez-vous.');
        setCurrentPage('signin');
        setShowSignUpPassword(false);
      } else {
        setAuthMessage(`Erreur : ${data.message}`);
      }
    } catch (error) {
      setAuthMessage('Erreur serveur.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMessage('');
        setUserId(data.userId);
        setCurrentPage('docia');
        setShowSignInPassword(false);
      } else {
        setAuthMessage(`Erreur : ${data.message}`);
      }
    } catch (error) {
      setAuthMessage('Erreur serveur.');
    }
  };

  const handleLogout = () => {
    setCurrentPage('signin');
    setUserId('');
    setAuthEmail('');
    setAuthPassword('');
    setShowSignInPassword(false);
    setShowSignUpPassword(false);
    setFile(null);
    setArticleId('');
    setAnswer('');
    setHistory([]);
  };

  // --- LOGIQUE DOCIA APP ---
  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus(`Fichier sélectionné : ${e.target.files[0].name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Veuillez d\'abord choisir un document.');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apiKey', apiKey);
    formData.append('userId', userId);

    try {
      setUploadStatus('Téléversement...');
      const response = await fetch('http://localhost:5000/api/articles/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setArticleId(data.articleId);
        setUploadStatus('Document chargé avec succès !');
      } else {
        setUploadStatus(`Erreur : ${data.message}`);
      }
    } catch (error) {
      setUploadStatus('Erreur de connexion.');
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question) return;
    loading(true);
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, question }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(`Erreur : ${data.message}`);
      }
    } catch (error) {
      setAnswer('Erreur d’envoi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/articles?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setHistory(data);
      }
    } catch (error) {
      console.error("Impossible d'obtenir l'historique.");
    }
  };

  // --- RENDU PAGES ---

  if (currentPage === 'signin') {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authHeaderZone}>
          <div style={styles.logoIconBox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          </div>
          <h1 style={styles.mainTitle}>DocIA</h1>
          <p style={styles.mainSubtitle}>Analyse assistée de documents scientifiques</p>
        </div>

        <div style={styles.authCard}>
          <h2 style={styles.cardTitle}>Connexion</h2>
          {authMessage && <p style={styles.statusText}>{authMessage}</p>}
          
          <form onSubmit={handleSignIn} style={styles.authForm}>
            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>Adresse e-mail</label>
              <input type="email" placeholder="vous@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={styles.authInput} required />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showSignInPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={authPassword} 
                  onChange={(e) => setAuthPassword(e.target.value)} 
                  style={styles.authInput} 
                  required 
                />
                <span 
                  style={styles.eyeIcon} 
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                >
                  {showSignInPassword ? '🙈' : '👁'}
                </span>
              </div>
            </div>

            <button type="submit" style={styles.btnBlue}>Se connecter</button>
          </form>

          <div style={styles.dividerZone}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>ou</span>
          </div>

          <p style={styles.authFooter}>
            Pas encore de compte ? <span style={styles.linkBlue} onClick={() => { setCurrentPage('signup'); setAuthMessage(''); }}>Créer un compte</span>
          </p>
        </div>
        <p style={styles.bottomSecuredText}>Vos données sont chiffrées et sécurisées.</p>
      </div>
    );
  }

  if (currentPage === 'signup') {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authHeaderZone}>
          <div style={styles.logoIconBox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          </div>
          <h1 style={styles.mainTitle}>DocIA</h1>
        </div>

        <div style={styles.authCard}>
          <h2 style={styles.cardTitle}>Créer un compte</h2>
          {authMessage && <p style={styles.statusText}>{authMessage}</p>}
          
          <form onSubmit={handleSignUp} style={styles.authForm}>
            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>Adresse e-mail</label>
              <input type="email" placeholder="vous@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={styles.authInput} required />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showSignUpPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={authPassword} 
                  onChange={(e) => setAuthPassword(e.target.value)} 
                  style={styles.authInput} 
                  required 
                />
                <span 
                  style={styles.eyeIcon} 
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                >
                  {showSignUpPassword ? '🙈' : '👁'}
                </span>
              </div>
            </div>

            <button type="submit" style={styles.btnBlue}>S'inscrire</button>
          </form>

          <div style={styles.dividerZone}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>ou</span>
          </div>

          <p style={styles.authFooter}>
            Déjà inscrit ? <span style={styles.linkBlue} onClick={() => { setCurrentPage('signin'); setAuthMessage(''); }}>Se connecter</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      {/* Barre Supérieure de Navigation Global */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.navLogoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          </div>
          <span style={styles.navLogoText}>DocIA</span>
          <span style={styles.versionBadge}>v1.0</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userEmailText}>👤 {authEmail || 'utilisateur@example.com'}</span>
          <button style={styles.btnLogoutStyle} onClick={handleLogout}>
            <span style={{ marginRight: '6px' }}>⇄</span> Déconnexion
          </button>
        </div>
      </header>

      {/* Zone Principale de Contenu */}
      <main style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <h2 style={styles.sectionTitle}>Analyser un document</h2>
          <p style={styles.sectionSubtitle}>Importez un article scientifique et interrogez-le en langage naturel.</p>
        </div>

        {/* Sélecteur d'Onglets Segmenté */}
        <div style={styles.segmentedTabs}>
          <button style={activeTab === 'upload' ? styles.segTabActive : styles.segTab} onClick={() => setActiveTab('upload')}>
            📄 Analyser
          </button>
          <button style={activeTab === 'history' ? styles.segTabActive : styles.segTab} onClick={() => setActiveTab('history')}>
            🕒 Historique
          </button>
          <button style={activeTab === 'settings' ? styles.segTabActive : styles.segTab} onClick={() => setActiveTab('settings')}>
            ⚙ Paramètres
          </button>
        </div>

        {/* Vues Actives */} 
        {activeTab === 'upload' && (
          <div style={styles.tabViewContainer}>
            {/* Zone de Dépôt */}
            <div style={styles.dropZoneContainer} onClick={triggerFileInput}>
              <input id="file-input" type="file" accept=".pdf,.txt,.md" onChange={handleFileChange} style={{ display: 'none' }} />
              <div style={styles.folderIcon}>📁</div>
              <p style={styles.dropMainText}>Déposez votre document ici</p>
              <p style={styles.dropActionText}>ou <span style={{ color: '#3b82f6' }}>parcourez vos fichiers</span></p>
              <p style={styles.dropFormatHint}>PDF • TXT • Markdown — 10 Mo max</p>
            </div>

            {file && <button onClick={handleUpload} style={styles.btnSecondary}>Valider et charger le document</button>}
            {uploadStatus && <p style={styles.statusTextBlue}>{uploadStatus}</p>}

            {/* Section Questions Réponses */}
            {articleId && (
              <div style={styles.questionSection}>
                <form onSubmit={handleAsk} style={styles.formQuestion}>
                  <input type="text" placeholder="Posez une question sur le document..." value={question} onChange={(e) => setQuestion(e.target.value)} style={styles.appInputQuestion} />
                  <button type="submit" disabled={loading} style={styles.btnBlue}>{loading ? 'Envoi...' : 'Poser la question'}</button>
                </form>
                {answer && (
                  <div style={styles.answerBox}>
                    <strong style={{ color: '#3b82f6', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Réponse :</strong>
                    <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>{answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={styles.historyContainer}>
            {history.length === 0 ? (
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>Aucun document disponible dans l'historique.</p>
            ) : (
              <div style={styles.historyList}>
                {history.map((item) => (
                  <div key={item._id} style={styles.historyItem}>
                    <span style={{ color: '#e2e8f0', fontSize: '14px' }}>📄 {item.filename}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={styles.historyContainer}>
            <div style={styles.settingsRow}>
              <span style={styles.settingsLabel}>Identifiant Session</span>
              <code style={styles.codeBlock}>{userId || 'Non connecté'}</code>
            </div>
            <div style={styles.settingsRow}>
              <span style={styles.settingsLabel}>Email Utilisateur</span>
              <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{authEmail || 'N/A'}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- FEUILLE DE STYLE ---
const styles = {
  authContainer: { backgroundColor: '#0b0f17', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  authHeaderZone: { textAlign: 'center', marginBottom: '24px' },
  logoIconBox: { backgroundColor: '#2563eb', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' },
  mainTitle: { color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' },
  mainSubtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  authCard: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '32px', boxSizing: 'border-box' },
  cardTitle: { fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 24px 0' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  inputLabel: { color: '#94a3b8', fontSize: '13px', fontWeight: '500' },
  authInput: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px 14px', color: '#ffffff', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' },
  eyeIcon: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', cursor: 'pointer', fontSize: '14px', userSelect: 'none' },
  btnBlue: { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', textAlign: 'center' },
  dividerZone: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '20px 0' },
  dividerLine: { position: 'absolute', width: '100%', height: '1px', backgroundColor: '#1f2937', zIndex: 1 },
  dividerText: { backgroundColor: '#111827', padding: '0 12px', color: '#475569', fontSize: '12px', zIndex: 2, position: 'relative' },
  authFooter: { textAlign: 'center', fontSize: '14px', margin: 0, color: '#94a3b8' },
  linkBlue: { color: '#2563eb', cursor: 'pointer', fontWeight: '500' },
  bottomSecuredText: { color: '#475569', fontSize: '12px', marginTop: '24px' },
  statusText: { color: '#f87171', fontSize: '13px', margin: '0 0 16px 0', textAlign: 'center' },

  appContainer: { backgroundColor: '#060811', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#e2e8f0' },
  navbar: { height: '56px', backgroundColor: '#0b0f19', borderBottom: '1px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogoIcon: { backgroundColor: '#2563eb', width: '24px', height: '24px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navLogoText: { color: '#ffffff', fontWeight: '700', fontSize: '15px' },
  versionBadge: { backgroundColor: '#1e293b', color: '#3b82f6', fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '10px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  userEmailText: { color: '#94a3b8', fontSize: '13px' },
  btnLogoutStyle: { backgroundColor: '#1c1012', border: '1px solid #3b181a', color: '#f87171', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
  
  mainContent: { maxWidth: '800px', margin: '0 auto', padding: '48px 24px' },
  contentHeader: { marginBottom: '24px' },
  sectionTitle: { fontSize: '22px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0' },
  sectionSubtitle: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  
  segmentedTabs: { display: 'flex', backgroundColor: '#0d1321', border: '1px solid #161f38', borderRadius: '8px', padding: '4px', gap: '4px', marginBottom: '24px', maxWidth: '400px' },
  segTab: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#64748b', padding: '8px 12px', fontSize: '13px', fontWeight: '500', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  segTabActive: { flex: 1, backgroundColor: '#161f38', border: 'none', color: '#3b82f6', padding: '8px 12px', fontSize: '13px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },

  tabViewContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  
  dropZoneContainer: { border: '1px dashed #1e293b', backgroundColor: '#080c14', borderRadius: '12px', padding: '48px 20px', textAlign: 'center', cursor: 'pointer' },
  folderIcon: { fontSize: '28px', color: '#9a3412', marginBottom: '16px' },
  dropMainText: { fontSize: '15px', fontWeight: '600', color: '#ffffff', margin: '0 0 4px 0' },
  dropActionText: { fontSize: '13px', color: '#94a3b8', margin: '0 0 8px 0' },
  dropFormatHint: { fontSize: '11px', color: '#475569', margin: 0 },

  btnSecondary: { backgroundColor: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', alignSelf: 'center' },
  statusTextBlue: { color: '#3b82f6', fontSize: '13px', textAlign: 'center', margin: 0 },

  questionSection: { marginTop: '16px' },
  formQuestion: { display: 'flex', gap: '12px' },
  appInputQuestion: { flex: 1, backgroundColor: '#0b1120', border: '1px solid #16223f', borderRadius: '8px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' },
  answerBox: { marginTop: '16px', padding: '16px', backgroundColor: '#0b1120', border: '1px solid #16223f', borderRadius: '8px' },

  historyContainer: { backgroundColor: '#0b1120', border: '1px solid #16223f', borderRadius: '10px', padding: '20px' },
  historyList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #16223f' },
  settingsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #16223f' },
  settingsLabel: { color: '#94a3b8', fontSize: '14px' },
  codeBlock: { fontFamily: 'monospace', backgroundColor: '#070b14', padding: '4px 8px', borderRadius: '4px', color: '#f43f5e', fontSize: '13px' }
};

export default App;