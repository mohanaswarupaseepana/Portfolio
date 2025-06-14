document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for reaching out! Your message has been sent.');
        contactForm.reset();
      } else {
        alert(`Error: ${data.error || 'Failed to send message'}`);
      }
    } catch (error) {
      alert('Network error: Could not send message. Please try again later.');
      console.error(error);
    }
  });
});
