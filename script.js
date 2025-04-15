// مصادر الصور المعتمدة (بدون مشاكل CORS)
const TEXTURES = {
    SUN: 'textures/SUN.jpg',
    MERCURY: 'textures/MERCURY.jpg',
    VENUS: 'textures/VENUS.jpg',
    EARTH: 'textures/EARTH.jpg',
    MARS: 'textures/MARS.jpg',
    JUPITER: 'textures/JUPITER.jpg',
    SATURN: 'textures/SATURN.jpg',
    URANUS: 'textures/URANUS.jpg',
    NEPTUNE: 'textures/NEPTUNE.jpg'
};

// بيانات الكواكب الكاملة
const PLANET_DATA = [
    {
        name: 'الشمس',
        size: 6,
        distance: 0,
        rotationSpeed: 0.003,
        orbitSpeed: 0,
        texture: TEXTURES.SUN,
        color: 0xFDB813,
        info: 'نجم يبلغ عمره 4.6 مليار سنة - تبلغ حرارة سطحه 5500 درجة مئوية'
    },
    {
        name: 'عطارد',
        size: 0.4,
        distance: 8,
        rotationSpeed: 0.004,
        orbitSpeed: 0.004,
        texture: TEXTURES.MERCURY,
        color: 0xA9A9A9,
        info: 'أصغر كوكب - سنته تساوي 88 يومًا أرضيًا'
    },
    {
        name: 'الزهرة',
        size: 0.9,
        distance: 11,
        rotationSpeed: 0.002,
        orbitSpeed: 0.0015,
        texture: TEXTURES.VENUS,
        color: 0xE6E6FA,
        info: 'أشد الكواكب حرارة (465°م) - يدور بعكس اتجاه الكواكب الأخرى'
    },
    {
        name: 'الأرض',
        size: 1,
        distance: 14,
        rotationSpeed: 0.01,
        orbitSpeed: 0.001,
        texture: TEXTURES.EARTH,
        color: 0x1E90FF,
        info: 'الكوكب الوحيد المعروف بوجود حياة - 71% من سطحه مغطى بالماء'
    },
    {
        name: 'المريخ',
        size: 0.5,
        distance: 18,
        rotationSpeed: 0.008,
        orbitSpeed: 0.0007,
        texture: TEXTURES.MARS,
        color: 0xC1440E,
        info: 'الكوكب الأحمر - به أكبر بركان في المجموعة الشمسية'
    },
    {
        name: 'المشتري',
        size: 2.5,
        distance: 24,
        rotationSpeed: 0.02,
        orbitSpeed: 0.0004,
        texture: TEXTURES.JUPITER,
        color: 0xF5DEB3,
        info: 'أكبر الكواكب - له 79 قمراً معروفاً'
    },
    {
        name: 'زحل',
        size: 2,
        distance: 30,
        rotationSpeed: 0.015,
        orbitSpeed: 0.0003,
        texture: TEXTURES.SATURN,
        color: 0xDAA520,
        info: 'الكوكب ذو الحلقات - كثافته أقل من الماء'
    },
    {
        name: 'أورانوس',
        size: 1.5,
        distance: 36,
        rotationSpeed: 0.012,
        orbitSpeed: 0.0002,
        texture: TEXTURES.URANUS,
        color: 0xAFEEEE,
        info: 'يدور على جانبه - درجة حرارته -224°م'
    },
    {
        name: 'نبتون',
        size: 1.5,
        distance: 42,
        rotationSpeed: 0.01,
        orbitSpeed: 0.0001,
        texture: TEXTURES.NEPTUNE,
        color: 0x4169E1,
        info: 'أبعد الكواكب - رياحه الأسرع في النظام الشمسي (2100 كم/س)'
    }
];

class SolarSystem {
    constructor() {
        this.initScene();
        this.createStars();
        this.createPlanets();
        this.setupEventListeners();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 50;
    }

    createStars() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });

        const vertices = [];
        for (let i = 0; i < 20000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    createPlanets() {
        this.planets = [];
        const textureLoader = new THREE.TextureLoader();

        PLANET_DATA.forEach(data => {
            const geometry = new THREE.SphereGeometry(data.size, 64, 64);
            const material = new THREE.MeshPhongMaterial({ 
                color: data.color,
                shininess: 30
            });
            
            const planet = new THREE.Mesh(geometry, material);
            
            // تحميل القوام
            textureLoader.load(data.texture, (texture) => {
                planet.material.map = texture;
                planet.material.needsUpdate = true;
            });

            planet.position.x = data.distance;
            planet.userData = data;
            this.scene.add(planet);
            
            // إضافة حلقات لزحل
            if (data.name === 'زحل') {
                const ringGeometry = new THREE.RingGeometry(data.size * 1.2, data.size * 2, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xDAA520,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planet.add(rings);
            }

            this.planets.push({
                mesh: planet,
                rotationSpeed: data.rotationSpeed,
                orbitSpeed: data.orbitSpeed,
                distance: data.distance
            });
        });

        // إضافة إضاءة
        const light = new THREE.PointLight(0xFFFFFF, 1, 1000);
        light.position.set(0, 0, 0);
        this.scene.add(light);

        document.getElementById('loading').style.display = 'none';
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // تفاعل النقر على الكواكب
        window.addEventListener('click', (event) => {
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.planets.map(p => p.mesh));
            if (intersects.length > 0) {
                const planet = intersects[0].object;
                const infoBox = document.getElementById('info');
                infoBox.innerHTML = `
                    <h3>${planet.userData.name}</h3>
                    <p>${planet.userData.info}</p>
                    <p>الحجم: ${planet.userData.size.toFixed(1)} (نسبة للأرض)</p>
                    <p>البعد عن الشمس: ${planet.userData.distance} وحدة فلكية</p>
                `;
                infoBox.style.display = 'block';
                setTimeout(() => infoBox.style.display = 'none', 5000);
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.stars.rotation.y += 0.0001;
        
        this.planets.forEach(planet => {
            planet.mesh.rotation.y += planet.rotationSpeed;
            if (planet.orbitSpeed > 0) {
                planet.mesh.position.x = Math.cos(Date.now() * planet.orbitSpeed) * planet.distance;
                planet.mesh.position.z = Math.sin(Date.now() * planet.orbitSpeed) * planet.distance;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// بدء النظام الشمسي
new SolarSystem();