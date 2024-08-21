default:
    just --list

build:
    wasm-pack build -t web  --release --out-dir ./packages/webz-core

test-web:
    WASM_BINDGEN_TEST_TIMEOUT=99999  wasm-pack test --release --headless --chrome

test:
    cargo test --target aarch64-apple-darwin

check:
    cargo check
