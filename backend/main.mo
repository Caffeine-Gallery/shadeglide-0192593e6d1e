import Int "mo:base/Int";

import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor {
  stable var shaderCode : Text = "
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec3 col = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));
      gl_FragColor = vec4(col, 1.0);
    }
  ";

  let shaderExamples = [
    ("Default", shaderCode),
    ("Plasma", "
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        vec3 col = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));
        float d = length(uv);
        d = sin(d * 8.0 + time) / 8.0;
        d = abs(d);
        d = 0.02 / d;
        col *= d;
        gl_FragColor = vec4(col, 1.0);
      }
    "),
    ("Fractal", "
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        vec2 z = uv;
        vec2 c = vec2(sin(time * 0.3) * 0.4, cos(time * 0.4) * 0.4);
        float i;
        for (int n = 0; n < 8; n++) {
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
          if (dot(z, z) > 4.0) break;
          i += 1.0;
        }
        vec3 col = 0.5 + 0.5 * cos(i * 0.2 + vec3(0.0, 0.6, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }
    ")
  ];

  public query func getShaderCode() : async Text {
    shaderCode
  };

  public func updateShaderCode(newCode : Text) : async () {
    shaderCode := newCode;
  };

  public query func getShaderExamples() : async [(Text, Text)] {
    shaderExamples
  };

  public func getTime() : async Int {
    Time.now()
  };
}
