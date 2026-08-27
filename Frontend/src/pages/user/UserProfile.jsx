import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, apiFetchRaw } from '../../services/api';
import { User, Phone, GraduationCap, FileText, Upload, CheckCircle2, AlertCircle, Save, BriefcaseBusiness, Sparkles, ShieldCheck } from 'lucide-react';

function MessageBanner({ message }) {
  if (!message.text) return null;
  const isSuccess = message.type === 'success';
  return (
    <div className={`profile-message profile-message--${isSuccess ? 'success' : 'error'}`} role={isSuccess ? 'status' : 'alert'}>
      {isSuccess ? <CheckCircle2 size={17} aria-hidden="true" /> : <AlertCircle size={17} aria-hidden="true" />}
      <span>{message.text}</span>
    </div>
  );
}

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [contact, setContact] = useState(user?.contact || '');
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || 'Bachelor Degree');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.fieldOfStudy || '');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : '');
  const [interests, setInterests] = useState(user?.interests ? user.interests.join(', ') : '');
  const [workExperience, setWorkExperience] = useState(user?.workExperience || '');
  const [resumeFile, setResumeFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [resumeMsg, setResumeMsg] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          contact,
          educationLevel,
          institution,
          fieldOfStudy,
          skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
          interests: interests ? interests.split(',').map((i) => i.trim()).filter(Boolean) : [],
          workExperience
        })
      });

      if (res.user) {
        setUser(res.user);
        localStorage.setItem('pathseeker_user', JSON.stringify(res.user));
      }
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile. Make sure the server is running.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setUploadLoading(true);
    setResumeMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const data = await apiFetchRaw('/upload-resume', {
        method: 'POST',
        body: formData
      });
      if (data.resumeUrl) {
        const updatedUser = { ...user, resumeUrl: data.resumeUrl };
        setUser(updatedUser);
        localStorage.setItem('pathseeker_user', JSON.stringify(updatedUser));
        setResumeMsg({ type: 'success', text: 'Resume uploaded successfully!' });
        setResumeFile(null);
      }
    } catch (err) {
      setResumeMsg({ type: 'error', text: err.message || 'Resume upload failed. Make sure the server is running.' });
    } finally {
      setUploadLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const displayName = name || 'Your name';
  const profileFields = [name, contact, educationLevel, institution, fieldOfStudy, skills, interests, workExperience];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <div className="user-page profile-page">
      <header className="profile-page-header">
        <div>
          <span className="profile-eyebrow"><ShieldCheck size={14} aria-hidden="true" /> {isAdmin ? 'Administrator settings' : 'Career passport'}</span>
          <h1>{isAdmin ? 'Admin profile settings' : 'Manage your profile'}</h1>
          <p>{isAdmin ? 'Keep your administrator identity and account details up to date.' : 'Shape the profile PathSeeker uses to personalize your career guidance.'}</p>
        </div>
        <div className="profile-header-status"><span className="profile-status-dot" /> {completion}% complete</div>
      </header>

      <div className="profile-layout">
        <aside className="profile-summary glass-panel">
          <div className="profile-avatar-large">{displayName.charAt(0).toUpperCase()}</div>
          <h2>{displayName}</h2>
          <p className="profile-summary-role">{isAdmin ? 'Platform administrator' : `${user?.role || 'student'} passport`}</p>
          <div className="profile-progress-label"><span>Profile strength</span><strong>{completion}%</strong></div>
          <div className="profile-progress"><span style={{ width: `${completion}%` }} /></div>
          <p className="profile-summary-note">A complete profile gives your recommendations more useful context.</p>
          <div className="profile-summary-list">
            <span><User size={15} aria-hidden="true" /> {emailLabel(user?.email)}</span>
            <span><BriefcaseBusiness size={15} aria-hidden="true" /> {educationLevel || 'Add your education'}</span>
            <span><Sparkles size={15} aria-hidden="true" /> {skills ? 'Skills added' : 'Add your skills'}</span>
          </div>
        </aside>

        <div className="profile-settings-column">
          <MessageBanner message={profileMsg} />
          <form onSubmit={handleUpdate} className="profile-form">
            <section className="profile-section glass-panel">
              <div className="profile-section-heading"><span className="profile-section-icon"><User size={17} /></span><div><h2>Personal details</h2><p>The basics people and recommendations use to identify you.</p></div></div>
              <div className="profile-form-grid">
                <label className="profile-field"><span>Full name</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
                <label className="profile-field"><span>Contact phone</span><input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" /></label>
              </div>
            </section>

            <section className="profile-section glass-panel">
              <div className="profile-section-heading"><span className="profile-section-icon"><GraduationCap size={17} /></span><div><h2>Education</h2><p>Tell us where you are in your learning journey.</p></div></div>
              <div className="profile-form-grid">
                <label className="profile-field"><span>Education level</span><select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}><option value="High School">High School</option><option value="Undergraduate">Undergraduate</option><option value="Bachelor Degree">Bachelor Degree</option><option value="Master Degree">Master Degree</option><option value="PhD / Doctorate">PhD / Doctorate</option></select></label>
                <label className="profile-field"><span>Field of study</span><input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} placeholder="Computer science, finance..." /></label>
                <label className="profile-field profile-field--wide"><span>Institution or university</span><input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Where did you study?" /></label>
              </div>
            </section>

            <section className="profile-section glass-panel">
              <div className="profile-section-heading"><span className="profile-section-icon"><Sparkles size={17} /></span><div><h2>Direction signals</h2><p>These details help tailor career matches and next steps.</p></div></div>
              <div className="profile-form-stack">
                <label className="profile-field"><span>Key skills <small>Separate with commas</small></span><input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, React, Figma, SQL..." /></label>
                <label className="profile-field"><span>Career interests <small>Separate with commas</small></span><input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="AI, healthcare tech, fintech..." /></label>
                <label className="profile-field"><span>Work experience summary</span><textarea rows={4} value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="Roles, projects, or experience you want to build on..." /></label>
              </div>
            </section>

            <div className="profile-form-actions"><span>Your changes are saved to your passport.</span><button type="submit" disabled={saving} className="btn-primary"><Save size={16} /> {saving ? 'Saving profile...' : 'Save profile changes'}</button></div>
          </form>

          <section className="profile-section profile-resume-section glass-panel">
            <div className="profile-section-heading"><span className="profile-section-icon"><FileText size={17} /></span><div><h2>Resume</h2><p>Attach a PDF or DOCX to keep your application materials ready.</p></div></div>
            {user?.resumeUrl && <div className="profile-file-current"><CheckCircle2 size={16} aria-hidden="true" /> Resume on file <a href={user.resumeUrl} target="_blank" rel="noreferrer">View current resume</a></div>}
            <MessageBanner message={resumeMsg} />
            <form onSubmit={handleResumeUpload} className="profile-upload-form"><label className="profile-file-input"><FileText size={17} aria-hidden="true" /><span>{resumeFile ? resumeFile.name : 'Choose a resume file'}</span><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { setResumeFile(e.target.files[0]); setResumeMsg({ type: '', text: '' }); }} /></label><button type="submit" disabled={!resumeFile || uploadLoading} className="btn-secondary"><Upload size={16} /> {uploadLoading ? 'Uploading...' : 'Attach resume'}</button></form>
          </section>
        </div>
      </div>
    </div>
  );
}

function emailLabel(email) {
  return email || 'Account email';
}
