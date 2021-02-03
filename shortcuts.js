chrome.commands.onCommand.addListener((command) => {
    console.log('command-name', command);
    switch(command) {
        case 'toggle-gmap-ui-block':
            action();
            break;
        default:
            break;
    }
})