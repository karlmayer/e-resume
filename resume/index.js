const { Console } = require("console");
var fs = require("fs");
var Handlebars = require("handlebars");

function render(resume) {
	var template = fs.readFileSync(__dirname + "/resume-template.hbs", "utf-8");
	return renderTemplate(resume, template);
}

function renderTemplate(resume, template) {
	var css = fs.readFileSync(__dirname + "/resume-template.css", "utf-8");

	// var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// Format dates
	Handlebars.registerHelper('date', function (date) {
		var date = new Date(date);
		date.setDate(date.getDate() + 1); // add a day for off-by-one formatting
		// format Jan 1st and Dec 31st as only the year (personal preference)
		if ((date.getDate() === 1 && date.getMonth() === 0) ||
			(date.getDate() === 31 && date.getMonth() === 11)) {
			return date.getFullYear();
		}
		return months[date.getMonth()] + ' ' + date.getFullYear();
	});

	Handlebars.registerHelper("style", function (css) {
		var result = '<style>' + css + '</style>';
		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('paragraphSplit', function (plaintext) {
		var i, output = '',
			lines = plaintext.split(/\r\n|\r|\n/g);
		for (i = 0; i < lines.length; i++) {
			if (lines[i]) {
				output += '<p>' + lines[i] + '</p>';
			}
		}
		return new Handlebars.SafeString(output);
	});

	// hack: set CSS media type when rendering PDFs
	for (let i in process.argv) {
		if (process.argv[i].includes(".pdf")) {
			module.exports.pdfRenderOptions = { mediaType: 'print' };
		}
	}

	return Handlebars.compile(template)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render,
	pdfRenderOptions: {}
};
