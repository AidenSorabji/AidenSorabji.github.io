window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    const emoji = document.getElementById('emoji');
    const title = document.getElementById('title');
    const paragraph = document.getElementById('paragraph');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

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
});