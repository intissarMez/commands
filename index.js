var actions = {};

actions.getCommandPalette = function() {

			studio.extension.showModelessDialog("paletteDialog.html");
};


exports.handleMessage = function handleMessage(message) {
			var action	= message.action;

			if(typeof actions[action] === "function"){
					actions[action](message);
			} else {
					return false;
			}
};
