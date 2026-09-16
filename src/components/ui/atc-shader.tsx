// ShaderDemo_ATC.tsx (for your “ATC” one-liner)
"use client"

import React, { useEffect, useRef, useState } from "react"

const vertSrc = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`

const fragSrc = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;

// robust tanh fallback
float tanh1(float x){ float e = exp(2.0*x); return (e-1.0)/(e+1.0); }
vec4 tanh4(vec4 v){ return vec4(tanh1(v.x), tanh1(v.y), tanh1(v.z), tanh1(v.w)); }

void main(){
  vec3 FC = vec3(gl_FragCoord.xy, 0.0);
  vec3 r  = vec3(u_res, max(u_res.x, u_res.y));
  float t = u_time;

  vec4 o = vec4(0.0);

  // === code with safe inits & valid mat2 multiply, tanh replacement ===
  vec3 p = vec3(0.0);
  vec3 v = vec3(1.0, 2.0, 6.0);
  float i = 0.0, z = 1.0, d = 1.0, f = 1.0;

  for ( ; i++ < 5e1;
        o.rgb += (cos((p.x + z + v) * 0.1) + 1.0) / d / f / z )
  {
    p = z * normalize(FC * 2.0 - r.xyy);

    vec4 m = cos((p + sin(p)).y * 0.4 + vec4(0.0, 33.0, 11.0, 0.0));
    p.xz = mat2(m) * p.xz;

    p.x += t / 0.2;

    z += ( d = length(cos(p / v) * v + v.zxx / 7.0) /
           ( f = 2.0 + d / exp(p.y * 0.2) ) );
  }

  o = tanh4(0.2 * o);
  o.a = 1.0;
  fragColor = o;
}`

export interface ShaderDemoATCProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * Internal resolution scale for the raymarching shader.
   * Default 0.5 allows the 50-step volumetric raymarcher to run at a silky smooth 60fps
   * without freezing the GPU, while CSS smoothly scales the output full-screen.
   */
  resolutionScale?: number;
  /** Speed multiplier for animation */
  speed?: number;
  /** Show debug error banner if compilation fails */
  showDebug?: boolean;
}

export default function ShaderDemo_ATC({
  className = "",
  style = {},
  resolutionScale = 0.5,
  speed = 1.0,
  showDebug = false,
}: ShaderDemoATCProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const canvas = ref.current
    const pre = preRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      powerPreference: "high-performance",
      antialias: false,
    })
    if (!gl) {
      setSupported(false)
      if (pre) pre.textContent = "WebGL2 not available on this browser/GPU."
      return
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)
      if (!sh) throw new Error("Unable to create shader")
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(sh) || "compile error"
        gl.deleteShader(sh)
        throw new Error(info)
      }
      return sh
    }

    const link = (vs: string, fs: string) => {
      const p = gl.createProgram()
      if (!p) throw new Error("Unable to create WebGL program")
      const vShader = compile(gl.VERTEX_SHADER, vs)
      const fShader = compile(gl.FRAGMENT_SHADER, fs)
      gl.attachShader(p, vShader)
      gl.attachShader(p, fShader)
      gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(p) || "link error"
        gl.deleteProgram(p)
        throw new Error(info)
      }
      return p
    }

    let prog: WebGLProgram
    try {
      prog = link(vertSrc, fragSrc)
    } catch (e: any) {
      if (pre) pre.textContent = "Shader error:\n" + e.message
      return
    }

    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1,
      ]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "u_res")
    const uTime = gl.getUniformLocation(prog, "u_time")

    // Optimize resolution: volumetric 50-step raymarcher runs smoothly when scaled
    const resize = () => {
      if (!canvas) return
      const scale = Math.max(0.25, Math.min(1.0, resolutionScale))
      const clientW = canvas.clientWidth || window.innerWidth
      const clientH = canvas.clientHeight || window.innerHeight
      const w = Math.max(64, Math.floor(clientW * scale))
      const h = Math.max(64, Math.floor(clientH * scale))

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }

    const onResize = () => {
      resize()
    }
    window.addEventListener("resize", onResize, { passive: true })
    resize()

    let raf = 0
    const t0 = performance.now()
    const draw = (now: number) => {
      const t = ((now - t0) / 1000) * speed
      gl.uniform1f(uTime, t)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      if (gl) {
        gl.deleteBuffer(buf)
        gl.deleteProgram(prog)
      }
    }
  }, [resolutionScale, speed])

  if (!supported && !showDebug) {
    return null
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...style }}
    >
      <canvas
        ref={ref}
        className="w-full h-full block bg-black"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "#000",
          imageRendering: "auto",
        }}
      />
      {showDebug && (
        <pre
          ref={preRef}
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            color: "#0f0",
            whiteSpace: "pre-wrap",
            pointerEvents: "none",
            fontSize: "12px",
          }}
        />
      )}
    </div>
  )
}
