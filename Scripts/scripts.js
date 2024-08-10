const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const topY = 100; 

// Adjusted brainPoints coordinates to align with the larger brain image and positioned at the top middle of the canvas
const brainPoints = [
    { x: 180, y: 90 }, { x: 200, y: 70 }, { x: 220, y: 60 }, { x: 240, y: 55 },
    { x: 260, y: 60 }, { x: 280, y: 70 }, { x: 300, y: 90 }, { x: 310, y: 110 },
    { x: 310, y: 130 }, { x: 300, y: 150 }, { x: 280, y: 170 }, { x: 260, y: 180 },
    { x: 240, y: 185 }, { x: 220, y: 180 }, { x: 200, y: 170 }, { x: 180, y: 150 },
    { x: 170, y: 130 }, { x: 170, y: 110 }, { x: 180, y: 90 }
].map(point => ({ x: point.x + centerX - 240, y: point.y + topY - 120 }));

const particlesArray = [];
const numberOfParticles = 100;
const maxDistance = 100;
let allParticlesReached = false;

class Particle {
    constructor() {
        this.size = Math.random() * 5 + 2;  // size for particles
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.color = 'rgba(255, 255, 255, 0.8)';  // White color for particles
        this.destination = this.getRandomPoint();
        this.speed = Math.random() * 2 + 1;
        this.reached = false;
    }

    getRandomPoint() {
        return brainPoints[Math.floor(Math.random() * brainPoints.length)];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.reached) return;

        const dx = this.destination.x - this.x;
        const dy = this.destination.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) { // Increase the threshold distance
            this.x += dx / distance * this.speed;
            this.y += dy / distance * this.speed;
        } else {
            this.reached = true;
        }
    }
}

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function drawText() {
    let fontSize = 120;
    ctx.font = `${fontSize}px cursive`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let textWidth = ctx.measureText('Become Mental Health Aware!').width;
    while (textWidth > canvas.width - 20) { 
        fontSize--;
        ctx.font = `bold ${fontSize}px cursive`;
        textWidth = ctx.measureText('Become Mental Health Aware!').width;
    }

    ctx.fillText('Become Mental Health Aware!', centerX, canvas.height / 2);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Set background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill background

    let reachedCount = 0;

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        if (particlesArray[i].reached) {
            reachedCount++;
        }

        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    console.log(`Reached Count: ${reachedCount}`);
    if (reachedCount === particlesArray.length) {
        allParticlesReached = true;
        drawText();
    } else {
        requestAnimationFrame(animate);
    }
}

init();
animate();
