import { backend } from 'declarations/backend';

let gl, program, timeLocation, resolutionLocation;
let startTime;

async function init() {
    const canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const shaderCode = await backend.getShaderCode();
    document.getElementById('shaderCode').value = shaderCode;

    createShaderProgram(shaderCode);
    startTime = await backend.getTime();

    window.addEventListener('resize', onResize);
    onResize();

    document.getElementById('updateShader').addEventListener('click', updateShader);

    requestAnimationFrame(render);
}

function createShaderProgram(fragmentShaderSource) {
    const vertexShaderSource = `
        attribute vec4 position;
        void main() {
            gl_Position = position;
        }
    `;

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    timeLocation = gl.getUniformLocation(program, 'time');
    resolutionLocation = gl.getUniformLocation(program, 'resolution');
}

function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function onResize() {
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function render() {
    const currentTime = performance.now() / 1000;
    gl.uniform1f(timeLocation, currentTime);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

async function updateShader() {
    const newShaderCode = document.getElementById('shaderCode').value;
    await backend.updateShaderCode(newShaderCode);
    createShaderProgram(newShaderCode);
}

init();
