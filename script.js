// استيراد مكتبة Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.137/build/three.module.js';

// إنشاء المشهد
const scene = new THREE.Scene();

// إنشاء الكاميرا
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// إنشاء المُرسل (Renderer)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// إنشاء الكرة الأساسية (الكوكب)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// إضافة إضاءة
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// إنشاء كرات صغيرة تدور حول الكوكب
const satellites = [];
const satelliteGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

for (let i = 0; i < 10; i++) {
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    const angle = (i / 10) * Math.PI * 2;
    satellite.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
    scene.add(satellite);
    satellites.push({ mesh: satellite, angle: angle });
}

// دالة التحريك
function animate() {
    requestAnimationFrame(animate);
    
    // تدوير الكوكب
    planet.rotation.y += 0.01;
    
    // تدوير الأقمار الصناعية حول الكوكب
    satellites.forEach(sat => {
        sat.angle += 0.002;
        sat.mesh.position.x = Math.cos(sat.angle) * 4;
        sat.mesh.position.y = Math.sin(sat.angle) * 1.25;
    });
    
    renderer.render(scene, camera);
}

animate();
