    document.addEventListener("DOMContentLoaded", () => {
    const bounceBlock = document.getElementById("bounceBlock");
    const fadeBlock = document.getElementById("fadeBlock");
    const scaleBlock = document.getElementById("scaleBlock");
    const rotateBlock = document.getElementById("rotateBlock");

    bounceBlock.addEventListener("mouseenter", () => bounceEffect(bounceBlock));
    bounceBlock.addEventListener("mouseleave", () => resetEffect(bounceBlock));

    fadeBlock.addEventListener("mouseenter", () => fadeEffect(fadeBlock));
    fadeBlock.addEventListener("mouseleave", () => resetEffect(fadeBlock));

    scaleBlock.addEventListener("mouseenter", () => scaleEffect(scaleBlock));
    scaleBlock.addEventListener("mouseleave", () => resetEffect(scaleBlock));

    rotateBlock.addEventListener("mouseenter", () => rotateEffect(rotateBlock));
    rotateBlock.addEventListener("mouseleave", () => resetEffect(rotateBlock));

    function bounceEffect(element) {
        element.style.transform = "translateY(-20px)";
        setTimeout(() => {
            element.style.transform = "translateY(0)";
        }, 300 );
    }

    function fadeEffect(element) {
        element.style.opacity = "1";
        setTimeout(() => {
            element.style.opacity = "0";
        }, 100);
    }

    function scaleEffect(element) {
        element.style.transform = "scale(1.3)";
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 400);
    }

    function rotateEffect(element) {
        element.style.transform = "rotate(10deg)";
        setTimeout(() => {
            element.style.transform = "rotate(0deg)";
        }, 500);
    }

    function resetEffect(element) {
        element.style.transform = "none";
        element.style.opacity = "1";
    }
});
