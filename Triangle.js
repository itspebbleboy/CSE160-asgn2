class Shape {
    constructor(vertices, color, rotation) {
        this.vertices = vertices;
        this.color = color;
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.error('Failed to create the buffer object');
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }

    bindData() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    }
}

class Triangle extends Shape {
    constructor(x, y, color, size, rotation) {
        super([], color);
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size / 100;  // Adjust size relative to canvas size
        this.rotation = rotation;  // Store rotation in radians
        console.log(rotation)
        this.calculateVertices();
    }

    calculateVertices() {
        let halfSize = this.size / 2;
        let height = this.size * Math.sqrt(3) / 2;  // Height of the equilateral triangle

        // Base vertices without rotation
        let vertices = [
            [0, 2 * height / 3],             // Top vertex
            [-halfSize, -height / 3],        // Bottom left vertex
            [halfSize, -height / 3]          // Bottom right vertex
        ];

        // Rotate each vertex around the center
        this.vertices = vertices.map(vertex => {
            let rotatedX = Math.cos(this.rotation) * vertex[0] - Math.sin(this.rotation) * vertex[1] + this.x;
            let rotatedY = Math.sin(this.rotation) * vertex[0] + Math.cos(this.rotation) * vertex[1] + this.y;
            return [rotatedX, rotatedY];
        });

        // Update buffer data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices.flat()), gl.STATIC_DRAW);
    }

    render() {
        this.bindData();
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

function drawTriangle(){
    var n = 3;
    if (!this.vertexBuffer) {
        console.error('Failed to create the buffer object');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices){
    var n = 3;
    this.vertexBuffer = gl.createBuffer(); // Create a new buffer object
    if (!this.vertexBuffer) {
        console.error('Failed to create the buffer object');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}