import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

	constructor() { }

	ngOnInit(): void { }

	public submit_article(form: NgForm): void
	{
		console.log(form.controls);
	}
}
