(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const lang = () => window.MijnTelewerkApp?.getLanguage?.() || 'nl';
  const msg = (nl, fr, en) => lang() === 'fr' ? fr : lang() === 'en' ? en : nl;
  const tr = (key, vars = {}) => window.MijnTelewerkApp?.t?.(key, vars) || key;
  const cfg = window.MIJNTELEWERK_CONFIG || {};
  const browserKey = cfg.SUPABASE_PUBLISHABLE_KEY || cfg.SUPABASE_ANON_KEY || '';
  const configured = Boolean(cfg.SUPABASE_URL && browserKey && window.supabase?.createClient);

  const AUTO_SYNC_KEY = 'mijntelewerk_auto_sync_v2';
  const LEGACY_AUTO_SYNC_KEY = 'mijntelewerk_auto_sync_v1';
  const SYNC_META_PREFIX = 'mijntelewerk_sync_meta_v2';
  const AUTO_SYNC_DELAY = 1100;
  const ACCOUNT_PROMO_KEY = 'mijntelewerk_account_promo_v1';
  const ACCOUNT_PROMO_SESSION_KEY = 'mijntelewerk_account_promo_visit_v1';
  const ACCOUNT_PROMO_DELAY = 45000;
  const ACCOUNT_PROMO_LATER_DAYS = 7;

  let client = null;
  let currentUser = null;
  let syncTimer = null;
  let syncBusy = false;
  let reconcileBusy = false;
  let suppressStateEvents = false;
  let profileRecord = null;
  let reminderRecord = null;

  function app() { return window.MijnTelewerkApp; }
  function selectedYear() { return app()?.getSelectedYear?.() || new Date().getFullYear(); }
  function autoSyncEnabled() { return localStorage.getItem(AUTO_SYNC_KEY) === '1'; }


  function getPromoState() {
    try {
      return { visits:0, disabled:false, dismissedUntil:0, lastPromptAt:0, ...JSON.parse(localStorage.getItem(ACCOUNT_PROMO_KEY) || '{}') };
    } catch {
      return { visits:0, disabled:false, dismissedUntil:0, lastPromptAt:0 };
    }
  }

  function savePromoState(value) {
    localStorage.setItem(ACCOUNT_PROMO_KEY, JSON.stringify(value));
  }

  function registerPromoVisit() {
    if (sessionStorage.getItem(ACCOUNT_PROMO_SESSION_KEY) === '1') return;
    sessionStorage.setItem(ACCOUNT_PROMO_SESSION_KEY, '1');
    const promo = getPromoState();
    promo.visits = Number(promo.visits || 0) + 1;
    savePromoState(promo);
  }

  function plannedDateCount() {
    try {
      const payload = app()?.exportYearPayload?.(selectedYear());
      return Object.values(payload?.days || {}).filter(slots => slots && (slots.am || slots.pm)).length;
    } catch {
      return 0;
    }
  }

  function anotherDialogOpen() {
    return [...document.querySelectorAll('dialog[open]')].some(d => d.id !== 'accountPromoDialog');
  }

  function accountPromoEligible() {
    if (!configured || currentUser) return false;
    const promo = getPromoState();
    if (promo.disabled || Date.now() < Number(promo.dismissedUntil || 0)) return false;
    const planned = plannedDateCount();
    // Toon pas wanneer de gebruiker aantoonbaar waarde uit de planner haalt:
    // 6 ingevulde kalenderdagen tijdens het eerste bezoek, of vanaf het tweede bezoek met minstens 2 dagen.
    return planned >= 6 || (Number(promo.visits || 0) >= 2 && planned >= 2);
  }

  function maybeShowAccountPromo() {
    const dlg = $('accountPromoDialog');
    if (!dlg || dlg.open || anotherDialogOpen() || !accountPromoEligible()) return;
    const promo = getPromoState();
    // Maximaal één spontane aanbeveling per 24 uur, zelfs als een browser het dialoogvenster zelf sluit.
    if (Date.now() - Number(promo.lastPromptAt || 0) < 86400000) return;
    promo.lastPromptAt = Date.now();
    savePromoState(promo);
    dlg.showModal();
  }

  function scheduleAccountPromo(delay = ACCOUNT_PROMO_DELAY) {
    if (!configured || currentUser) return;
    clearTimeout(scheduleAccountPromo.timer);
    scheduleAccountPromo.timer = setTimeout(maybeShowAccountPromo, delay);
  }

  function bindAccountPromo() {
    $('promoCreateAccountBtn')?.addEventListener('click', () => {
      $('accountPromoDialog')?.close();
      openDialog();
    });
    $('promoLaterBtn')?.addEventListener('click', () => {
      const promo = getPromoState();
      promo.dismissedUntil = Date.now() + ACCOUNT_PROMO_LATER_DAYS * 86400000;
      savePromoState(promo);
      $('accountPromoDialog')?.close();
    });
    $('promoNeverBtn')?.addEventListener('click', () => {
      const promo = getPromoState();
      promo.disabled = true;
      savePromoState(promo);
      $('accountPromoDialog')?.close();
    });
  }

  function migrateAutoSyncSetting() {
    if (localStorage.getItem(AUTO_SYNC_KEY) == null && localStorage.getItem(LEGACY_AUTO_SYNC_KEY) === '1') {
      localStorage.setItem(AUTO_SYNC_KEY, '1');
    }
    localStorage.removeItem(LEGACY_AUTO_SYNC_KEY);
  }

  function showState(name) {
    ['accountNotConfigured', 'accountSignedOut', 'accountSignedIn'].forEach(id => $(id)?.classList.add('hidden'));
    $(name)?.classList.remove('hidden');
  }

  function setFeedback(message, type = '') {
    const node = $('authFeedback');
    if (!node) return;
    node.textContent = message;
    node.className = `account-feedback ${type}`;
  }

  function setSyncBadge(text, mode = '') {
    const badge = $('syncBadge');
    if (!badge) return;
    badge.textContent = text;
    badge.className = `sync-badge ${mode}`;
  }

  function setCloudStatus(text) {
    const node = $('cloudStatusText');
    if (node) node.textContent = text;
  }

  function renderAccountButton() {
    const btn = $('accountBtn'), label = $('accountLabel'), icon = $('accountIcon');
    if (!btn) return;
    if (currentUser) {
      btn.classList.add('signed-in');
      label.textContent = tr('myAccount');
      icon.textContent = '✓';
    } else {
      btn.classList.remove('signed-in');
      label.textContent = tr('account');
      icon.textContent = '👤︎';
    }
  }

  function renderSignedIn() {
    $('signedInEmail').textContent = currentUser?.email || msg('Ingelogd', 'Connecté', 'Signed in');
    $('accountYearLabel').textContent = selectedYear();
    $('autoSyncToggle').checked = autoSyncEnabled();
    setSyncBadge(
      autoSyncEnabled() ? msg('Auto-sync aan', 'Synchro auto activée', 'Auto-sync on') : msg('Lokaal', 'Local', 'Local'),
      autoSyncEnabled() ? 'synced' : ''
    );
    renderReminderUi();
    renderPreferencesUi();
  }

  async function openDialog() {
    if (!configured) showState('accountNotConfigured');
    else if (currentUser) {
      showState('accountSignedIn');
      renderSignedIn();
    } else showState('accountSignedOut');
    if (!$('accountDialog').open) $('accountDialog').showModal();
    if (configured && currentUser) {
      await loadAccountSettings();
      reconcileYear({ reason: 'dialog-open', quiet: true });
    }
  }

  async function sendMagicLink(email) {
    setFeedback(msg('Magic link wordt verstuurd…', 'Envoi du lien magique…', 'Sending magic link…'));
    const redirectTo = location.protocol.startsWith('http') ? `${location.origin}${location.pathname}` : undefined;
    const options = redirectTo ? { emailRedirectTo: redirectTo } : undefined;
    const { error } = await client.auth.signInWithOtp({ email, options });
    if (error) {
      setFeedback(error.message, 'error');
      return;
    }
    setFeedback(
      msg('Check je mailbox. De magic link is onderweg. ✉️', 'Vérifiez votre boîte mail. Le lien magique est en route. ✉️', 'Check your inbox. The magic link is on its way. ✉️'),
      'success'
    );
  }

  async function ensureProfile() {
    if (!currentUser) return null;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Brussels';
    const { data, error } = await client.from('profiles').upsert({
      id: currentUser.id,
      language: lang(),
      timezone
    }, { onConflict: 'id' }).select('id,display_name,timezone,language,welcome_back_enabled,welcome_back_min_days,last_welcome_leave_end,updated_at').single();
    if (error) {
      console.warn('Profiel kon niet worden bijgewerkt:', error.message);
      return null;
    }
    profileRecord = data;
    return data;
  }

  async function loadProfileSettings() {
    if (!currentUser) return null;
    const { data, error } = await client.from('profiles')
      .select('id,display_name,timezone,language,welcome_back_enabled,welcome_back_min_days,last_welcome_leave_end,updated_at')
      .eq('id', currentUser.id).maybeSingle();
    if (error) throw error;
    profileRecord = data || await ensureProfile();
    renderPreferencesUi();
    return profileRecord;
  }

  async function loadReminderSettings() {
    if (!currentUser) return null;
    const { data, error } = await client.from('reminder_settings')
      .select('enabled,monthly_mode,day_of_month,timezone,last_acknowledged_period,snoozed_until,updated_at')
      .eq('user_id', currentUser.id).maybeSingle();
    if (error) throw error;
    reminderRecord = data || {
      enabled:false,
      monthly_mode:'last_workday',
      day_of_month:25,
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Brussels',
      last_acknowledged_period:null,
      snoozed_until:null
    };
    renderReminderUi();
    return reminderRecord;
  }

  async function loadAccountSettings() {
    try {
      await Promise.all([loadProfileSettings(), loadReminderSettings()]);
    } catch (err) {
      console.warn('Accountinstellingen konden niet worden geladen:', err);
      if ($('reminderFeedback')) $('reminderFeedback').textContent = msg(`Instellingen laden mislukt: ${err.message}`, `Échec du chargement des paramètres : ${err.message}`, `Failed to load settings: ${err.message}`);
    }
  }

  function renderReminderUi() {
    if (!$('reminderEnabledToggle')) return;
    const r = reminderRecord || { enabled:false, monthly_mode:'last_workday', day_of_month:25 };
    $('reminderEnabledToggle').checked = Boolean(r.enabled);
    $('reminderMonthlyMode').value = r.monthly_mode || 'last_workday';
    $('reminderDayOfMonth').value = r.day_of_month || 25;
    renderReminderFieldVisibility();
  }

  function renderReminderFieldVisibility() {
    if (!$('reminderMonthlyMode')) return;
    const enabled = $('reminderEnabledToggle').checked;
    $('reminderControls')?.classList.toggle('is-disabled', !enabled);
    $('reminderDayOfMonthWrap')?.classList.toggle('hidden', $('reminderMonthlyMode').value !== 'fixed');
  }

  function renderPreferencesUi() {
    if (!$('welcomeBackToggle')) return;
    const p = profileRecord || { welcome_back_enabled:true, welcome_back_min_days:5 };
    $('welcomeBackToggle').checked = p.welcome_back_enabled !== false;
    $('welcomeBackMinDays').value = Number(p.welcome_back_min_days || 5);
  }

  async function saveReminderSettings() {
    if (!currentUser) return;
    const feedback = $('reminderFeedback');
    if (feedback) { feedback.textContent = msg('Opslaan…','Enregistrement…','Saving…'); feedback.className='account-feedback'; }
    const timezone = profileRecord?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Brussels';
    const monthlyMode = $('reminderMonthlyMode').value;
    const row = {
      user_id: currentUser.id,
      enabled: $('reminderEnabledToggle').checked,
      cadence: 'monthly',
      monthly_mode: monthlyMode,
      weekday: null,
      day_of_month: monthlyMode === 'fixed' ? Math.min(28, Math.max(1, Number($('reminderDayOfMonth').value) || 25)) : null,
      timezone
    };
    const { data, error } = await client.from('reminder_settings').upsert(row, { onConflict:'user_id' })
      .select('enabled,monthly_mode,day_of_month,timezone,last_acknowledged_period,snoozed_until,updated_at').single();
    if (error) {
      if (feedback) { feedback.textContent = error.message; feedback.className='account-feedback error'; }
      return;
    }
    reminderRecord = data;
    renderReminderUi();
    if (feedback) { feedback.textContent = tr('reminderSaved'); feedback.className='account-feedback success'; }
    setTimeout(checkTeleworkReminder, 250);
  }

  async function savePreferences() {
    if (!currentUser) return;
    const feedback = $('preferencesFeedback');
    if (feedback) { feedback.textContent = msg('Opslaan…','Enregistrement…','Saving…'); feedback.className='account-feedback'; }
    const row = {
      id: currentUser.id,
      language: lang(),
      timezone: profileRecord?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Brussels',
      welcome_back_enabled: $('welcomeBackToggle').checked,
      welcome_back_min_days: Math.min(30, Math.max(2, Number($('welcomeBackMinDays').value) || 5))
    };
    const { data, error } = await client.from('profiles').upsert(row, { onConflict:'id' })
      .select('id,display_name,timezone,language,welcome_back_enabled,welcome_back_min_days,last_welcome_leave_end,updated_at').single();
    if (error) {
      if (feedback) { feedback.textContent = error.message; feedback.className='account-feedback error'; }
      return;
    }
    profileRecord = data;
    renderPreferencesUi();
    if (feedback) { feedback.textContent = tr('preferencesSaved'); feedback.className='account-feedback success'; }
  }

  async function cloudRecord(year = selectedYear()) {
    if (!currentUser) throw new Error(msg('Je bent niet ingelogd.', 'Vous n’êtes pas connecté.', 'You are not signed in.'));
    const { data, error } = await client
      .from('planning_years')
      .select('year,max_telework_percent,categories,days,settings,updated_at')
      .eq('user_id', currentUser.id)
      .eq('year', year)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  function payloadForRecord(record) {
    return {
      maxPercent: Number(record?.max_telework_percent ?? 60),
      categories: record?.categories || [],
      days: record?.days || {},
      language: record?.settings?.language,
      autoHolidays: record?.settings?.autoHolidays,
      workingWeekdays: record?.settings?.workingWeekdays,
      standardTeleworkWeekdays: record?.settings?.standardTeleworkWeekdays,
      removedDefaultCategories: record?.settings?.removedDefaultCategories
    };
  }

  function syncComparableFromLocal(year = selectedYear()) {
    const payload = app().exportYearPayload(year);
    return {
      maxPercent: Number(payload.maxPercent ?? 60),
      categories: payload.categories || [],
      days: payload.days || {},
      language: payload.language,
      autoHolidays: payload.autoHolidays,
      workingWeekdays: payload.workingWeekdays || [],
      standardTeleworkWeekdays: payload.standardTeleworkWeekdays || [],
      removedDefaultCategories: payload.removedDefaultCategories || []
    };
  }

  function stableSortObject(value) {
    if (Array.isArray(value)) return value.map(stableSortObject);
    if (value && typeof value === 'object') {
      return Object.keys(value).sort().reduce((acc, key) => {
        acc[key] = stableSortObject(value[key]);
        return acc;
      }, {});
    }
    return value;
  }

  function fingerprint(value) {
    return JSON.stringify(stableSortObject(value));
  }

  function localFingerprint(year = selectedYear()) {
    return fingerprint(syncComparableFromLocal(year));
  }

  function remoteFingerprint(record) {
    return fingerprint(payloadForRecord(record));
  }

  function metaKey(year = selectedYear()) {
    const project = String(cfg.SUPABASE_URL || '').replace(/^https?:\/\//, '').split('.')[0] || 'project';
    return `${SYNC_META_PREFIX}:${project}:${currentUser?.id || 'anonymous'}:${year}`;
  }

  function getSyncMeta(year = selectedYear()) {
    try {
      return JSON.parse(localStorage.getItem(metaKey(year)) || 'null');
    } catch {
      return null;
    }
  }

  function setSyncMeta(year, record, fp = localFingerprint(year)) {
    if (!currentUser || !record?.updated_at) return;
    localStorage.setItem(metaKey(year), JSON.stringify({
      cloudUpdatedAt: record.updated_at,
      localFingerprint: fp,
      syncedAt: new Date().toISOString()
    }));
  }

  function clearSyncMetaForUser() {
    if (!currentUser) return;
    const suffix = `:${currentUser.id}:`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`${SYNC_META_PREFIX}:`) && key.includes(suffix)) localStorage.removeItem(key);
    });
  }

  function formatCloudTime(value) {
    if (!value) return '';
    return new Date(value).toLocaleString(window.MijnTelewerkApp?.getLocale?.() || 'nl-BE');
  }

  function markConflict(year, record) {
    clearTimeout(syncTimer);
    setSyncBadge(msg('Conflict', 'Conflit', 'Conflict'), 'conflict');
    setCloudStatus(msg(
      `⚠️ Zowel deze browser als de cloudplanning voor ${year} zijn gewijzigd. Automatische synchronisatie is gepauzeerd. Kies “Upload huidig jaar” om lokaal te behouden of “Laad uit cloud” om de cloudversie te gebruiken.`,
      `⚠️ Ce navigateur et le planning cloud ${year} ont tous deux été modifiés. La synchronisation automatique est suspendue. Choisissez « Envoyer l’année actuelle » pour conserver la version locale ou « Charger depuis le cloud » pour utiliser la version cloud.`,
      `⚠️ Both this browser and the ${year} cloud planning have changed. Auto-sync is paused. Choose “Upload current year” to keep local changes or “Load from cloud” to use the cloud version.`
    ));
    app()?.showToast(msg('⚠️ Synchronisatieconflict: er is niets overschreven.', '⚠️ Conflit de synchronisation : rien n’a été écrasé.', '⚠️ Sync conflict: nothing was overwritten.'), 4200);
    return { status: 'conflict', record };
  }

  async function upsertLocalYear(year, { silent = false, force = false } = {}) {
    if (syncBusy || !currentUser || !app()) return null;
    syncBusy = true;
    let savedFingerprint = null;
    try {
      setSyncBadge(msg('Synchroniseren…', 'Synchronisation…', 'Syncing…'), 'syncing');
      const localPayload = app().exportYearPayload(year);
      savedFingerprint = localFingerprint(year);

      if (!force) {
        const remote = await cloudRecord(year);
        const meta = getSyncMeta(year);
        if (remote) {
          const remoteFp = remoteFingerprint(remote);
          const sameAsLocal = remoteFp === savedFingerprint;
          if (sameAsLocal) {
            setSyncMeta(year, remote, savedFingerprint);
            setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
            setCloudStatus(msg(`Planning ${year} is al up-to-date.`, `Le planning ${year} est déjà à jour.`, `Planning ${year} is already up to date.`));
            return remote;
          }

          if (meta && remote.updated_at !== meta.cloudUpdatedAt && savedFingerprint !== meta.localFingerprint) {
            return markConflict(year, remote);
          }
        }
      }

      const { data, error } = await client.from('planning_years').upsert({
        user_id: currentUser.id,
        year,
        max_telework_percent: localPayload.maxPercent,
        categories: localPayload.categories,
        days: localPayload.days,
        settings: {
          language: localPayload.language,
          autoHolidays: localPayload.autoHolidays,
          workingWeekdays: localPayload.workingWeekdays,
          standardTeleworkWeekdays: localPayload.standardTeleworkWeekdays,
          removedDefaultCategories: localPayload.removedDefaultCategories
        }
      }, { onConflict: 'user_id,year' }).select('year,max_telework_percent,categories,days,settings,updated_at').single();

      if (error) throw error;

      localStorage.setItem(AUTO_SYNC_KEY, '1');
      if ($('autoSyncToggle')) $('autoSyncToggle').checked = true;
      setSyncMeta(year, data, savedFingerprint);
      setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
      setCloudStatus(msg(
        `Planning ${year} is automatisch gesynchroniseerd. Laatste sync: ${formatCloudTime(data.updated_at)}.`,
        `Le planning ${year} est synchronisé automatiquement. Dernière synchro : ${formatCloudTime(data.updated_at)}.`,
        `Planning ${year} is automatically synced. Last sync: ${formatCloudTime(data.updated_at)}.`
      ));
      if (!silent) app().showToast(msg('☁️ Jaarplanning opgeslagen in je account.', '☁️ Planning annuel enregistré dans votre compte.', '☁️ Year planning saved to your account.'));
      return data;
    } catch (err) {
      setSyncBadge(msg('Sync mislukt', 'Échec de synchro', 'Sync failed'));
      if (!silent) app().showToast(msg(`Cloudopslag mislukt: ${err.message}`, `Échec du stockage cloud : ${err.message}`, `Cloud storage failed: ${err.message}`));
      else console.warn('Automatische synchronisatie mislukt:', err);
      return null;
    } finally {
      syncBusy = false;
      if (savedFingerprint && autoSyncEnabled() && currentUser && app() && localFingerprint(year) !== savedFingerprint) {
        scheduleAutoSync();
      }
    }
  }

  async function uploadYear({ silent = false } = {}) {
    if (!currentUser || !app()) return;
    const year = selectedYear();
    try {
      const remote = await cloudRecord(year);
      const meta = getSyncMeta(year);
      const localFp = localFingerprint(year);

      if (remote) {
        const remoteFp = remoteFingerprint(remote);
        if (remoteFp === localFp) {
          setSyncMeta(year, remote, localFp);
          localStorage.setItem(AUTO_SYNC_KEY, '1');
          if ($('autoSyncToggle')) $('autoSyncToggle').checked = true;
          setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
          setCloudStatus(msg(`Planning ${year} is al up-to-date.`, `Le planning ${year} est déjà à jour.`, `Planning ${year} is already up to date.`));
          return;
        }

        const cloudChangedSinceBaseline = meta ? remote.updated_at !== meta.cloudUpdatedAt : true;
        if (cloudChangedSinceBaseline) {
          const ok = confirm(msg(
            `Er staat een andere cloudversie van ${year} (bijgewerkt ${formatCloudTime(remote.updated_at)}). Wil je die bewust overschrijven met deze lokale planning?`,
            `Une autre version cloud de ${year} existe (mise à jour ${formatCloudTime(remote.updated_at)}). Voulez-vous vraiment l’écraser avec ce planning local ?`,
            `A different cloud version of ${year} exists (updated ${formatCloudTime(remote.updated_at)}). Do you really want to overwrite it with this local planning?`
          ));
          if (!ok) {
            setSyncBadge(msg('Niet gewijzigd', 'Non modifié', 'Unchanged'));
            return;
          }
        }
      }
      await upsertLocalYear(year, { silent, force: true });
    } catch (err) {
      setSyncBadge(msg('Upload mislukt', 'Échec de l’envoi', 'Upload failed'));
      app().showToast(msg(`Cloudopslag mislukt: ${err.message}`, `Échec du stockage cloud : ${err.message}`, `Cloud storage failed: ${err.message}`));
    }
  }

  async function importCloudRecord(year, record, { confirmReplace = true, silent = false } = {}) {
    if (!record || !app()) return false;
    if (confirmReplace) {
      const ok = confirm(msg(
        `Je lokale planning voor ${year} vervangen door de cloudversie?`,
        `Remplacer votre planning local de ${year} par la version cloud ?`,
        `Replace your local planning for ${year} with the cloud version?`
      ));
      if (!ok) return false;
    }

    localStorage.setItem(`mijntelewerk_backup_${year}_${Date.now()}`, JSON.stringify(app().exportYearPayload(year)));
    suppressStateEvents = true;
    try {
      app().importYearPayload(year, payloadForRecord(record));
    } finally {
      suppressStateEvents = false;
    }
    setSyncMeta(year, record, localFingerprint(year));
    localStorage.setItem(AUTO_SYNC_KEY, '1');
    if ($('autoSyncToggle')) $('autoSyncToggle').checked = true;
    setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
    setCloudStatus(msg(
      `Cloudplanning ${year} is gesynchroniseerd op dit toestel.`,
      `Le planning cloud ${year} est synchronisé sur cet appareil.`,
      `Cloud planning ${year} is synced on this device.`
    ));
    if (!silent) app().showToast(msg('⬇️ Cloudplanning geladen. Lokale backup bewaard.', '⬇️ Planning cloud chargé. Sauvegarde locale conservée.', '⬇️ Cloud planning loaded. Local backup kept.'));
    return true;
  }

  async function downloadYear() {
    if (!currentUser || !app()) return;
    const year = selectedYear();
    try {
      setSyncBadge(msg('Downloaden…', 'Téléchargement…', 'Downloading…'), 'syncing');
      const record = await cloudRecord(year);
      if (!record) {
        app().showToast(msg('Voor dit jaar staat nog geen planning in je account.', 'Aucun planning dans votre compte pour cette année.', 'There is no planning in your account for this year yet.'));
        setSyncBadge(msg('Nog leeg', 'Vide', 'Empty'));
        return;
      }
      const imported = await importCloudRecord(year, record, { confirmReplace: true });
      if (!imported) setSyncBadge(msg('Niet gewijzigd', 'Non modifié', 'Unchanged'));
    } catch (err) {
      setSyncBadge(msg('Download mislukt', 'Échec du téléchargement', 'Download failed'));
      app().showToast(msg(`Cloudplanning laden mislukt: ${err.message}`, `Échec du chargement du planning cloud : ${err.message}`, `Failed to load cloud planning: ${err.message}`));
    }
  }

  async function reconcileYear({ reason = 'auto', quiet = false } = {}) {
    if (!configured || !currentUser || !app() || !autoSyncEnabled() || syncBusy || reconcileBusy) return;
    reconcileBusy = true;
    const year = selectedYear();
    const meta = getSyncMeta(year);
    const localFp = localFingerprint(year);

    try {
      setSyncBadge(msg('Controleren…', 'Vérification…', 'Checking…'), 'syncing');
      const remote = await cloudRecord(year);

      // First contact for a year on this browser: never silently replace an existing cloud plan.
      if (!meta) {
        if (!remote) {
          await upsertLocalYear(year, { silent: true, force: true });
          return;
        }
        if (remoteFingerprint(remote) === localFp) {
          setSyncMeta(year, remote, localFp);
          setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
          setCloudStatus(msg(`Planning ${year} is gelijk aan de cloudversie. Auto-sync is actief.`, `Le planning ${year} correspond à la version cloud. La synchro auto est active.`, `Planning ${year} matches the cloud version. Auto-sync is active.`));
          return;
        }
        setSyncBadge(msg('Keuze nodig', 'Choix requis', 'Choice needed'));
        setCloudStatus(msg(
          `Er staat al een cloudplanning voor ${year}. Kies één keer “Upload huidig jaar” of “Laad uit cloud”; daarna werkt auto-sync automatisch.`,
          `Un planning cloud existe déjà pour ${year}. Choisissez une fois « Envoyer l’année actuelle » ou « Charger depuis le cloud » ; ensuite la synchro automatique fonctionnera seule.`,
          `A cloud planning already exists for ${year}. Choose “Upload current year” or “Load from cloud” once; after that auto-sync works automatically.`
        ));
        return;
      }

      if (!remote) {
        // The baseline existed locally but the cloud record disappeared. Recreate only if local changed;
        // otherwise ask for an explicit manual upload to avoid resurrecting a deliberately deleted record.
        if (localFp !== meta.localFingerprint) {
          await upsertLocalYear(year, { silent: true, force: true });
        } else {
          setSyncBadge(msg('Cloud ontbreekt', 'Cloud absent', 'Cloud missing'));
          setCloudStatus(msg('De eerder gesynchroniseerde cloudplanning bestaat niet meer. Gebruik Upload huidig jaar om ze opnieuw aan te maken.', 'Le planning cloud précédemment synchronisé n’existe plus. Utilisez Envoyer l’année actuelle pour le recréer.', 'The previously synced cloud planning no longer exists. Use Upload current year to recreate it.'));
        }
        return;
      }

      const remoteFp = remoteFingerprint(remote);
      const localChanged = localFp !== meta.localFingerprint;
      const remoteChanged = remote.updated_at !== meta.cloudUpdatedAt;

      if (!localChanged && !remoteChanged) {
        setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
        if (!quiet) setCloudStatus(msg(`Alles is gesynchroniseerd voor ${year}.`, `Tout est synchronisé pour ${year}.`, `Everything is synced for ${year}.`));
        return;
      }

      if (localChanged && !remoteChanged) {
        await upsertLocalYear(year, { silent: true, force: true });
        return;
      }

      if (!localChanged && remoteChanged) {
        if (remoteFp === localFp) {
          setSyncMeta(year, remote, localFp);
          setSyncBadge(msg('Gesynchroniseerd', 'Synchronisé', 'Synced'), 'synced');
          return;
        }
        await importCloudRecord(year, remote, { confirmReplace: false, silent: true });
        app().showToast(msg('☁️ Nieuwere cloudplanning automatisch geladen.', '☁️ Planning cloud plus récent chargé automatiquement.', '☁️ Newer cloud planning loaded automatically.'));
        return;
      }

      // Both sides changed. Never overwrite either side automatically.
      markConflict(year, remote);
    } catch (err) {
      setSyncBadge(msg('Sync mislukt', 'Échec de synchro', 'Sync failed'));
      setCloudStatus(msg(`Automatische synchronisatie mislukt: ${err.message}`, `Échec de la synchronisation automatique : ${err.message}`, `Automatic sync failed: ${err.message}`));
      if (!quiet) console.warn('Auto-sync reconcile failed:', err);
    } finally {
      reconcileBusy = false;
    }
  }

  async function checkCloud() {
    try {
      setSyncBadge(msg('Controleren…', 'Vérification…', 'Checking…'), 'syncing');
      const year = selectedYear();
      const record = await cloudRecord(year);
      if (record) {
        setCloudStatus(msg(
          `Cloudplanning gevonden. Laatst bijgewerkt: ${formatCloudTime(record.updated_at)}.`,
          `Planning cloud trouvé. Dernière mise à jour : ${formatCloudTime(record.updated_at)}.`,
          `Cloud planning found. Last updated: ${formatCloudTime(record.updated_at)}.`
        ));
        setSyncBadge(msg('Cloud gevonden', 'Cloud trouvé', 'Cloud found'), 'synced');
      } else {
        setCloudStatus(msg('Nog geen cloudplanning voor dit jaar. Je kunt je lokale planning veilig uploaden.', 'Aucun planning cloud pour cette année. Vous pouvez envoyer votre planning local en toute sécurité.', 'No cloud planning for this year yet. You can safely upload your local planning.'));
        setSyncBadge(msg('Nog leeg', 'Vide', 'Empty'));
      }
    } catch (err) {
      setCloudStatus(msg(`Cloudcontrole mislukt: ${err.message}`, `Échec de la vérification cloud : ${err.message}`, `Cloud check failed: ${err.message}`));
      setSyncBadge(msg('Fout', 'Erreur', 'Error'));
    }
  }

  function utcDateFromParts(y,m,d) { return new Date(Date.UTC(y, m-1, d, 12, 0, 0)); }
  function utcDateKey(date) { return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`; }
  function addUtcDays(date, delta) { const d = new Date(date.getTime()); d.setUTCDate(d.getUTCDate()+delta); return d; }
  function localDateInTimezone(timezone) {
    const parts = new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const obj = Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
    return utcDateFromParts(Number(obj.year),Number(obj.month),Number(obj.day));
  }
  function easterSundayUtc(year) {
    const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
    const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
    const month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
    return utcDateFromParts(year,month,day);
  }
  function belgianHolidayKeys(year) {
    const out = new Set();
    const add = d => out.add(utcDateKey(d));
    const fixed = (m,d) => add(utcDateFromParts(year,m,d));
    const easter = easterSundayUtc(year);
    fixed(1,1); add(addUtcDays(easter,1)); fixed(5,1); add(addUtcDays(easter,39)); add(addUtcDays(easter,50)); fixed(7,21); fixed(8,15); fixed(11,1); fixed(11,11); fixed(12,25);
    return out;
  }
  function leaveFraction(slots) {
    if (!slots || typeof slots !== 'object') return 0;
    return (slots.am === 'leave' ? .5 : 0) + (slots.pm === 'leave' ? .5 : 0);
  }
  function detectRecentLongLeave(record, profile) {
    if (!record || profile?.welcome_back_enabled === false) return null;
    const timezone = profile?.timezone || record.settings?.timezone || 'Europe/Brussels';
    const today = localDateInTimezone(timezone);
    const year = today.getUTCFullYear();
    if (Number(record.year) !== year) return null;
    const workingWeekdays = Array.isArray(record.settings?.workingWeekdays) ? record.settings.workingWeekdays.map(Number) : [1,2,3,4,5];
    const autoHolidays = record.settings?.autoHolidays !== false;
    const holidays = autoHolidays ? belgianHolidayKeys(year) : new Set();
    const days = record.days || {};
    const threshold = Math.min(30, Math.max(2, Number(profile?.welcome_back_min_days || 5)));
    let cursor = addUtcDays(today,-1), found = false, leaveDays = 0, endDate = null;
    for (let scanned=0; scanned<65; scanned++, cursor=addUtcDays(cursor,-1)) {
      const key = utcDateKey(cursor);
      const isWorking = workingWeekdays.includes(cursor.getUTCDay()) && !holidays.has(key);
      if (!isWorking) continue;
      const fraction = leaveFraction(days[key]);
      if (!found) {
        if (fraction <= 0) return null; // today is not the first workday back
        found = true;
        endDate = key;
      }
      if (fraction <= 0) break;
      leaveDays += fraction;
    }
    if (!found || leaveDays < threshold || !endDate || profile?.last_welcome_leave_end === endDate) return null;
    return { leaveDays, endDate };
  }
  function welcomeBackMessage(days) {
    const n = Number(days).toLocaleString(window.MijnTelewerkApp?.getLocale?.() || 'nl-BE',{maximumFractionDigits:1});
    const options = lang()==='fr' ? [
      `🌴 Bon retour ! Après ${n} jours de congé, votre boîte mail a probablement développé sa propre personnalité.`,
      `😎 Mode vacances désactivé. Bon retour après ${n} jours — la machine à café se souvient encore de vous.`,
      `🧳 Bon retour ! ${n} jours de congé plus tard, il est temps de retrouver le mot de passe du travail.`
    ] : lang()==='en' ? [
      `🌴 Welcome back! After ${n} days of leave, your inbox has probably developed a personality of its own.`,
      `😎 Holiday mode disabled. Welcome back after ${n} days — the coffee machine still remembers you.`,
      `🧳 Welcome back! ${n} days of leave later, time to remember the work password.`
    ] : [
      `🌴 Welkom terug! Na ${n} verlofdagen heeft je inbox waarschijnlijk een eigen persoonlijkheid ontwikkeld.`,
      `😎 Vakantiemodus uitgeschakeld. Welkom terug na ${n} dagen — de koffiemachine kent je gelukkig nog.`,
      `🧳 Welkom terug! ${n} verlofdagen later is het tijd om dat werkwachtwoord weer te herinneren.`
    ];
    return options[Math.floor(Math.random()*options.length)];
  }
  async function checkWelcomeBack() {
    if (!currentUser || !profileRecord?.welcome_back_enabled) return;
    try {
      const timezone = profileRecord.timezone || 'Europe/Brussels';
      const currentYear = localDateInTimezone(timezone).getUTCFullYear();
      const record = await cloudRecord(currentYear);
      const leave = detectRecentLongLeave(record, profileRecord);
      if (!leave) return;
      app()?.showToast(welcomeBackMessage(leave.leaveDays), 6500);
      const { data, error } = await client.from('profiles').update({ last_welcome_leave_end: leave.endDate }).eq('id', currentUser.id)
        .select('id,display_name,timezone,language,welcome_back_enabled,welcome_back_min_days,last_welcome_leave_end,updated_at').single();
      if (!error && data) profileRecord = data;
    } catch (err) {
      console.warn('Welkom-terugcontrole mislukt:', err);
    }
  }

  function reminderPeriodKey(date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}`;
  }

  function localPlanningSettings(year) {
    try {
      const payload = app()?.exportYearPayload?.(year) || {};
      return {
        workingWeekdays: Array.isArray(payload.workingWeekdays) ? payload.workingWeekdays.map(Number) : [1,2,3,4,5],
        autoHolidays: payload.autoHolidays !== false
      };
    } catch {
      return { workingWeekdays:[1,2,3,4,5], autoHolidays:true };
    }
  }

  function isReminderWorkday(date, settings, holidaySet) {
    return settings.workingWeekdays.includes(date.getUTCDay()) && !holidaySet.has(utcDateKey(date));
  }

  function reminderTriggerDate(today, settings, record) {
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const holidays = settings.autoHolidays ? belgianHolidayKeys(year) : new Set();
    const mode = record?.monthly_mode || 'last_workday';
    if (mode === 'fixed') {
      const day = Math.min(28, Math.max(1, Number(record?.day_of_month || 25)));
      return new Date(Date.UTC(year, month, day));
    }
    if (mode === 'first_workday') {
      for (let d=1; d<=31; d++) {
        const candidate = new Date(Date.UTC(year, month, d));
        if (candidate.getUTCMonth() !== month) break;
        if (isReminderWorkday(candidate, settings, holidays)) return candidate;
      }
    }
    const end = new Date(Date.UTC(year, month+1, 0));
    for (let d=end.getUTCDate(); d>=1; d--) {
      const candidate = new Date(Date.UTC(year, month, d));
      if (isReminderWorkday(candidate, settings, holidays)) return candidate;
    }
    return end;
  }

  async function checkTeleworkReminder() {
    if (!currentUser || !reminderRecord?.enabled || !$('teleworkReminderDialog')) return;
    try {
      const timezone = reminderRecord.timezone || profileRecord?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Brussels';
      const today = localDateInTimezone(timezone);
      const todayKey = utcDateKey(today);
      const period = reminderPeriodKey(today);
      if (reminderRecord.last_acknowledged_period === period) return;
      if (reminderRecord.snoozed_until && todayKey < reminderRecord.snoozed_until) return;
      const settings = localPlanningSettings(today.getUTCFullYear());
      const trigger = reminderTriggerDate(today, settings, reminderRecord);
      if (today.getTime() < trigger.getTime()) return;
      if ($('accountDialog')?.open || $('teleworkReminderDialog').open) return;
      $('teleworkReminderDialog').showModal();
    } catch (err) {
      console.warn('Herinneringscontrole mislukt:', err);
    }
  }

  async function acknowledgeTeleworkReminder() {
    if (!currentUser) return;
    const timezone = reminderRecord?.timezone || profileRecord?.timezone || 'Europe/Brussels';
    const today = localDateInTimezone(timezone);
    const period = reminderPeriodKey(today);
    const { data, error } = await client.from('reminder_settings')
      .update({ last_acknowledged_period: period, snoozed_until: null })
      .eq('user_id', currentUser.id)
      .select('enabled,monthly_mode,day_of_month,timezone,last_acknowledged_period,snoozed_until,updated_at').single();
    if (error) { app()?.showToast(error.message); return; }
    reminderRecord = data;
    $('teleworkReminderDialog')?.close();
    app()?.showToast(tr('reminderAcknowledged'));
  }

  async function snoozeTeleworkReminder() {
    if (!currentUser) return;
    const timezone = reminderRecord?.timezone || profileRecord?.timezone || 'Europe/Brussels';
    const today = localDateInTimezone(timezone);
    const tomorrow = utcDateKey(addUtcDays(today, 1));
    const { data, error } = await client.from('reminder_settings')
      .update({ snoozed_until: tomorrow })
      .eq('user_id', currentUser.id)
      .select('enabled,monthly_mode,day_of_month,timezone,last_acknowledged_period,snoozed_until,updated_at').single();
    if (error) { app()?.showToast(error.message); return; }
    reminderRecord = data;
    $('teleworkReminderDialog')?.close();
    app()?.showToast(tr('reminderSnoozed'));
  }

  function scheduleAutoSync() {
    if (suppressStateEvents || !configured || !currentUser || !autoSyncEnabled()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => reconcileYear({ reason: 'local-change', quiet: true }), AUTO_SYNC_DELAY);
  }

  async function signOut() {
    clearTimeout(syncTimer);
    localStorage.removeItem(AUTO_SYNC_KEY);
    const { error } = await client.auth.signOut();
    if (error) {
      app()?.showToast(msg(`Uitloggen mislukt: ${error.message}`, `Échec de la déconnexion : ${error.message}`, `Sign-out failed: ${error.message}`));
      return;
    }
    currentUser = null;
    renderAccountButton();
    showState('accountSignedOut');
    setFeedback(msg('Je bent uitgelogd.', 'Vous êtes déconnecté.', 'You are signed out.'), 'success');
  }

  async function initialize() {
    migrateAutoSyncSetting();
    bindAccountPromo();
    registerPromoVisit();

    $('accountBtn')?.addEventListener('click', openDialog);
    $('closeAccountBtn')?.addEventListener('click', () => $('accountDialog').close());
    $('magicLinkForm')?.addEventListener('submit', e => {
      e.preventDefault();
      sendMagicLink($('accountEmail').value.trim());
    });
    $('checkCloudBtn')?.addEventListener('click', checkCloud);
    $('uploadYearBtn')?.addEventListener('click', () => uploadYear());
    $('downloadYearBtn')?.addEventListener('click', downloadYear);
    $('signOutBtn')?.addEventListener('click', signOut);
    $('reminderEnabledToggle')?.addEventListener('change', renderReminderFieldVisibility);
    $('reminderMonthlyMode')?.addEventListener('change', renderReminderFieldVisibility);
    $('reminderDoneBtn')?.addEventListener('click', acknowledgeTeleworkReminder);
    $('reminderLaterBtn')?.addEventListener('click', snoozeTeleworkReminder);
    $('saveReminderBtn')?.addEventListener('click', saveReminderSettings);
    $('savePreferencesBtn')?.addEventListener('click', savePreferences);

    $('autoSyncToggle')?.addEventListener('change', async e => {
      if (e.target.checked) {
        localStorage.setItem(AUTO_SYNC_KEY, '1');
        setSyncBadge(msg('Auto-sync aan', 'Synchro auto activée', 'Auto-sync on'), 'synced');
        await reconcileYear({ reason: 'toggle', quiet: false });
      } else {
        clearTimeout(syncTimer);
        localStorage.removeItem(AUTO_SYNC_KEY);
        setSyncBadge(msg('Auto-sync uit', 'Synchro auto désactivée', 'Auto-sync off'));
        setCloudStatus(msg('Automatische synchronisatie is uitgeschakeld. Je lokale planning blijft bewaard.', 'La synchronisation automatique est désactivée. Votre planning local reste enregistré.', 'Automatic sync is disabled. Your local planning remains saved.'));
      }
    });

    window.addEventListener('mijntelewerk:state-changed', scheduleAutoSync);
    window.addEventListener('mijntelewerk:state-changed', () => scheduleAccountPromo(8000));
    window.addEventListener('mijntelewerk:language-changed', async () => {
      renderAccountButton();
      if (currentUser) {
        renderSignedIn();
        const { data } = await client.from('profiles').update({ language: lang() }).eq('id', currentUser.id)
          .select('id,display_name,timezone,language,welcome_back_enabled,welcome_back_min_days,last_welcome_leave_end,updated_at').maybeSingle();
        if (data) profileRecord = data;
      }
    });
    window.addEventListener('focus', () => {
      if (currentUser && autoSyncEnabled()) reconcileYear({ reason: 'window-focus', quiet: true });
      if (currentUser) setTimeout(checkTeleworkReminder, 180);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && currentUser && autoSyncEnabled()) {
        reconcileYear({ reason: 'tab-visible', quiet: true });
      }
      if (document.visibilityState === 'visible' && currentUser) setTimeout(checkTeleworkReminder, 180);
    });

    if (!configured) {
      renderAccountButton();
      return;
    }

    client = window.supabase.createClient(cfg.SUPABASE_URL, browserKey);
    const { data: { session } } = await client.auth.getSession();
    currentUser = session?.user || null;
    if (currentUser) {
      await ensureProfile();
      await loadReminderSettings();
      setTimeout(checkWelcomeBack, 700);
      setTimeout(checkTeleworkReminder, 950);
    }
    renderAccountButton();
    if (!currentUser) scheduleAccountPromo();

    if (currentUser && autoSyncEnabled()) {
      setTimeout(() => reconcileYear({ reason: 'startup', quiet: true }), 350);
    }

    client.auth.onAuthStateChange(async (_event, session) => {
      const previousUserId = currentUser?.id || null;
      currentUser = session?.user || null;
      if (currentUser) {
        await ensureProfile();
        await loadReminderSettings();
        setTimeout(checkWelcomeBack, 700);
        setTimeout(checkTeleworkReminder, 950);
      }
      renderAccountButton();
      if (currentUser && $('accountPromoDialog')?.open) $('accountPromoDialog').close();
      if (!currentUser) scheduleAccountPromo(12000);

      if (!currentUser && previousUserId) clearTimeout(syncTimer);

      if ($('accountDialog')?.open) {
        if (currentUser) {
          showState('accountSignedIn');
          renderSignedIn();
          await loadAccountSettings();
          await checkCloud();
        } else showState('accountSignedOut');
      }

      if (currentUser && autoSyncEnabled()) {
        setTimeout(() => reconcileYear({ reason: 'auth-change', quiet: true }), 300);
      }
    });
  }

  initialize().catch(err => console.error('Accountmodule kon niet starten:', err));
})();
