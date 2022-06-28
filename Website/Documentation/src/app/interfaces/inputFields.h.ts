export enum FieldType
{
  	Textarea,
  	Codeblock,
	Header
}

export interface Article
{
	title: string;
	author: string;
	date: string;
	category: string;
	tags: string[];
	content: Content[];
}

export interface Header extends Content
{
	header_level: number;
}

export interface Textarea extends Content
{
	font_size: number;
	font_style: string;
	color: string;
	link: Link;
}

export interface Codeblock extends Content
{
	font_size: number;
	language: string;
}

export interface Link
{
	text: string;
	url: string;
}

export interface Content
{
	index: number;
	type: number;
	text: string;
}
