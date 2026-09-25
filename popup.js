'use strict';

const scanBtn = document.getElementById('scanBtn');
const closeBtn = document.getElementById('closeBtn');
const statusEl = document.getElementById('status');
const groupList = document.getElementById('groupList');

let duplicateIds = [];

function setStatus(msg, ok = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle('ok', ok);
}

// Normalize a URL so trivially-different copies count as the same page:
// drop the #fragment and common tracking query params.
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'mc_cid', 'mc_eid']
      .forEach(p => u.searchParams.delete(p));
    return u.toString();
  } catch {
    return url;
  }
}

function tabRow(tab, badge) {
  const r = document.createElement('div');
  r.className = 'tab-row';
  if (tab.favIconUrl) {
    const im = document.createElement('img');
    im.src = tab.favIconUrl;
    im.alt = '';
    r.appendChild(im);
  }
  const b = document.createElement('span');
  b.className = badge === 'KEPT' ? 'badge-kept' : 'badge-dup';
  b.textContent = badge;
  r.appendChild(b);
  const s = document.createElement('span');
  s.textContent = tab.title || tab.url;
  s.style.cssText = 'overflow:hidden;text-overflow:ellipsis;';
  r.appendChild(s);
  return r;
}

scanBtn.addEventListener('click', async () => {
  setStatus('Scanning tabs…');
  groupList.innerHTML = '';
  closeBtn.disabled = true;
  closeBtn.textContent = 'Close duplicates';
  duplicateIds = [];

  try {
    const tabs = await chrome.tabs.query({});

    // Group tabs by normalized URL; skip internal pages (chrome://, about:blank…)
    const groups = new Map();
    for (const t of tabs) {
      if (!t.url || !/^https?:\/\//i.test(t.url)) continue;
      const key = normalizeUrl(t.url);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    }

    const dupGroups = [...groups.values()].filter(g => g.length > 1);

    if (dupGroups.length === 0) {
      groupList.innerHTML =
        '<div class="empty"><div class="big">✨</div>No duplicate tabs found.<br>Your tabs are already tidy!</div>';
      setStatus('All clean — no duplicates.', true);
      return;
    }

    let totalDupes = 0;
    for (const g of dupGroups) {
      // Keep priority: pinned > active > lowest tab index
      const sorted = [...g].sort(
        (a, b) => (b.pinned - a.pinned) || (b.active - a.active) || (a.index - b.index)
      );
      const keep = sorted[0];
      const dupes = sorted.slice(1);
      dupes.forEach(t => duplicateIds.push(t.id));
      totalDupes += dupes.length;

      const div = document.createElement('div');
      div.className = 'group';

      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = keep.title || keep.url;
      title.title = keep.url;
      div.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'group-meta';
      const b = document.createElement('b');
      b.textContent = dupes.length;
      meta.appendChild(b);
      meta.appendChild(document.createTextNode(
        ` duplicate${dupes.length > 1 ? 's' : ''} · keeping 1`
      ));
      div.appendChild(meta);

      div.appendChild(tabRow(keep, 'KEPT'));
      dupes.slice(0, 4).forEach(t => div.appendChild(tabRow(t, 'DUP')));
      if (dupes.length > 4) {
        const more = document.createElement('div');
        more.className = 'tab-row';
        more.textContent = `+ ${dupes.length - 4} more…`;
        div.appendChild(more);
      }
      groupList.appendChild(div);
    }

    closeBtn.disabled = false;
    closeBtn.textContent = `Close ${totalDupes} duplicate tab${totalDupes > 1 ? 's' : ''}`;
    setStatus(`Found ${totalDupes} duplicate${totalDupes > 1 ? 's' : ''} in ${dupGroups.length} group${dupGroups.length > 1 ? 's' : ''}.`);
  } catch (err) {
    setStatus('Could not read tabs: ' + err.message);
  }
});

closeBtn.addEventListener('click', async () => {
  if (duplicateIds.length === 0) return;
  closeBtn.disabled = true;
  try {
    await chrome.tabs.remove(duplicateIds);
    const n = duplicateIds.length;
    duplicateIds = [];
    groupList.innerHTML =
      `<div class="empty"><div class="big">🧹</div>Done! Closed ${n} duplicate tab${n > 1 ? 's' : ''}.</div>`;
    closeBtn.textContent = 'Close duplicates';
    setStatus('Tabs tidied ✓', true);
  } catch (err) {
    setStatus('Could not close some tabs: ' + err.message);
    closeBtn.disabled = false;
  }
});
