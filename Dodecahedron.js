
const phi = (1 + Math.sqrt(5)) / 2; //golden ratio
const v = [
    // (±1, ±1, ±1)
    [1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1],
    [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1],
    // (0, ±phi, ±1/phi)
    [0, phi, 1/phi], [0, phi, -1/phi], [0, -phi, 1/phi], [0, -phi, -1/phi],
    // (±1/phi, 0, ±phi)
    [1/phi, 0, phi], [-1/phi, 0, phi], [1/phi, 0, -phi], [-1/phi, 0, -phi],
    // (±phi, ±1/phi, 0) 17
    [phi, 1/phi, 0], [-phi, 1/phi, 0], [phi, -1/phi, 0], [-phi, -1/phi, 0]
];
const faces =[
    [v[8], v[0], v[12], v[13], v[1]],
    [v[8], v[1], v[17], v[5], v[9]],
    [v[3], v[13], v[1], v[17], v[19]],
    [v[2], v[12], v[13], v[3], v[10]],
    [v[3], v[10], v[11], v[7], v[19]],
    [v[7], v[19], v[17], v[5], v[15]],
    [v[9], v[8], v[0], v[16], v[4]],
    [v[2], v[18], v[16], v[0], v[12]],
    [v[18], v[16], v[4], v[14], v[6]],
    [v[11], v[10], v[2], v[18], v[6]],
    [v[11], v[6], v[14], v[15], v[7]],
    [v[14], v[4], v[9], v[5], v[15]],
];

class Dodecahedron{
    constructor() {
        this.type = 'dodecahedron';
        this.color = [1.0, 1.0, 1.0, 1.0]; // default (white)
        this.matrix = new Matrix4();
        this.vertices = [];

        faces.forEach(element => {
            this.vertices.push([element[0],element[1],element[2]].flat());
            this.vertices.push([element[2],element[3],element[4]].flat());
            this.vertices.push([element[2],element[0],element[4]].flat());
        });
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices.flat()), gl.STATIC_DRAW);
    }
    render() {
        const rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.TRIANGLES, 0, 324);
    }
}

function drawPentagon3D(v, int) {
    drawTriangle3D([v[0],v[1],v[2]].flat());
    drawTriangle3D([v[2],v[3],v[4]].flat());
    drawTriangle3D([v[2],v[0],v[4]].flat());
}