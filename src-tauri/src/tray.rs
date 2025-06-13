use tauri::{
    AppHandle,
    Manager,
    menu::{Menu, MenuItem},
    tray::{ClickType, TrayIcon, TrayIconBuilder},
};

pub fn create_tray(app: &AppHandle) -> TrayIcon {
    let menu = Menu::with_items(
        app,
        &[
            MenuItem::with_id("toggle", "Show/Hide").into(),
            MenuItem::Separator.into(),
            MenuItem::with_id("version", format!("Version: 0.1.0")).into(),
        ],
    ).expect("failed to create menu");

    let tray = TrayIconBuilder::new()
        .menu(&menu)
        .icon_as_template(true)
        .on_menu_event(move |app, event| {
            match event.id.as_str() {
                "toggle" => {
                    if let Some(window) = app.get_webview_window("main") {
                        if window.is_visible().unwrap_or(false) {
                            window.hide().unwrap_or_default();
                        } else {
                            window.show().unwrap_or_default();
                            window.set_focus().unwrap_or_default();
                        }
                    }
                }
                _ => {}
            }
        })
        .build(app)
        .expect("failed to create tray");

    tray.on_tray_icon_event(move |app, event| {
        if let ClickType::Left = event.click_type {
            if let Some(window) = app.get_webview_window("main") {
                if window.is_visible().unwrap_or(false) {
                    window.hide().unwrap_or_default();
                } else {
                    window.show().unwrap_or_default();
                    window.set_focus().unwrap_or_default();
                }
            }
        }
    });

    tray
}

pub fn update_version(tray: &TrayIcon, version: &str) {
    if let Some(menu) = tray.menu() {
        if let Some(item) = menu.get_item("version") {
            item.set_text(format!("Version: {}", version)).unwrap_or_default();
        }
    }
} 