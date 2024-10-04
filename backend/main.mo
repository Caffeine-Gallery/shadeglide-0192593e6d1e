import Int "mo:base/Int";

import Text "mo:base/Text";
import Time "mo:base/Time";

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

  public query func getShaderCode() : async Text {
    shaderCode
  };

  public func updateShaderCode(newCode : Text) : async () {
    shaderCode := newCode;
  };

  public func getTime() : async Int {
    Time.now()
  };
}
