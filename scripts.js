// Intersection observer to animate project cards on scroll
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
});

// Contact form JS to show success message without redirect
const form = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);

  fetch(this.action, {
    method: this.method,
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  }).then(response => {
    if (response.ok) {
      successMessage.textContent = "Thank you for your message! I'll get back to you soon.";
      successMessage.classList.add('visible');
      form.reset();
    } else {
      response.json().then(data => {
        if(Object.hasOwn(data, 'errors')) {
          successMessage.textContent = data["errors"].map(error => error.message).join(", ");
        } else {
          successMessage.textContent = "Oops! There was a problem submitting your form";
        }
        successMessage.classList.add('visible');
      });
    }
  }).catch(error => {
    successMessage.textContent = "Oops! There was a problem submitting your form";
    successMessage.classList.add('visible');
  });
});
