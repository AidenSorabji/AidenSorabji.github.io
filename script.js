window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    const emoji = document.getElementById('emoji');
    const title = document.getElementById('title');
    const paragraph = document.getElementById('paragraph');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const navbar = document.getElementById('navbar');

    // Function to fade out the container
    const fadeOutContainer = () => {
        container.style.transition = "opacity 1s ease";
        container.style.opacity = "0";
    };

    // Fade in container with a slight delay
    setTimeout(() => {
        container.style.transition = "opacity 1.5s ease, transform 1.5s ease";
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
    }, 1000);

    // Fade in title, paragraph, and buttons sequentially
    setTimeout(() => {
        title.style.transition = "opacity 1.5s ease";
        title.style.opacity = "1";
    }, 1500);

    setTimeout(() => {
        paragraph.style.transition = "opacity 1.5s ease";
        paragraph.style.opacity = "1";
    }, 2000);

    setTimeout(() => {
        button1.style.transition = "opacity 1.5s ease";
        button2.style.transition = "opacity 1.5s ease";
        button1.style.opacity = "1";
        button2.style.opacity = "1";
    }, 2500);

    // Click event to fade out the content and show navbar
    const handleClick = () => {
        fadeOutContainer();
        setTimeout(() => {
            navbar.style.display = "block"; // Show navbar
            navbar.style.opacity = "1"; // Make it visible
            navbar.style.transition = "opacity 1s ease";
        }, 1000); // Wait for fade out to complete
        document.removeEventListener('click', handleClick); // Remove event listener to avoid multiple triggers
    };

    // Set a timeout to trigger the same effect after 5 seconds
    setTimeout(() => {
        handleClick();
    }, 5000);

    // Event listener for clicks on the page
    document.addEventListener('click', handleClick);
});