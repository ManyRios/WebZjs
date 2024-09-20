use wasm_bindgen_test::*;
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

use http::Uri;
use js_sys::Promise;
use std::sync::Once;
use webz_core::bindgen::wallet::WebWallet;

use tokio_with_wasm::alias as tokio;
use tonic::{Request, Status};
use tonic_web_wasm_client::options::{Credentials, FetchOptions, Mode, ReferrerPolicy};
use tonic_web_wasm_client::Client;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsCast, UnwrapThrowExt};
use wasm_bindgen_futures::{spawn_local, JsFuture};
use wasm_thread as thread;

use zcash_client_backend::proto::service::compact_tx_streamer_client::CompactTxStreamerClient;
use zcash_client_backend::proto::service::ChainSpec;

const SEED: &str = "visit armed kite pen cradle toward reward clay marble oil write dove blind oyster silk oyster original message skate bench tone enable stadium element";
const HD_INDEX: u32 = 0;
const BIRTHDAY: Option<u32> = Some(2577329);

// Required to initialize the logger and panic hooks only once
static INIT: Once = Once::new();
pub fn initialize() {
    INIT.call_once(|| {
        webz_core::init::start();
    });
}

#[wasm_bindgen_test]
async fn test_get_and_scan_range() {
    initialize();
    #[cfg(all(feature = "wasm-parallel"))]
    let _ = JsFuture::from(wasm_bindgen_rayon::init_thread_pool(10)).await;
    assert!(!thread::is_web_worker_thread());
    let main_handler = thread::Builder::new().spawn_async(|| async {
        assert!(thread::is_web_worker_thread());
        let mut w = WebWallet::new("test", "http://localhost:1234/testnet", 1).unwrap();

        let id = w.create_account(SEED, HD_INDEX, BIRTHDAY).await.unwrap();
        tracing::info!("Created account with id: {}", id);

        #[cfg(not(feature = "sync2"))]
        {
            w.sync(&js_sys::Function::new_with_args(
                "scanned_to, tip",
                "console.log('Scanned: ', scanned_to, '/', tip)",
            ))
            .await
            .unwrap();
        }
        #[cfg(feature = "sync2")]
        {
            tracing::info!("Syncing wallet with sync2");
            w.sync2().await.unwrap();
        }
        tracing::info!("Syncing complete :)");

        let summary = w.get_wallet_summary().await.unwrap();
        tracing::info!("Wallet summary: {:?}", summary);

        tracing::info!("Proposing a transaction");
        w.transfer(SEED, 0, "utest1z00xn09t4eyeqw9zmjss75sf460423dymgyfjn8rtlj26cffy0yad3eea82xekk24s00wnm38cvyrm2c6x7fxlc0ns4a5j7utgl6lchvglfvl9g9p56fqwzvzvj9d3z6r6ft88j654d7dj0ep6myq5duz9s8x78fdzmtx04d2qn8ydkxr4lfdhlkx9ktrw98gd97dateegrr68vl8xu".to_string(), 1000).await.unwrap();
        tracing::info!("Transaction proposed");

        let summary = w.get_wallet_summary().await.unwrap();
        tracing::info!("Wallet summary: {:?}", summary);
        }).unwrap().join_async();

    main_handler.await.unwrap_throw();
}
