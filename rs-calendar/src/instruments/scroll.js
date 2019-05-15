export default function() {
  document.body.addEventListener('scroll', Ascroll, false);
  window.addEventListener('scroll', Ascroll, false);

  function Ascroll() {
    var a = document.querySelector('.freedom');
    var b = document.querySelector('.body-day');
    if(a) {
      if(b.getBoundingClientRect().top < 100 && Math.abs(b.getBoundingClientRect().top-100) < 1200) {
        a.style.top = Math.abs(b.getBoundingClientRect().top-100)+'px';
      }

      if(b.getBoundingClientRect().top > 100) {
        a.style.top = '';
      }
    }
  }
};
