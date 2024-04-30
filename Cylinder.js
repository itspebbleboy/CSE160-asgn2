class Cylinder{
    constructor(segments){
        this.type = 'cube';
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.segments = segments;
        this.vertices = [];
        var aStep = 360 / this.segments;
        var b = [0,0,0]
        b[0]
        var radius = .5;
        this.n = segments*4*9; //252
        for (let a = 0; a < 360; a += aStep) {
            var angle1 = a;
            var angle2 = a+aStep;
            var x1 = b[0] + Math.cos(angle1*Math.PI/180) * radius;
            var z1 = b[2] + Math.sin(angle1*Math.PI/180) * radius;
            var x2 = b[0] + Math.cos(angle2*Math.PI/180) * radius;
            var z2 = b[2] + Math.sin(angle2*Math.PI/180) * radius;
            this.vertices.push([0, 0,0 , x1, 0, z1, x2, 0, z2]);
            this.vertices.push([0, 1,0 , x1, 1, z1, x2, 1, z2]);
            this.vertices.push([x1, 0, z1, x2, 0, z2, x1, 1, z1]);
            this.vertices.push([x1, 1, z1, x2, 0, z2, x2, 1, z2]);
                        /*
            this.vertices.push([0.5, 0,-.5 , x1, 0, z1, x2, 0, z2]);
            this.vertices.push([0.5, 1,-.5 , x1, 1, z1, x2, 1, z2]);
            this.vertices.push([x1, 0, z1, x2, 0, z2, x1, 1, z1]);
            this.vertices.push([x1, 1, z1, x2, 0, z2, x2, 1, z2]);*/
        }
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices.flat()), gl.STATIC_DRAW);
     
    }

    render(){
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.TRIANGLES, 0, this.n);
    }

}