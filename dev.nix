{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20      # Node.js 20.x
    (pkgs.python311.withPackages (ps: [])) # Python 3.11.10
    pkgs.gnumake42        # GNU Make 4.2
    pkgs.gcc          # GCC (includes g++)
  ];
}