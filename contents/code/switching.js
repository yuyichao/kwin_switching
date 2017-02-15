var Dir = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4,
};

function printAllNames(obj) {
    for (var name in obj) {
        print(name, obj[name]);
    }
}

function isOnDesktop(c, d) {
    return c.onAllDesktops || c.desktop == d;
}

function wantsTabFocus(c) {
    return (c.normalWindow || c.dialog) && c.wantsInput;
}

function switchWindow(dir) {
    var c = workspace.activeClient;
    if (c === undefined)
        return;
    var desktopNumber = (c.onAllDesktops ? workspace.currentDesktop :
                         c.desktop);
    var x = c.x + c.width / 2;
    var y = c.y + c.height / 2;
    var switchTo;
    var bestScore = 0;
    var list = workspace.clientList();
    for (var i in list) {
        var client = list[i];
        // ignore activity for now...
        if (!wantsTabFocus(client) || client == c || client.minimized || !isOnDesktop(client, desktopNumber) ||
            !client.isCurrentTab)
            continue;
        var otherX = client.x + client.width / 2;
        var otherY = client.y + client.height / 2;
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
                switchTo = client;
                bestScore = score;
            }
        }
    }
    if (switchTo !== undefined) {
        workspace.activeClient = switchTo;
    }
}

switchWindow(Dir.Left);
