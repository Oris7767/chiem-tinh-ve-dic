{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20    # Node.js 20.x
    pkgs.python3      # Python 3
    pkgs.gnumake42    # GNU Make 4.2
    pkgs.gcc          # GCC (includes g++)
  ];
}