

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Form Submission Handler (Live Backend Integration) ---
    const contactForm = document.querySelector('.contact-form');
    const submitButton = document.querySelector('.form-submit-button');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            // CRITICAL: We prevent the default HTML form submission.
            // Instead, we use fetch() to send data asynchronously (AJAX).
            event.preventDefault(); 
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.backgroundColor = 'var(--secondary-color)';
            
            // Get data from the form
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            try {
                // Send data asynchronously to the Node.js server route /send-email
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // The server responds with an HTML page (success or error)
                if (response.ok) {
                    // Update the entire document body with the success page HTML
                    const responseText = await response.text();
                    document.body.innerHTML = responseText;
                } else {
                    // Handle server-side errors (status 400 or 500)
                    const responseText = await response.text();
                    document.body.innerHTML = responseText;
                }

            } catch (error) {
                // Handle network errors (server is offline, etc.)
                console.error('Network or Fetch Error:', error);
                alert('Could not connect to the server. Please check if the server.js is running.');
                
                // Re-enable button after error
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
            }
        });
    }
    
    const allLinks = document.querySelectorAll('.nav-links a, .cta-button');

    allLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId && targetId.startsWith('#')) {
                
                e.preventDefault(); 

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // --- 3. Placeholder for other client-side logic (e.g., SVG observer) ---
    // You should re-add your SVG Intersection Observer logic here if you removed it.
    // (Skipped for brevity, assuming the main SVG logic is in place.)
});