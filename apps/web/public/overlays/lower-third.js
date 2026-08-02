const params = new URLSearchParams(location.search);
document.querySelector('#label').textContent = params.get('label') || 'TINY SIGNAL CLUB';
document.querySelector('#text').textContent = params.get('text') || 'Tiny Internet Town';
