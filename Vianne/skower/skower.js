(() => {
  const root = document.querySelector('[data-skower-ad]');
  if (!root) return;

  const wipe = root.querySelector('.skowerAd-wipe');
  const button = root.querySelector('.skowerAd-icon');

  let dirtTimer = null;

  function makeDirty() {
    root.classList.remove('is-clean');
  }

  function cleanNow() {
    // töröljük az esetleges visszakoszolást
    if (dirtTimer) {
      clearTimeout(dirtTimer);
      dirtTimer = null;
    }

    // wipe reset
    wipe.style.animation = 'none';
    wipe.style.opacity = '1';
    void wipe.offsetWidth;

    // wipe indítás
    wipe.style.animation = 'skowerWipe 900ms ease-in-out forwards';

    // tisztulás középen
    setTimeout(() => {
      root.classList.add('is-clean');
    }, 450);

    // wipe eltűnik
    setTimeout(() => {
      wipe.style.opacity = '0';
    }, 950);

    // lassú visszakoszolódás
    dirtTimer = setTimeout(() => {
      makeDirty();
    }, 5000);
  }

  // induláskor: koszos
  makeDirty();

  // kattintásra tisztítás
  button.addEventListener('click', cleanNow);
})();
