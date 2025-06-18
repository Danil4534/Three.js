import * as THREE from 'three'
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const AmbientLight = new THREE.AmbientLight("gray", 1)
const dirLight =  new THREE.DirectionalLight("lightblue", 1)

dirLight.position.set(10,5,5)

const pointLight = new THREE.PointLight("white",2000, 2000)
pointLight.position.set(0,10,0)

const whiteLight = new THREE.PointLight("white",50, 100)
whiteLight.position.set(0,50,0)

const spotLight = new THREE.SpotLight("white", 1000 ,100 )
spotLight.position.set(60,-10,40)


// Texture
const texture = new THREE.TextureLoader().load("./img/glass.jpg")
const textureMaterial =  new THREE.MeshStandardMaterial({map:texture})
const lightHelper = new THREE.PointLightHelper(spotLight)
// сцена
const scene = new THREE.Scene()

// Камера
const cam =  new THREE.PerspectiveCamera(100,window.innerWidth/ window.innerHeight, 0.1, 2000)

const renderer= new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Control Camera
const  controls = new OrbitControls(cam, renderer.domElement)
controls.enableDamping = false;
controls.dampingFactor = 0.05;
controls.screenSpacePanning=false;
controls.minDistance = 20;
// controls.maxDistance=10; 


// Cube
const geometry = new THREE.BoxGeometry()
const material =  new THREE.MeshStandardMaterial({color:"red"})
const cube =  new THREE.Mesh(geometry,material )
cube.position.set(0,0,0)
// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshPhongMaterial({
    color:"green",
    emissive: "white",
    shininess: 100
})
const sphere = new THREE.Mesh(sphereGeometry, textureMaterial)
sphere.position.set(0,4,0)
// Donut
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.2), new THREE.MeshStandardMaterial({color:"lightgreen"}))
torus.position.set(-2,4,0)
// Plane

// GSAP


// Load
const loader =  new GLTFLoader()

loader.load("Model/scene.gltf",
    (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center); 
        model.scale.set(1, 1, 1);
        scene.add(model);
   
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "%");
    },
    (error) => {
        console.error(error);
    }
);

const renderPass= new RenderPass(scene, cam)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)

const composer= new EffectComposer(renderer)
composer.addPass(renderPass)
composer.addPass(bloomPass)

// scene.add(torus)
// scene.add(sphere)
scene.add(whiteLight)
// scene.add(lightHelper)
// scene.add(cube)
scene.add(AmbientLight)
scene.add(dirLight)
scene.add(pointLight)
scene.add(spotLight)
function animate(){
    requestAnimationFrame(animate)
    torus.rotation.x -= 0.01
    torus.rotation.y -= 0.01
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
    composer.render()
}
animate()