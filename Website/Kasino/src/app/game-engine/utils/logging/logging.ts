import { ILogger, LogLevel } from "@microsoft/signalr";

export class ServerLogger implements ILogger
{
	public log(logLevel: LogLevel, message: string): void
	{
		let txt_color: string;
		let bg_color: string = '023047';

		switch (logLevel)
		{
			case LogLevel.Error:
				txt_color = 'ef233c';
				break;
			
			case LogLevel.Information:
				txt_color = 'ffffff';
				break;
			
			case LogLevel.Debug:
				txt_color = '219ebc';
				break;
			
			case LogLevel.Warning:
				txt_color = 'ffbe0b';
				break;
			
			default:
				txt_color = 'ffb703';
				break;
		}

		console.info(`\t%c ${LogLevel[logLevel]} - ${message}`, `background: #${bg_color}; color: #${txt_color};`);
	}
}