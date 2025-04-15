{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20  # Node.js 20.x (matches your version: 20.18.1)
    pkgs.python3    # Python 3 (already installed)
  ];
}