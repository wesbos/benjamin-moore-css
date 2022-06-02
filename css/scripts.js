// Add one lsitener, this is called event delegation

document.body.addEventListener('click', function(e) {
  if (e.target.type !== 'button') return;
  navigator.clipboard.writeText(e.target.textContent);
  e.target.classList.add('zoop');
  setTimeout(() => e.target.classList.remove('zoop'), 200);
})
