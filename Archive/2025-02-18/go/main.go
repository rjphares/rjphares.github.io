package main

import (
	"os"
	"text/template"
)

var tpl *template.Template

func main() {
	// parse the template
	tpl = template.Must(template.ParseFiles("goindex.gohtml", "head.gohtml", "nav.gohtml", "article.gohtml", "footer.gohtml"))
	// create file index.html and write to index.html
	file, err := os.Create("../index.html")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	tpl.Execute(file, nil)
	//parse the template
	tpl = template.Must(template.ParseFiles("goarchive.gohtml", "head.gohtml", "nav.gohtml", "footer.gohtml", "slideshow.gohtml"))
	// create file archive.html and write to archive.html
	file, err = os.Create("../archive.html")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	// create struct archive
	type archive struct {
		Version   string;
		Link			string;
		Date 			string;
	}
	// create slice of archive
	archives := []archive{
		{"Version 6", "https://rjphares.github.io/Archive/2025-02-13/index.html", "2025-02-13"},
		{"Version 5", "https://rjphares.github.io/Archive/2025-02-11/index.html", "2025-02-11"},
		{"Version 4", "https://rjphares.github.io/Archive/2025-02-05/index.html", "2025-02-05"},
		{"Version 3", "https://rjphares.github.io/Archive/2025-02-01/index.html", "2025-02-01"},
		{"Version 2", "https://rjphares.github.io/Archive/2025-01-22/index.html", "2025-01-22"},
		{"Version 1", "https://rjphares.github.io/Archive/2025-01-19/index.html", "2025-01-19"},
	}
	// write to archive.html
	tpl.Execute(file, archives)
	//parse the template
	tpl = template.Must(template.ParseFiles("goabout.gohtml", "head.gohtml", "nav.gohtml", "section.gohtml", "footer.gohtml"))
	// create file about.html and write to about.html
	file, err = os.Create("../about.html")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	tpl.Execute(file, nil)
}