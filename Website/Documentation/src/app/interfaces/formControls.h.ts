import { AbstractControl, FormGroup } from "@angular/forms";
import { Codeblock, Header, Textarea } from "./inputFields.h";

export interface HeaderControl extends FormGroup
{
	value: Header;

	controls: {
		index: AbstractControl;
		type: AbstractControl;
		text: AbstractControl;
		header_level: AbstractControl;
	}
}

export interface CodeblockControl extends FormGroup
{
	value: Codeblock;

	controls: {
		index: AbstractControl;
		text: AbstractControl;
		type: AbstractControl;
		font_size: AbstractControl;
		language: AbstractControl;
	}
}

export interface TextareaControl extends FormGroup
{
	value: Textarea;

	controls: {
		index: AbstractControl;
		text: AbstractControl;
		type: AbstractControl;
		font_size: AbstractControl;
		font_style: AbstractControl;
		link: AbstractControl;
	}
}
