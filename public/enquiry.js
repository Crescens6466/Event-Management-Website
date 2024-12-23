document.addEventListener('DOMContentLoaded', function () {
    const calculateButton = document.getElementById('calculate-button');
    const quoteResults = document.getElementById('quote-results');
    const quoteAmount = document.getElementById('quote-amount');
    const eventTypeSelect = document.getElementById('event-type');
    const guestCountInput = document.getElementById('guest-count');

    calculateButton.addEventListener('click', function () {
        const eventType = eventTypeSelect.value;
        const guestCount = parseInt(guestCountInput.value);

        let quote = 0;

        // Perform calculations based on event type and guest count
        if (eventType === 'wedding') {
            quote = guestCount * 1000;
        } else if (eventType === 'corporate') {
            quote = guestCount * 500;
        } else if (eventType === 'birthday') {
            quote = guestCount * 300;
        } else if (eventType === 'festival') {
            quote = guestCount * 250;
        }

        // Display the quote
        quoteAmount.textContent = `RS:-${quote.toFixed(2)}/-`;
        quoteResults.style.display = 'block';
    });
});
