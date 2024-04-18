var Dir = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4,
};

function isOnDesktop(w, d) {
    if (w.onAllDesktops)
        return true;
    for (var cd of w.desktops) {
        if (cd == d) {
            return true;
        }
    }
    return false;
}

function wantsTabFocus(w) {
    return (w.normalWindow || w.dialog) && w.wantsInput;
}

function getWindowDesktop(w) {
    var ds = w.desktops;
    if (ds.length != 1)
        return workspace.currentDesktop;
    return ds[0];
}

function switchWindow(dir) {
    var w = workspace.activeWindow;
    if (w === undefined)
        return;
    var desktop = getWindowDesktop(w);
    var x = w.x + w.width / 2;
    var y = w.y + w.height / 2;
    var switchTo;
    var bestScore = 0;
    var list = workspace.windowList();
    for (var i in list) {
        var win = list[i];
        // ignore activity for now...
        if (!wantsTabFocus(win) || win == w || win.minimized ||
            !isOnDesktop(win, desktop))
            continue;
        var otherX = win.x + win.width / 2;
        var otherY = win.y + win.height / 2;
        var distance = -1;
        var offset = -1;
        switch (dir) {
            case Dir.Up:
                distance = y - otherY;
                offset = Math.abs(x - otherX);
                break;
            case Dir.Down:
                distance = otherY - y;
                offset = Math.abs(x - otherX);
                break;
            case Dir.Left:
                distance = x - otherX;
                offset = Math.abs(y - otherY);
                break;
            case Dir.Right:
                distance = otherX - x;
                offset = Math.abs(y - otherY);
                break;
        }
        if (distance > 0) {
            var score = distance + offset + (offset * offset) / distance;
            if (score < bestScore || switchTo === undefined) {
                switchTo = win;
                bestScore = score;
            }
        }
    }
    if (switchTo !== undefined) {
        workspace.activeWindow = switchTo;
    }
}

registerShortcut("SWITCHING: Switch left",
                 "Switch to left window (no wrapping)",
                 "Meta+H",
                 function() {
                     switchWindow(Dir.Left);
                 });
registerShortcut("SWITCHING: Switch right",
                 "Switch to right window (no wrapping)",
                 "Meta+L",
                 function() {
                     switchWindow(Dir.Right);
                 });
registerShortcut("SWITCHING: Switch up",
                 "Switch to window above (no wrapping)",
                 "Meta+K",
                 function() {
                     switchWindow(Dir.Up);
                 });
registerShortcut("SWITCHING: Switch down",
                 "Switch to window below (no wrapping)",
                 "Meta+J",
                 function() {
                     switchWindow(Dir.Down);
                 });
