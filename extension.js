
const St          = imports.gi.St;
const Main        = imports.ui.main;
const Tweener     = imports.ui.tweener;
const Me          = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const UP    = "up"
const DOWN  = "down"
const LEFT  = "left"
const RIGHT = "right"

let distances = {
    DOWN: (f, c) => c.y() - f.y(),
    LEFT: (f, c) => f.x() - c.x,
    RIGHT: (f, c) => c.x - f.x(),
    UP: (f, c) => f.y - c.y()
}

function distance(direction, focus, win) {
    let center = {
        "x": win.x() + (win.width() / 2),
        "y": win.y() + (win.height() / 2)
    }

    return distances[direction](focus, center)
}

function focus(direction) {
    let focus_window = global.disable.focus_window;
    let geometry     = focus_window.get_frame_rect();
    let workspace    = focus_window.get_workspace();

    let [ distance, window ] =
        workspace.list_windows().map(
            (w) => [ distance(direction, geometry, w.get_frame_rect()), w ]
        ).sort((a, b) => a[0] - b[0]).shift();

    if (window != focus_window) {
        Main.activateWindow(window)
    }
}

function enable() {
    [ LEFT, DOWN, UP, RIGHT ].forEach((direction) => {
        Main.wm.addKeybinding(
            "focus-" + direction,
            Convenience.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            () => focus(direction));
    });
}

function disable() {
    [ LEFT, DOWN, UP, RIGHT ].forEach((direction) =>
        Main.wm.removeKeybinding("focus-" + direction));
}
