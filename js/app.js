// =====================================================
// VARIABLES GLOBALES
// =====================================================

// 🎵 MÚSICA PARTE 1
const musicaParte1 = new Audio("sounds/musica-parte1.mp3");
musicaParte1.loop = true;
musicaParte1.volume = 0.4;

// 🎵 MÚSICA PARTE 3
const musicaParte3 = new Audio("sounds/musica-parte3.mp3");
musicaParte3.loop = true;
musicaParte3.volume = 0.4;

let scene;
let camera;
let renderer;
let raycaster;
let mouse;

let planets = [];
let orbits = [];
let sunMesh; 
let experienceStarted = false;

let targetObject = null; 
let isFocused = false;

let sunGlow; 
let asteroidBelt; 
const asteroidCount = 450; 

let meteorMesh = null;
let shockwaveMesh = null;
let destructionState = "NORMAL"; 

let lerpFactor = 0.005; 
const accelerationRate = 1.025; 

let shockwaveRadius = 0;
const shockwaveSpeed = 6; 

const textureLoader = new THREE.TextureLoader();

const controls = {
    rotating: false,
    previousX: 0,
    previousY: 0,
    rotX: 0.3,
    rotY: 0.7,
    radius: 1800,
    pinchStartDist: 0
};

// ⭐⭐ AÑADIDO PARA MÓVIL/TABLET ⭐⭐
// Detectar si el usuario hizo TAP o DRAG
let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;
// ---------------------------------

const sunData = {
    nombre: "El Sol",
    size: 80,
    titulo: "La que ilumina sin querer",
    mensaje: `
El Sol es el centro del sistema solar, pero sinceramente, si existiera un “sol” en mi vida, serías tú. No porque vayas por ahí brillando como una diva, sino porque tienes esa cosa rara de alegrarme el día sin hacer nada especial. A veces llego rayado y con solo verte ya estoy mejor. No sé cómo lo haces, pero funciona. Y encima confías en mí para todo, lo cual me flipa. El Sol ilumina planetas; tú iluminas mis días normales, que ya es bastante más difícil.
`
};

const planetData = [
    {
        nombre:"Mercurio", textura:"textures/mercury.jpg", colorBase:0xaaaaaa, size:4, distance:220, orbitSpeed:0.04,
        titulo:"La velocidad que tienes tú",
        mensaje: `
Mercurio va rapidísimo, pero ni de coña corre tanto como tú cuando te entra la risa tonta. Este planeta me recuerda a ti porque contigo el tiempo pasa volando. Literalmente nunca me aburro cuando estamos juntos, siempre acabamos haciendo alguna tontería o diciendo alguna burrada que solo nosotros entendemos. Y aunque seas bajita, tienes una energía que parece que vayas a 200 km/h todo el día. Mercurio es rápido, sí, pero tú eres otra liga. Contigo todo se siente más ligero, más divertido y más fácil.
`
    },

    {
        nombre:"Venus", textura:"textures/venus.jpg", colorBase:0xe3bb76, size:9, distance:320, orbitSpeed:0.025,
        titulo:"Brillas sin darte cuenta",
        mensaje: `
Venus es el planeta más brillante del cielo, pero tú tienes un brillo distinto. No es de esos que llaman la atención a lo loco, es más del tipo “estoy aquí y ya mejoré el ambiente sin querer”. Me pasa mucho contigo: llegas, dices cualquier tontería, y de repente el día ya no es tan malo. Y eso que no haces nada raro, simplemente eres tú. Eres de esas personas que no necesitan esforzarse para caer bien o para hacer reír. Venus brilla porque sí; tú también.
`
    },

    {
        nombre:"Tierra", textura:"textures/earth.jpg", colorBase:0x2233ff, size:10, distance:450, orbitSpeed:0.018,
        titulo:"Mi sitio cómodo",
        mensaje: `
La Tierra es el planeta donde está todo lo importante, y tú eres un poco eso para mí. No porque seas mi casa ni nada cursi, sino porque contigo puedo ser yo sin filtros. Puedo contarte cualquier cosa, desde movidas serias hasta tonterías que solo tú entiendes. Y siempre escuchas, incluso cuando digo cosas sin sentido. La Tierra es estabilidad, y tú tienes esa vibra que hace que todo se sienta más tranquilo. Eres ese tipo de persona con la que estar simplemente… funciona.
`
    },

    {
        nombre:"Marte", textura:"textures/mars.jpg", colorBase:0xc1440e, size:6, distance:600, orbitSpeed:0.015,
        titulo:"La fuerza que no presumes",
        mensaje: `
Marte siempre ha sido el planeta de los valientes, y tú tienes más fuerza de la que te das crédito. No vas por ahí presumiendo ni haciéndote la dura, pero cuando toca, aguantas como una campeona. Te he visto pasar por cosas que a otros les hundirían, y tú sigues adelante como si nada. Y encima lo haces con humor, que ya es otro nivel. Marte es rojo y dramático; tú eres fuerte sin hacer ruido. Y eso, sinceramente, impresiona más que cualquier planeta.
`
    },

    {
        nombre:"Júpiter", textura:"textures/jupiter.jpg", colorBase:0xb07f35, size:40, distance:900, orbitSpeed:0.008,
        titulo:"Tu corazón gigante",
        mensaje: `
Júpiter es enorme, pero tu corazón lo supera fácil. Y no lo digo en plan cursi, sino porque siempre estás pendiente de los demás. Si alguien está mal, tú eres la primera en intentar animarlo. Si alguien necesita hablar, tú escuchas. Y si alguien hace una tontería, tú te ríes y la sigues. Tienes esa mezcla rara de buena persona y payasa profesional que hace que todo sea más divertido. Júpiter será grande, pero tú eres grande de verdad, de las que importan.
`
    },

    {
        nombre:"Saturno", textura:"textures/saturn.jpg", colorBase:0xe2bf7d, size:35, distance:1300, orbitSpeed:0.006,
        titulo:"Tus detalles que suman",
        mensaje: `
Los anillos de Saturno están hechos de un montón de cosas pequeñas, igual que tú. No eres de grandes discursos ni de hacer cosas épicas, pero tienes detalles que marcan. Un mensaje tonto, una risa inesperada, una mirada de “qué haces, payaso”… y ya me has alegrado el día. Eres de esas personas que no necesitan hacer mucho para que los demás se sientan mejor. Saturno tiene anillos; tú tienes detalles que valen más que eso.
`
    },

    {
        nombre:"Urano", textura:"textures/uranus.jpg", colorBase:0x4b70dd, size:22, distance:1700, orbitSpeed:0.004,
        titulo:"Tu forma única de ser",
        mensaje: `
Urano gira de lado, como si dijera “yo voy a mi rollo”. Y tú eres un poco así, pero en el buen sentido. No intentas copiar a nadie, no vas detrás de modas raras, simplemente eres tú. Y eso es lo que te hace tan especial. Tienes un humor muy tuyo, una forma de hablar muy tuya y una manera de ver las cosas que siempre me sorprende. Urano es diferente; tú también. Y menos mal, porque si fueras como todos, no serías tú.
`
    },

    {
        nombre:"Neptuno", textura:"textures/neptune.jpg", colorBase:0x274687, size:20, distance:2200, orbitSpeed:0.003,
        titulo:"Tu calma cuando hace falta",
        mensaje: `
Neptuno está lejos y es tranquilo, y tú tienes esa parte tuya que da paz. Aunque seas de risa fácil y tonterías, cuando toca escuchar, escuchas de verdad. Contigo puedo soltar cualquier cosa sin miedo a que me juzgues. Y eso no lo hace cualquiera. Tienes esa mezcla de locura y calma que hace que estar contigo sea cómodo. Neptuno es frío, pero tú eres justo lo contrario: eres esa persona que te hace sentir acompañado incluso cuando no dices nada.
`
    }
];


// =====================================================
// ELEMENTOS DEL COSMOS (Clase y Funciones)
// =====================================================
class Planet {
    constructor(data){
        this.data = data;
        this.angle = Math.random() * Math.PI * 2;
        this.isDestroyed = false; 
        const geometry = new THREE.SphereGeometry(data.size, 64, 64);
        this.material = new THREE.MeshPhongMaterial({ color: data.colorBase, shininess: 15 });
        textureLoader.load(data.textura, (texture) => { this.material.map = texture; this.material.color.setHex(0xffffff); this.material.needsUpdate = true; });
        this.mesh = new THREE.Mesh(geometry, this.material);
        scene.add(this.mesh);
        if(data.nombre === "Saturno"){
            const ringGeometry = new THREE.RingGeometry(data.size * 1.4, data.size * 2.3, 256);
            this.ringMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6, shininess: 5 });
            textureLoader.load("textures/saturn_rings.jpg", (texture) => { this.ringMaterial.map = texture; this.ringMaterial.map.wrapS = THREE.RepeatWrapping; this.ringMaterial.map.repeat.set(6, 1); this.ringMaterial.needsUpdate = true; }, undefined, (err) => this.ringMaterial.color.setHex(0xd8c28f));
            this.ringMesh = new THREE.Mesh(ringGeometry, this.ringMaterial);
            this.ringMesh.rotation.x = Math.PI / 2;
            this.mesh.add(this.ringMesh);
        }
    }
    update(){
        if(this.isDestroyed) { 
            if(this.mesh.scale.x > 0.02) { 
                this.mesh.scale.subScalar(0.02); 
                this.mesh.rotation.y += 0.02; 
            } else { 
                scene.remove(this.mesh); 
            } 
            return; 
        }
        if(destructionState === "NORMAL" || destructionState === "METEOR_ATTACK" || destructionState === "SHOCKWAVE_EXPANSION") {
            if (targetObject === this && isFocused) { 
                this.mesh.rotation.y += 0.002; 
                return; 
            }
            this.angle += this.data.orbitSpeed * 0.01;
            this.mesh.position.x = Math.cos(this.angle) * this.data.distance;
            this.mesh.position.z = Math.sin(this.angle) * this.data.distance;
            this.mesh.rotation.y += 0.005;
        }
    }
}

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 12000);
    updateCamera();
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    createLights(); 
    createStars(); 
    createSun(); 
    createAsteroidBelt(); 
    createOrbits(); 
    createPlanets();
    events();
    animate();
}

function createLights(){ 
    scene.add(new THREE.AmbientLight(0xffffff, 0.7)); 
    scene.add(new THREE.PointLight(0xffffff, 5, 12000)); 
}

function createSun(){
    const geometry = new THREE.SphereGeometry(80, 64, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    textureLoader.load("textures/sun.jpg", (texture) => { 
        material.map = texture; 
        material.needsUpdate = true; 
    });
    sunMesh = new THREE.Mesh(geometry, material);
    sunMesh.userData = { isSun: true, data: sunData };
    scene.add(sunMesh);

    const glowGeometry = new THREE.SphereGeometry(86, 32, 32); 
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff4500, 
        transparent: true, 
        opacity: 0.35, 
        side: THREE.BackSide 
    });
    sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(sunGlow);
}

function createAsteroidBelt(){
    asteroidBelt = new THREE.Group();
    const geometry = new THREE.DodecahedronGeometry(1.8, 0);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x554444, 
        shininess: 0, 
        flatShading: true 
    });

    for(let i = 0; i < asteroidCount; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        const radius = 680 + Math.random() * 100; 
        const angle = Math.random() * Math.PI * 2;

        mesh.position.set(
            Math.cos(angle) * radius, 
            (Math.random() - 0.5) * 25, 
            Math.sin(angle) * radius
        );

        mesh.rotation.set(
            Math.random() * Math.PI, 
            Math.random() * Math.PI, 
            0
        );

        const scale = 0.6 + Math.random() * 1.5; 
        mesh.scale.set(scale, scale, scale);

        mesh.userData = { 
            speed: 0.0005 + Math.random() * 0.001, 
            angle: angle, 
            radius: radius, 
            isDestroyed: false 
        };

        asteroidBelt.add(mesh);
    }

    scene.add(asteroidBelt);
}

function createPlanets(){ 
    planetData.forEach(data => { 
        planets.push(new Planet(data)); 
    }); 
}

function createOrbits(){
    planetData.forEach((data) => {
        const points = [];
        for(let i = 0; i <= 128; i++){
            const angle = (i / 128) * Math.PI * 2; 
            points.push(new THREE.Vector3(
                Math.cos(angle) * data.distance, 
                0, 
                Math.sin(angle) * data.distance
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
            geometry, 
            new THREE.LineBasicMaterial({ 
                color: 0x00d4ff, 
                transparent: true, 
                opacity: 0.15 
            })
        );

        scene.add(line);
        orbits.push({ 
            mesh: line, 
            distance: data.distance, 
            isDestroyed: false 
        }); 
    });
}

function createStars(){
    const geometry = new THREE.BufferGeometry(); 
    const vertices = [];

    for(let i = 0; i < 20000; i++){
        vertices.push(
            (Math.random() - 0.5) * 10000, 
            (Math.random() - 0.5) * 10000, 
            (Math.random() - 0.5) * 10000
        );
    }

    geometry.setAttribute(
        "position", 
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    scene.add(new THREE.Points(
        geometry, 
        new THREE.PointsMaterial({ 
            color: 0xffffff, 
            size: 1.5 
        })
    ));
}
// =====================================================
// EVENTOS Y CINEMÁTICA
// =====================================================
function events(){
    window.addEventListener("resize", onResize);
    document.addEventListener("mousedown", onMouseDown); 
    document.addEventListener("mousemove", onMouseMove); 
    document.addEventListener("mouseup", onMouseUp);

    document.addEventListener("wheel", onWheel, { passive: false });
    document.getElementById("canvas").addEventListener("click", onClickObject);

    document.addEventListener("touchstart", onTouchStart, { passive: false }); 
    document.addEventListener("touchmove", onTouchMove, { passive: false }); 
    document.addEventListener("touchend", onTouchEnd);

    document.addEventListener("keydown", (e) => { 
        if(e.key === "Escape") closePanel(); 
    });

    document.getElementById("btnPlay").addEventListener("click", startExperience);
    document.getElementById("btnCerrar").addEventListener("click", closePanel);
    document.getElementById("btnSiguiente").addEventListener("click", iniciarAtaqueMeteorito);
}

function showPanelContent(name, title, message){
    document.getElementById("panelPlanetaNombre").textContent = name;
    document.getElementById("panelTitulo").textContent = title;
    document.getElementById("panelContenido").textContent = message;
    document.getElementById("panelContenido").scrollTop = 0;
    document.getElementById("panelPlaneta").classList.add("activo");
}

function closePanel(){ 
    document.getElementById("panelPlaneta").classList.remove("activo"); 
    isFocused = false; 
    targetObject = null; 
}

function checkIntersection(clientX, clientY) {
    if(!experienceStarted || isFocused || destructionState !== "NORMAL") return;

    mouse.x = (clientX / window.innerWidth) * 2 - 1; 
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let clickTargets = planets.map(p => p.mesh); 
    clickTargets.push(sunMesh);

    const intersects = raycaster.intersectObjects(clickTargets);

    if(intersects.length){
        const clickedMesh = intersects[0].object;

        if(clickedMesh.userData && clickedMesh.userData.isSun){
            targetObject = clickedMesh; 
            isFocused = true; 
            showPanelContent(sunData.nombre, sunData.titulo, sunData.mensaje);
        }
        else {
            const planet = planets.find(p => p.mesh === clickedMesh);
            if(planet){
                targetObject = planet; 
                isFocused = true; 
                showPanelContent(planet.data.nombre, planet.data.titulo, planet.data.mensaje);
            }
        }
    }
}

function onClickObject(e){ 
    checkIntersection(e.clientX, e.clientY); 
}

// TOUCH
function onTouchStart(e) {
    if (isFocused || destructionState !== "NORMAL") return;

    if (e.touches.length === 1) { 
        controls.rotating = true; 
        controls.previousX = e.touches[0].clientX; 
        controls.previousY = e.touches[0].clientY; 
    } 
    else if (e.touches.length === 2) { 
        controls.rotating = false; 
        const dx = e.touches[0].clientX - e.touches[1].clientX; 
        const dy = e.touches[0].clientY - e.touches[1].clientY; 
        controls.pinchStartDist = Math.sqrt(dx * dx + dy * dy); 
    }
}

function onTouchMove(e) {
    if (isFocused || destructionState !== "NORMAL") return;

    if (e.touches.length === 1 && controls.rotating) {
        const dx = e.touches[0].clientX - controls.previousX; 
        const dy = e.touches[0].clientY - controls.previousY;

        controls.rotY += dx * 0.005; 
        controls.rotX += dy * 0.005;

        controls.rotX = Math.max(
            -(Math.PI / 2 - 0.05), 
            Math.min(Math.PI / 2 - 0.05, controls.rotX)
        );

        controls.previousX = e.touches[0].clientX; 
        controls.previousY = e.touches[0].clientY;
    } 
    else if (e.touches.length === 2) {
        e.preventDefault();

        const dx = e.touches[0].clientX - e.touches[1].clientX; 
        const dy = e.touches[0].clientY - e.touches[1].clientY; 
        const currentDist = Math.sqrt(dx * dx + dy * dy);

        const nextRadius = controls.radius - (currentDist - controls.pinchStartDist) * 2.0;

        if (nextRadius > 300 && nextRadius < 6000) 
            controls.radius = nextRadius;

        controls.pinchStartDist = currentDist;
    }
}

function onTouchEnd(e) { 
    controls.rotating = false; 

    if (e.touches.length === 0 && e.changedTouches.length === 1) 
        checkIntersection(e.changedTouches[0].clientX, e.changedTouches[0].clientY); 
}

// MOUSE
function onMouseDown(e){ 
    if(!isFocused && destructionState === "NORMAL") { 
        controls.rotating = true; 
        controls.previousX = e.clientX; 
        controls.previousY = e.clientY; 
    } 
}

function onMouseMove(e){
    if(!controls.rotating || isFocused || destructionState !== "NORMAL") return;

    controls.rotY += (e.clientX - controls.previousX) * 0.003; 
    controls.rotX += (e.clientY - controls.previousY) * 0.003;

    controls.rotX = Math.max(
        -(Math.PI / 2 - 0.05), 
        Math.min(Math.PI / 2 - 0.05, controls.rotX)
    );

    controls.previousX = e.clientX; 
    controls.previousY = e.clientY;
}

function onMouseUp(){ 
    controls.rotating = false; 
}

function onWheel(e){ 
    if(isFocused || destructionState !== "NORMAL") return;

    e.preventDefault();

    const nextRadius = controls.radius + (e.deltaY > 0 ? 120 : -120);

    if(nextRadius > 300 && nextRadius < 6000) 
        controls.radius = nextRadius;
}

function onResize(){ 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
}

// =====================================================
// INICIO EXPERIENCIA
// =====================================================
function startExperience(){
    experienceStarted = true;

    musicaParte1.play();

    const overlay = document.getElementById("overlayInicial");
    overlay.style.opacity = "0"; 
    overlay.style.pointerEvents = "none"; 

    setTimeout(() => { 
        overlay.style.display = "none"; 
        document.getElementById("btnSiguiente").style.display = "block"; 
    }, 1200);

    document.getElementById("loaderText").style.display = "none";
}

// =====================================================
// ATAQUE METEORITO Y ONDA (CINEMÁTICA)
// =====================================================
function iniciarAtaqueMeteorito() {
    if(destructionState !== "NORMAL") return;

    closePanel(); 
    document.getElementById("btnSiguiente").style.display = "none";

    destructionState = "METEOR_ATTACK"; 
    lerpFactor = 0.001; 

    const meteorGeo = new THREE.DodecahedronGeometry(24, 1);
    const meteorMat = new THREE.MeshPhongMaterial({ 
        color: 0x2a1a15, 
        emissive: 0x992200, 
        shininess: 2, 
        flatShading: true 
    });

    meteorMesh = new THREE.Mesh(meteorGeo, meteorMat);

    const frontDir = new THREE.Vector3(); 
    camera.getWorldDirection(frontDir);

    const rightDir = new THREE.Vector3(); 
    rightDir.crossVectors(frontDir, camera.up).normalize(); 

    meteorMesh.position
        .copy(camera.position)
        .addScaledVector(frontDir, 550)
        .addScaledVector(rightDir, 700);

    scene.add(meteorMesh);

    textureLoader.load("textures/meteorito.png", (texture) => { 
        meteorMat.map = texture; 
        meteorMat.needsUpdate = true; 
    });
}

function detonarOndaExpansiva() {
    destructionState = "SHOCKWAVE_EXPANSION"; 
    shockwaveRadius = 80; 

    const shockwaveGeo = new THREE.SphereGeometry(1, 64, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({ 
        color: 0xffaa00, 
        transparent: true, 
        opacity: 0.65, 
        side: THREE.DoubleSide 
    });

    shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.position.set(0, 0, 0); 
    scene.add(shockwaveMesh);

    if(sunMesh) scene.remove(sunMesh); 
    if(sunGlow) scene.remove(sunGlow); 
    if(meteorMesh) scene.remove(meteorMesh);
}

function finalizarDesintegracion() {

    musicaParte1.pause();
    musicaParte1.currentTime = 0;

    const flash = document.getElementById("destelloBlanco");
    flash.style.transition = "opacity 0.6s ease-out"; 
    flash.style.opacity = "1"; 

    setTimeout(() => {
        if(asteroidBelt) scene.remove(asteroidBelt); 
        if(shockwaveMesh) scene.remove(shockwaveMesh); 

        orbits.forEach(o => scene.remove(o.mesh));

        document.getElementById("contenedorParte2").classList.add("activo");

        renderer.domElement.style.display = "none";

        destructionState = "FINISHED";

        iniciarNarrativaKikiYLala(); 
    }, 600);

    setTimeout(() => { 
        flash.style.transition = "opacity 1.5s ease-in-out"; 
        flash.style.opacity = "0"; 
    }, 1200);
}

// =====================================================
// BUCLE PRINCIPAL Y LÓGICA DE FÍSICAS
// =====================================================
function updateCamera(){
    if (destructionState === "METEOR_ATTACK" || destructionState === "SHOCKWAVE_EXPANSION") { 
        camera.lookAt(0, 0, 0); 
        return; 
    }

    if (isFocused && targetObject) {
        const objectPos = targetObject.position ? targetObject.position : targetObject.mesh.position;

        const objectSize = targetObject.userData && targetObject.userData.isSun 
            ? sunData.size 
            : targetObject.data.size;

        const offsetDistance = objectSize * 5.2;

        const targetCamX = objectPos.x + offsetDistance * 1.3; 
        const targetCamY = objectPos.y + offsetDistance * 0.4; 
        const targetCamZ = objectPos.z + offsetDistance * 1.3;

        camera.position.x += (targetCamX - camera.position.x) * 0.05; 
        camera.position.y += (targetCamY - camera.position.y) * 0.05; 
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

        camera.lookAt(new THREE.Vector3(
            objectPos.x + objectSize * 1.5, 
            objectPos.y - objectSize * 0.1, 
            objectPos.z - objectSize * 1.5
        ));

        controls.radius = camera.position.distanceTo(new THREE.Vector3(0,0,0));
    } 
    else {
        camera.position.x += (Math.sin(controls.rotY) * Math.cos(controls.rotX) * controls.radius - camera.position.x) * 0.08;
        camera.position.y += (Math.sin(controls.rotX) * controls.radius - camera.position.y) * 0.08;
        camera.position.z += (Math.cos(controls.rotY) * Math.cos(controls.rotX) * controls.radius - camera.position.z) * 0.08;

        camera.lookAt(0, 0, 0);
    }
}

function animate(){
    requestAnimationFrame(animate);

    if (destructionState !== "FINISHED") {

        planets.forEach(planet => planet.update());

        if(asteroidBelt) {
            asteroidBelt.children.forEach(ast => {
                ast.userData.angle += ast.userData.speed;
                ast.position.x = Math.cos(ast.userData.angle) * ast.userData.radius;
                ast.position.z = Math.sin(ast.userData.angle) * ast.userData.radius;
                ast.rotation.x += 0.01;
                ast.rotation.y += 0.01;
            });
        }

        if(sunMesh && destructionState === "NORMAL") 
            sunMesh.rotation.y += 0.001;

        if (destructionState === "METEOR_ATTACK" && meteorMesh) {
            const sunCenter = new THREE.Vector3(0, 0, 0);

            lerpFactor *= accelerationRate; 
            if(lerpFactor > 0.05) lerpFactor = 0.05; 

            meteorMesh.position.lerp(sunCenter, lerpFactor); 
            meteorMesh.rotation.x += 0.02; 
            meteorMesh.rotation.y += 0.03;

            if (meteorMesh.position.distanceTo(sunCenter) < 82) 
                detonarOndaExpansiva();
        }

        if (destructionState === "SHOCKWAVE_EXPANSION" && shockwaveMesh) {
            shockwaveRadius += shockwaveSpeed; 
            shockwaveMesh.scale.set(shockwaveRadius, shockwaveRadius, shockwaveRadius);

            if(shockwaveRadius > 500) { 
                shockwaveMesh.material.color.setHex(0xff5500); 
                shockwaveMesh.material.opacity -= 0.0015; 
            }

            planets.forEach(p => { 
                if (!p.isDestroyed) { 
                    const dist = p.mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)); 
                    if (shockwaveRadius >= dist) 
                        p.isDestroyed = true; 
                } 
            });

            orbits.forEach(o => { 
                if (!o.isDestroyed && shockwaveRadius >= o.distance) { 
                    o.isDestroyed = true; 
                }

                if (o.isDestroyed && o.mesh.material.opacity > 0) { 
                    o.mesh.material.opacity -= 0.01; 
                    if(o.mesh.material.opacity <= 0) 
                        scene.remove(o.mesh); 
                } 
            });

            if (asteroidBelt) { 
                asteroidBelt.children.forEach(ast => { 
                    const dist = ast.position.distanceTo(new THREE.Vector3(0,0,0)); 
                    if (shockwaveRadius >= dist && ast.scale.x > 0) { 
                        ast.scale.subScalar(0.03); 
                        if(ast.scale.x < 0) 
                            ast.scale.set(0,0,0); 
                    } 
                }); 
            }

            if (shockwaveRadius > 2500 || shockwaveMesh.material.opacity <= 0) 
                finalizarDesintegracion();
        }

        updateCamera();
        renderer.render(scene, camera);
    }
}
// =====================================================
// SONIDO DE DIÁLOGO ESTILO POKÉMON
// =====================================================
const sonidoDialogo = new Audio("sounds/dialogo.mp3");
sonidoDialogo.volume = 0.45;

// =====================================================
// PARTE 2 — KIKI Y LALA (DIÁLOGOS + ANIMACIONES)
// =====================================================

function iniciarNarrativaKikiYLala() {
    const contenedor = document.getElementById("contenedorParte2");

    // LIMPIA POR SI ACASO
    contenedor.innerHTML = "";

    // Crear personajes
    const kiki = document.createElement("img");
    kiki.src = "img/kiki.png";
    kiki.id = "kiki";
    kiki.className = "personaje";

    const lala = document.createElement("img");
    lala.src = "img/lala.png";
    lala.id = "lala";
    lala.className = "personaje";

    contenedor.appendChild(kiki);
    contenedor.appendChild(lala);

    // Caja de diálogo
    const caja = document.createElement("div");
    caja.id = "cajaDialogo";
    contenedor.appendChild(caja);

    // Animación de entrada
    setTimeout(() => {
        kiki.classList.add("entrar-kiki");
        lala.classList.add("entrar-lala");
        caja.classList.add("visible");
        mostrarDialogos(caja, kiki, lala);
    }, 500);
}

// =====================================================
// DIÁLOGOS INICIALES — KIKI Y LALA (CON SONIDO)
// =====================================================

function mostrarDialogos(caja, kiki, lala) {
    const frases = [
        "Kiki: ¡Lala, Lala! ¿Viste esa explosión en el cielo? ¡Parecía magia pura!",
        "Lala: Sí, Kiki… pero no era magia normal… era una luz súper especial.",
        "Kiki: ¡Es verdad! ¡Esa luz solo aparece una vez al año!",
        "Lala: Kiki… ¿no será porque hoy es… el cumpleaños de Paula?",
        "Kiki: ¡¡SÍ!! ¡Tenemos que ir a felicitarla ahora mismo!",
        "Lala: ¡Vamos! ¡Rápido! ¡No podemos llegar tarde a un día tan importante!"
    ];

    let index = 0;
    let puedePasar = true;

    caja.textContent = frases[index];

    const avanzar = () => {
        if (!puedePasar) return;
        puedePasar = false;

        // 🔊 SONIDO POKÉMON AL CAMBIAR DE DIÁLOGO
        sonidoDialogo.currentTime = 0;
        sonidoDialogo.play();

        index++;

        if (index < frases.length) {
            caja.style.opacity = "0";

            setTimeout(() => {
                caja.textContent = frases[index];
                caja.style.opacity = "1";
                puedePasar = true;
            }, 250);

        } else {
            document.removeEventListener("click", avanzar);
            document.removeEventListener("touchstart", avanzar);

            kiki.style.opacity = "0";
            lala.style.opacity = "0";
            caja.style.opacity = "0";

            setTimeout(() => {
                iniciarEscenaVolando();
            }, 600);
        }
    };

    document.addEventListener("click", avanzar);
    document.addEventListener("touchstart", avanzar);
}

// =====================================================
// ESCENA 2 — KIKI Y LALA VOLANDO
// =====================================================

function iniciarEscenaVolando() {
    const contenedor = document.getElementById("contenedorParte2");
    contenedor.innerHTML = "";

    const volando = document.createElement("img");
    volando.src = "img/kiki_lala_volando.png";
    volando.id = "kikiLalaVolando";
    volando.className = "volando";

    contenedor.appendChild(volando);

    setTimeout(() => {
        volando.classList.add("entrar-volando");
    }, 200);

    setTimeout(() => {
        mostrarDialogoFinal();
    }, 4000);
}

// =====================================================
// ESCENA FINAL — KIKI IZQUIERDA + LALA DERECHA + DIÁLOGO
// =====================================================

function mostrarDialogoFinal() {
    const contenedor = document.getElementById("contenedorParte2");
    contenedor.innerHTML = "";

    const kiki = document.createElement("img");
    kiki.src = "img/kiki.png";
    kiki.id = "kikiFinal";
    kiki.className = "personajeFinal";

    const lala = document.createElement("img");
    lala.src = "img/lala.png";
    lala.id = "lalaFinal";
    lala.className = "personajeFinal";

    const caja = document.createElement("div");
    caja.id = "cajaDialogoFinal";

    contenedor.appendChild(kiki);
    contenedor.appendChild(lala);
    contenedor.appendChild(caja);

    const frases = [
        "Kiki: ¡Hola Paula! ¡Por fin llegamos contigo!",
        "Lala: Perdona si tardamos un poquito… el cielo estaba muy brillante hoy.",
        "Kiki: Pero no tanto como tú, jeje.",
        "Lala: Queríamos decirte algo muy importante…",
        "Kiki: Hoy no es un día cualquiera…",
        "Lala: Hoy es el día en que el universo sonríe porque tú cumples años."
    ];

    let index = 0;
    let puedePasar = true;

    caja.textContent = frases[index];

    setTimeout(() => {
        kiki.classList.add("entrar-kiki-final");
        lala.classList.add("entrar-lala-final");
        caja.classList.add("visible");
    }, 300);

    const avanzar = () => {
        if (!puedePasar) return;
        puedePasar = false;

        // 🔊 SONIDO POKÉMON AL CAMBIAR DE DIÁLOGO
        sonidoDialogo.currentTime = 0;
        sonidoDialogo.play();

        index++;

        if (index < frases.length) {
            caja.style.opacity = "0";

            setTimeout(() => {
                caja.textContent = frases[index];
                caja.style.opacity = "1";
                puedePasar = true;
            }, 250);
        } else {
            // FIN DE FASE 2 → EMPIEZA LA CONSTRUCCIÓN DE LA carta
            document.removeEventListener("click", avanzar);
            document.removeEventListener("touchstart", avanzar);

            kiki.style.opacity = "0";
            lala.style.opacity = "0";
            caja.style.opacity = "0";

            setTimeout(() => {
                iniciarConstruccionEstrella(); // ⭐ Aquí empieza la FASE 3
            }, 600);
        }
    };

    document.addEventListener("click", avanzar);
    document.addEventListener("touchstart", avanzar);
}


function iniciarConstruccionEstrella() {
    const contenedor = document.getElementById("contenedorParte2");
    contenedor.innerHTML = "";

    contenedor.innerHTML = `
        <div id="tarjetaContainer">
            <div id="tarjeta">

                <div class="cara cara-frontal">
                    <img src="img/portada_paula.png" alt="Portada Paula" class="portada-img">
                </div>

                <div class="cara cara-interior">
                    <div class="lado-izquierdo">
                        <img src="img/interior_tarjeta.png" alt="Decoración interior" class="imagen-interior">
                    </div>

                    <div class="lado-derecho">
                        <h2 class="titulo-interior">✦ Para Paula ✦</h2>

                        <p>
                        Chiqui, esta tarjeta la hago con todo mi cariño para ti, por todos esos buenos momentos juntos de los dos
                        e íntimos nuestros, nuestras conversacion de confianza, nuestras bromas, risas etc.
                        dentro de un par de añitos (muy pronto) nuestra confianza será la bomba, al igual que todos los momentos
                         que nos quedan por pasar y disfrutar juntos.
                        </p>

                        <p>
                        Kiki y Lala dicen que tu luz se nota incluso desde lejos, y la verdad… yo también lo creo.  
                        Tienes algo que hace que todo sea super bonito y si soy el unico que te lo ha dicho es porque para mis ojos
                        tu eres super especial.
                        </p>

                        <p>
                        Gracias por ser como eres: auténtica, divertida, chill, amable... lo tienes todo y si te falta
                        algo, no te preocupes porque te ayudare a mejorarlo o conseguirlo.
                        </p>

                        <p>
                        Ojalá el año que viene y todos los demás los pasemos juntos, porque necesito seguir molestandote con mis
                        tonterias y seguir con nuestros cachondeos, te quiero mucho.
                        </p>

                        <p class="parrafo final">
                        Feliz cumpleaños, Chiqui.  
                        Con cariño,  
                        Kiki, Lala y Mario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const tarjeta = document.getElementById("tarjeta");
    tarjeta.addEventListener("click", () => {
        tarjeta.classList.add("tarjeta-abierta");
        mostrarBotonSeguir();
    });
} // ← AHORA SÍ CIERRA LA FUNCIÓN

function mostrarBotonSeguir() { 
    if (document.getElementById("seguirViaje")) return;

    const botonSeguir = document.createElement("button");
    botonSeguir.id = "seguirViaje";
    botonSeguir.className = "boton-inicio";
    botonSeguir.textContent = "+ CONTINUAR VIAJE +";

    botonSeguir.style.position = "fixed";
    botonSeguir.style.bottom = "40px";
    botonSeguir.style.right = "40px";
    botonSeguir.style.zIndex = "9999";

    document.body.appendChild(botonSeguir);

    botonSeguir.addEventListener("click", () => {
        const overlay = document.createElement("div");
        overlay.id = "transicion-negra";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "black";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 1s ease";
        overlay.style.zIndex = "99999";
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = "1";
        }, 50);

        setTimeout(() => {
            const tarjetaElement = document.querySelector(".tarjeta") || document.getElementById("tarjeta");
            if (tarjetaElement) tarjetaElement.remove();
            botonSeguir.remove();
            overlay.remove();      // quitamos el negro
            iniciarParte3();       // pasamos a la parte 3
        }, 1200);
    }); // ← cierra addEventListener
} // ← cierra mostrarBotonSeguir

/* ============================================================
      PARTE 3 RETRO — VERSIÓN FINAL SENIOR
   ============================================================ */

function iniciarParte3() {

    musicaParte3.currentTime = 0;
  musicaParte3.play();

  const app = document.getElementById("contenedorParte2");

  /* ============================
        ESTRUCTURA PRINCIPAL
     ============================ */

  app.innerHTML = `
    <section class="parte3-retro" id="parte3Retro">

      <!-- Estrellas generadas por JS -->

      <div class="retro-card">
        <h2 class="retro-title">PAULA · RETRO LOVE ADVENTURE</h2>
        <p class="retro-text" id="retroText"></p>

        <div class="retro-options">
          <button class="retro-btn" id="btnCarta"><span>✉</span>CARTA</button>
          <button class="retro-btn" id="btnCorazon"><span>♥</span>CORAZÓN</button>
          <button class="retro-btn" id="btnEstrella"><span>✦</span>ESTRELLA</button>
        </div>

        <button class="btn-final-retro" id="btnFinalRetro">FINAL ✦</button>

        <div class="retro-footer" id="retroFooter">
          Elige una opción para desbloquear un recuerdo.
        </div>
      </div>

      <!-- Modal -->
      <div class="retro-modal" id="retroModal">
        <div class="retro-modal-content" id="retroModalContent"></div>
      </div>

    </section>
  `;

  /* ============================
        GENERAR ESTRELLAS
     ============================ */

  const scene = document.getElementById("parte3Retro");

  for (let i = 0; i < 60; i++) {
    const star = document.createElement("div");
    star.classList.add("star-retro");
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
    scene.appendChild(star);
  }

  /* ============================
        TEXTO TIPO CONSOLA
     ============================ */

  const retroText = document.getElementById("retroText");
  const message = `Has llegado al último nivel de este viaje.\n\nAquí no hay jefes finales ni vidas extra.\nSolo tú, yo... y un recordatorio:\n\nsigues siendo una de las personas más importantes de mi universo.`;

  let index = 0;

  function typeWriter() {
    if (index < message.length) {
      const char = message.charAt(index);
      retroText.innerHTML += (char === "\n" ? "<br>" : char);
      index++;
      setTimeout(typeWriter, 35);
    }
  }

  typeWriter();

  /* ============================
            MODALES
     ============================ */

  const modal = document.getElementById("retroModal");
  const modalContent = document.getElementById("retroModalContent");
  const footer = document.getElementById("retroFooter");

  function abrirModal(tipo) {
    modalContent.className = "retro-modal-content " + tipo;

    let contenido = "";

    if (tipo === "carta") {
      contenido = `
        <div class="retro-modal-close" id="retroModalClose">CERRAR</div>
        <p class="retro-modal-text">
        Paula,<br><br>
        Si pudiera escribir todo lo que significas para mí, no me cabría en una sola carta.<br><br>
        Solo quiero que sepas que este viaje, esta web y cada detalle están hechos pensando en ti.<br><br>
        Gracias por ser parte de mi historia.
        </p>
      `;
      footer.textContent = "Has abierto una carta que no se borra.";
    }

    if (tipo === "corazon") {
      contenido = `
        <div class="retro-modal-close" id="retroModalClose">CERRAR</div>
        <p class="retro-modal-text">
        Tu corazón late dentro del mío.<br><br>
        Gracias por existir.
        </p>
      `;
      footer.textContent = "Tu corazón siempre tendrá un hueco en el mío.";
    }

    if (tipo === "estrella") {
      contenido = `
        <div class="retro-modal-close" id="retroModalClose">CERRAR</div>
        <p class="retro-modal-text">
        Eres la estrella que ilumina mi universo.<br><br>
        Y nunca dejarás de brillar.
        </p>
      `;
      footer.textContent = "En mi universo, tú siempre serás una estrella.";
    }

    modalContent.innerHTML = contenido;
    modal.classList.add("active");

    document.getElementById("retroModalClose").onclick = () => {
      modal.classList.remove("active");
    };
  }

  /* ============================
            BOTONES
     ============================ */

  document.getElementById("btnCarta").onclick = () => abrirModal("carta");
  document.getElementById("btnCorazon").onclick = () => abrirModal("corazon");
  document.getElementById("btnEstrella").onclick = () => abrirModal("estrella");

  document.getElementById("btnFinalRetro").onclick = () => mostrarPantallaFinal();
}

/* ============================================================
      PANTALLA FINAL DEL UNIVERSO — PARTE 3
   ============================================================ */

function mostrarPantallaFinal() {
  const app = document.getElementById("contenedorParte2");

  app.innerHTML = `
    <section class="parte3-universo-retro" id="parte3Universo">
      <div class="universo-stars" id="universoStars"></div>
      <div class="universo-text">
        <h1>TE QUIERO MUCHO CHIQUI</h1>
        <p>Este universo siempre tendrá un lugar reservado para ti.</p>
      </div>
    </section>
  `;

  const starsContainer = document.getElementById("universoStars");

  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.classList.add("universo-star");
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
    starsContainer.appendChild(star);
  }
}
function checkOrientation() {
    const warning = document.getElementById("rotateWarning");

    if (window.innerHeight > window.innerWidth) {
        // Móvil en vertical → mostrar aviso
        warning.style.display = "flex";
        document.body.style.overflow = "hidden";
    } else {
        // Móvil en horizontal → ocultar aviso
        warning.style.display = "none";
        document.body.style.overflow = "hidden";
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

// Ejecutar al cargar
checkOrientation();
window.addEventListener("load", init);
